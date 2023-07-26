import React, { FC, useEffect, useState } from "react";
import { collection, getDocs, CollectionReference, DocumentData, where, or, query, Query, orderBy, OrderByDirection } from "firebase/firestore";
import { db } from "../firebase";
import pvlock from "../resource/private-lock.png";
import pblock from "../resource/public-lock.png";
import { Timestamp } from "firebase/firestore";
import { boolean } from "yup";
import Loader from "./Loader";
import { auth } from "../firebase";
import { useAppDispatch } from "../hooks/storeHook";

interface DiaryEntry {
  id: string;
  category: string;
  description: string; //
  image: string;
  isPublic: boolean;
  startDate: string;
  endDate: string;
  createdAt: Timestamp;
}

interface Props {
  search: string | boolean;
  category: string;
  startDate: string;
  endDate: string;
}

const DiaryCard: FC<Props> = ({ search, category, startDate, endDate }) => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      setIsLoading(true); // set loading to true before fetching data
      const collectionRef: CollectionReference<DocumentData> = collection(db, "diaryEntries");

      let q: Query<DocumentData> = collectionRef;

      if (category || startDate || endDate || search) {
        if (search) {
          // Use array-contains operator to look for partial matches in the description field
          q = query(q, where("description", "==", search));
        }

        // Use inequality operators to allow for partial matches in the other fields
        if (category) {
          q = query(q, where("category", "==", category));
        }
        if (startDate) {
          q = query(q, where("startDate", "==", startDate));
        }
        if (endDate) {
          q = query(q, where("endDate", "==", endDate));
        }
      }

//q = query(q, where("isPublic", "==", true));
q = query(q, or(where("userId", "==", userId), where("isPublic", "==", true)));
q = query(q, orderBy("createdAt", "desc" as OrderByDirection));

      const querySnapshot = await getDocs(q);
      const entries: DiaryEntry[] = [];
      querySnapshot.forEach((doc) => {
        entries.push({
          id: doc.id,

          ...doc.data(),
        } as DiaryEntry);
      });
      setDiaryEntries(entries);
      setIsLoading(false); // set loading to false after fetching data
      console.log("diaryEntries", diaryEntries);
    };
    fetchDiaryEntries();
  }, [search, category, startDate, endDate]);

  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return (
    <div className="  flex flex-wrap    ">
      <p>{category}</p>
      {isLoading && <Loader size={52} color="#000" />}
      {diaryEntries.map((entry) => (
        <div key={entry.id} className=" w-full py-4 md:w-1/2 lg:w-1/3 md:p-4">
          <div className=" flex row ">
            <img src={entry.image} alt={entry.category} className=" h-24 w-24" />{" "}
            <div className=" ml-6 p-2">
              <h2>{entry.category}</h2>
              <p>{`${formatter.formatToParts(entry.createdAt.toDate())[2].value} ${formatter.formatToParts(entry.createdAt.toDate())[0].value} ${formatter.formatToParts(entry.createdAt.toDate())[4].value} @ ${formatter.formatToParts(entry.createdAt.toDate())[6].value}:${formatter.formatToParts(entry.createdAt.toDate())[8].value}`}</p>
              {entry.isPublic === false ? (
                <div className=" flex">
                  <p>private</p> <img src={pvlock} alt={pvlock} className=" h-6 w-6 ml-2" />
                </div>
              ) : (
                <div className=" flex">
                  <p>public</p>
                  <img src={pblock} alt={pblock} className=" h-6 w-6 ml-2 max-w-34" />
                </div>
              )}
            </div>
          </div>
          <div className=" mt-4">
            <p>{entry.description}</p>
            {/* <p>{search}</p> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiaryCard;

// import React, { FC, useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import pvlock from "../resource/private-lock.png";
// import pblock from "../resource/public-lock.png";
// import { Timestamp } from "firebase/firestore";

// interface DiaryEntry {
//   id: string;
//   category: string;
//   description: string;
//   image: string;
//   isPublic: boolean;
//   createdAt: Timestamp;
// }

// interface Props {
//   search: string;
// }
// const DiaryCard: FC <Props>= ({ search }) => {
//   const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

//   useEffect(() => {
//     const fetchDiaryEntries = async () => {
//       const querySnapshot = await getDocs(collection(db, "diaryEntries"));
//       const entries: DiaryEntry[] = [];
//       querySnapshot.forEach((doc) => {
//         entries.push({
//           id: doc.id,
//           ...doc.data(),
//         } as DiaryEntry);
//       });
//       setDiaryEntries(entries);
//     };
//     fetchDiaryEntries();
//   }, []);

//   const formatter = new Intl.DateTimeFormat("en-US", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//     hour: "numeric",
//     minute: "numeric",
//   });
//   return (
//     <div className="  flex flex-wrap    ">
//       {diaryEntries.map((entry) => (
//         <div key={entry.id} className=" w-full py-4 md:w-1/2 lg:w-1/3 md:p-4">
//           <div className=" flex row ">
//             <img src={entry.image} alt={entry.category} className=" h-24 w-24" />{" "}
//             <div className=" ml-6 p-2">
//               <h2>{entry.category}</h2>
//               <p>{`${formatter.formatToParts(entry.createdAt.toDate())[2].value} ${formatter.formatToParts(entry.createdAt.toDate())[0].value} ${formatter.formatToParts(entry.createdAt.toDate())[4].value} @ ${formatter.formatToParts(entry.createdAt.toDate())[6].value}:${formatter.formatToParts(entry.createdAt.toDate())[8].value}`}</p>
//               {entry.isPublic === false ? (
//                 <div className=" flex">
//                   <p>private</p> <img src={pvlock} alt={pvlock} className=" h-6 w-6 ml-2" />
//                 </div>
//               ) : (
//                 <div className=" flex">
//                   <p>public</p>
//                   <img src={pblock} alt={pblock} className=" h-6 w-6 ml-2 max-w-34" />
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className=" mt-4">
//             <p>{entry.description}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DiaryCard;

//if (filter) {
//   q = query(q, where("category", "==", filter));
// }

// if (search) {
//   q = query(q, where("description", "==", search));
// }
// q = query(q, orderBy("createdAt", "desc" as OrderByDirection));
