import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const categoriesRef = doc(db, "categories", "categories"); //reference a collection
        const categoriesDoc = await getDoc(categoriesRef); //reference a document in the collection
        const stringArray = categoriesDoc.data()?.categories;
        if (stringArray) {
          setCategories(stringArray);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, isLoading, setIsLoading };
}