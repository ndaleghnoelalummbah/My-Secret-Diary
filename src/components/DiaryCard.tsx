import React, { FC, useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, CollectionReference, DocumentData, where, or, query, Query, orderBy, OrderByDirection, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import pvlock from "../resource/private-lock.png";
import pblock from "../resource/public-lock.png";
import { Timestamp } from "firebase/firestore";
import { storage } from "../firebase";
import { ref, deleteObject } from "firebase/storage";
import { boolean } from "yup";
import Loader from "./Loader";
import { auth } from "../firebase";
import { useAppDispatch } from "../hooks/storeHook";
import greentoggle from "../resource/greentoggle.png";
import redtoggle from "../resource/redtoggle.png";
import delet from "../resource/delete.png";
import warning from "../resource/warning.png";

interface DiaryEntry {
  id: string;
  userId: string;
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
  const [showWarning, setShowWarning] = useState(false);
  // Define the state variable for the entry being deleted
  const [deleteEntry, setDeleteEntry] = useState<DiaryEntry | null>(null);

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

  // Define the function to handle the delete button click
  const handleDelete = (entry: DiaryEntry) => {
    // Set the deletingEntry state variable to the current entry
    setDeleteEntry(entry);
  };

  // Define the function to handle the custom confirm button click
  const confirmDelete = async () => {
    if (deleteEntry) {
      try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, "diaryEntries", deleteEntry.id));

        // Delete the image from Storage
        const imageRef = ref(storage, deleteEntry.image);
        await deleteObject(imageRef);

        console.log(`Diary entry with ID ${deleteEntry.id} and image ${deleteEntry.image} deleted successfully!`);

        // Remove the deleted diary entry from the state
        setDiaryEntries(diaryEntries.filter((e) => e.id !== deleteEntry.id));
      } catch (error) {
        console.error("Error deleting diary entry:", error);
      }

      // Reset the deletingEntry state variable to null
      setDeleteEntry(null);
    }
  };

  // Define the function to handle the custom cancel button click
  const cancelDelete = () => {
    // Reset the deletingEntry state variable to null
    setDeleteEntry(null);
  };

  const togglePublic = async (entry: DiaryEntry) => {
    try {
      // Update the document in Firestore with the new isPublic value
      await updateDoc(doc(db, "diaryEntries", entry.id), {
        isPublic: !entry.isPublic,
      });

      console.log(`Diary entry with ID ${entry.id} updated successfully!`);

      // Update the entry in the state with the new isPublic value
      setDiaryEntries(diaryEntries.map((prev) => (prev.id === entry.id ? { ...prev, isPublic: !entry.isPublic } : prev)));
    } catch (error) {
      console.error("Error updating diary entry:", error);
    }
  };
  return (
    <div className="  flex flex-wrap    ">
      {isLoading && <Loader size={52} color="#000" />}
      {diaryEntries.map((entry) => (
        <div key={entry.id} className=" w-full py-4 md:w-1/2 lg:w-1/3 md:p-4  ">
          <div className=" flex row ">
            <img src={entry.image} alt={entry.category} className=" h-24 w-24" />{" "}
            <div className=" ml-6 p-2">
              <h2>{entry.category}</h2>
              <p>{`${formatter.formatToParts(entry.createdAt.toDate())[2].value} ${formatter.formatToParts(entry.createdAt.toDate())[0].value} ${formatter.formatToParts(entry.createdAt.toDate())[4].value} @ ${formatter.formatToParts(entry.createdAt.toDate())[6].value}:${formatter.formatToParts(entry.createdAt.toDate())[8].value}`}</p>
              {entry.isPublic === false ? (
                <div className=" flex">
                  <p>private</p> <img src={pvlock} alt={pvlock} className=" h-6 w-6 ml-1" />
                  {entry.userId == userId && <img src={redtoggle} alt={redtoggle} onClick={() => togglePublic(entry)} className=" h-5 w-7 ml-3" />}
                </div>
              ) : (
                <div className=" flex">
                  <p>public</p>
                  <img src={pblock} alt={pblock} className=" h-6 w-6 ml-1 max-w-34" />
                  {entry.userId == userId && <img src={greentoggle} alt={greentoggle} onClick={() => togglePublic(entry)} className=" h-5 w-7 ml-3" />}
                </div>
              )}
            </div>
            {entry.userId == userId && <img src={delet} alt={delet} onClick={() => handleDelete(entry)} className=" h-6 w-4 ml-auto mt-4" />}
          </div>
          <div className=" mt-4">
            <p>{entry.description}</p>
          </div>
          {deleteEntry && (
            <div className="fixed top-0  left-0 w-screen h-screen flex  items-center justify-center z-50">
              <div className=" bg-white bg-opacity-500 h-4/6 w-2/3 rounded-lg shadow-lg  ">
                <div className=" bg-orange-600 py-6  ">
                  <p className=" text-center text-white font-bold text-xl">Delete #2</p>
                </div>
                <div className=" px-3 pt-2">
                  <img src={warning} alt={warning} className=" h-28 w-32 mx-auto my-9" />
                  <p className=" text-orange-600 text-lg font-extrabold text-center">Are you sure you want to delete this diary entry?</p>
                </div>
                <div className=" flex row justify-around mt-10 ">
                  <button className=" bg-black rounded-lg text-white font-medium  px-8 py-2" onClick={cancelDelete}>
                    No
                  </button>
                  <button onClick={confirmDelete} className=" border-2 border-orange-800 rounded-lg text-orange-600 font-bold px-8 py-2">
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DiaryCard;
