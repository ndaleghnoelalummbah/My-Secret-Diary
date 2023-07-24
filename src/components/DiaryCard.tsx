import React, { FC, useEffect, useState } from "react";
import { collection, getDocs, CollectionReference, DocumentData, where, query, Query, or } from "firebase/firestore";
import { db } from "../firebase";
import pvlock from "../resource/private-lock.png";
import pblock from "../resource/public-lock.png";
import { Timestamp } from "firebase/firestore";

interface DiaryEntry {
  id: string;
  category: string;
  description: string; //
  image: string;
  isPublic: boolean;
  createdAt: Timestamp;
}

interface Props {
  search: string;
}
const DiaryCard: FC<Props> = ({ search }) => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      const collectionRef: CollectionReference<DocumentData> = collection(db, "diaryEntries");
      const q: Query<DocumentData> = search ? query(collectionRef, where("category", "==", search)) : collectionRef;
      // const q2: Query<DocumentData> = search ? query(collectionRef, where("da", "==", search)) : collectionRef;
      // if (categoryFilter) {
      //   q = query(q, where("category", "==", categoryFilter));
      // }
      const querySnapshot = await getDocs(q);
      const entries: DiaryEntry[] = [];
      querySnapshot.forEach((doc) => {
        entries.push({
          id: doc.id,

          ...doc.data(),
        } as DiaryEntry);
      });
      setDiaryEntries(entries);
      console.log("diaryEntries", diaryEntries);
    };
    fetchDiaryEntries();
  }, [search]);

  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return (
    <div className="  flex flex-wrap    ">
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
