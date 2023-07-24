import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = doc(db, "categories", "categories"); //reference a collection
        const categoriesDoc = await getDoc(categoriesRef); //reference a document in the collection
        const stringArray = categoriesDoc.data()?.categories;
        if (stringArray) {
          setCategories(stringArray);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return categories;
}