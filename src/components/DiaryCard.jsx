import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const DiaryCard = () => {
  const [diaryEntries, setDiaryEntries] = useState([]);

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      const querySnapshot = await getDocs(collection(db, "diaryEntries"));
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setDiaryEntries(entries);
    };
    fetchDiaryEntries();
  }, []);

  return (
    <div className=" max-w-3xl mx-auto my-5">
      {diaryEntries.map((entry) => (
        <div key={entry.id}>
          <h2>{entry.category}</h2>
          <p>{entry.description}</p>
          <img src={entry.image} alt={entry.category} className=" h-24 w-24" />
          <p>{entry.createdAt.toDate().toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default DiaryCard;
