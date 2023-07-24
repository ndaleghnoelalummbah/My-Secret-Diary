import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, getDoc, doc, updateDoc, addDoc, setDoc, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../store";
import { createEntry } from "../features/entriesSlice";
import { Console } from "console";
import { toast } from "react-toastify";
import { useCategories } from "./categories";

// Define the initial values for the form
interface FormValues {
  //createdAt: Date;
  description: string;
  category: string;
  image: File | null;
  isPublic: boolean;
}

// Define the EntryForm component
//{ createEntry }: ConnectedProps<typeof connector>
const EntryForm = () => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
  const [refresh, setRefresh] = useState(true);
const categories = useCategories();
  // useEffect(() => {
  //   getCategories();
  // }, []);

  // function getCategories() {
  //   const fetchStrings = async () => {
  //     try {
  //       const categoriesRef = doc(db, "categories", "categories"); //reference a collection
  //       const categoriesDoc = await getDoc(categoriesRef); //reference a document in the collection
  //       const stringArray = categoriesDoc.data()?.categories;
  //       if (stringArray) {
  //         setCategories(stringArray);
  //         console.log("arr", stringArray);
  //         console.log("cat", categories);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching strings:", error);
  //     }
  //   };
  //   fetchStrings();
  // }
  const [initialValues, setInitialValues] = useState<FormValues>({
    // createdAt: new Date(),
    description: "",
    category: "",
    image: null,
    isPublic: false,
  });
  // const [formData, setFormData] = useState({...initialValues, createdAt: null});

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    description: Yup.string().required("Description is required"),
    // category: Yup.string().required("Category is required"),
    image: Yup.mixed()
      .notRequired()
      .test("fileSize", "File size is too large", (value: Yup.AnyObject | null | undefined) => {
        if (!value) return true; // Skip validation if no file is selected
        const file = value as File;
        return file.size ? file.size <= 1024 * 1024 : false; // 1MB
      })
      .test("fileType", "Only image files are allowed", (value: Yup.AnyObject | null | undefined) => {
        if (!value) return true; // Skip validation if no file is selected
        const file = value as File;
        return file.type ? ["image/jpeg", "image/png", "image/gif"].includes(file.type) : false;
      }),
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (submitted) {
      timer = setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [submitted]);

  //creat a new document with a generated document id

  const onSubmit = async (values: FormValues, onSubmitProps: FormikHelpers<FormValues>) => {
    setInitialValues({
      // createdAt: new Date(),
      description: values.description,
      category: values.category,
      image: values.image,
      isPublic: values.isPublic,
    });
    const { category, description, image, isPublic } = values;
    if (!values.image) return;
    const storageRef = ref(storage, `files/${values.image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, values.image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        alert(error);
      },
      async () => {
        try {
          // Get download URL and create Firestore document
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const entriesCollectionRef = collection(db, "diaryEntries");
          const entriesDocRef = await addDoc(entriesCollectionRef, {
            category,
            description,
            image: downloadURL,
            isPublic,
            createdAt: new Date(),
          });

          // Set imgUrl to the download URL and reset the form
          setImgUrl(downloadURL);
          onSubmitProps.resetForm();
          setImagePreview(undefined);
          setSubmitted(true);
        } catch (error) {
          alert(error);
        }
      }
    );
  };
  // Render the form using Formik and Field components from formik
  return (
    <div className=" max-w-xl mx-auto my-5 ">
      <Formik<FormValues> initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="my-4">
              <label htmlFor="category">Category</label>
              <br />
              <Field as="select" name="category" id="category" className=" rounded-lg border-2 border-gray-700 w-full mt-2 py-2">
                <option value="" disabled>
                  category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Field>
              {errors.category && touched.category ? <div className=" text-red-400">{errors.category}</div> : null}
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <br />
              <Field as="textarea" name="description" id="description" className=" mt-2 p-1 border-2 border-gray-700 rounded-lg w-full h-24" />
              {errors.description && touched.description ? <div className=" text-red-400">{errors.description}</div> : null}
            </div>
            <div className="my-2">
              <label htmlFor="image">Upload Image (optional)</label>
              <br />
              <div className="bg-gray-100 bg-opacity-80 h-64 mt-1 mb-4 ">
                {/* <div className="bg-slate-200 bg-opacity-60  h-40 w-3/4 mx-auto py-2 "> */}
                {imagePreview && <img src={imagePreview} alt="Preview of uploaded image" className="h-52 w-full mx-auto " />}

                {/* {imgUrl && <img src={imgUrl} alt="uploaded file" className="h-52 w-full mx-auto " />} */}
                <div className="mt-2 mx-auto bg-green-100 w-52">
                  {" "}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    // onChange={(event) => {
                    //   setFieldValue("image", event.currentTarget.files?.[0] || null);
                    //                  }}
                    onChange={(event) => {
                      setFieldValue("image", event.currentTarget.files?.[0] || null);
                      if (event.currentTarget.files?.[0]) {
                        const imageUrl = URL.createObjectURL(event.currentTarget.files?.[0]);
                        setImagePreview(imageUrl);
                      } else {
                        setImagePreview(undefined);
                      }
                    }}
                  />
                </div>
                {/* </div> */}
              </div>
            </div>
            <div>
              <Field type="checkbox" name="isPublic" id="isPublic" />
              <label htmlFor="isPublic" className=" ml-4">
                Is entry public?
              </label>
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-black text-white font-semibold w-full py-3 mx-auto my-6 rounded-lg">
              Save
            </button>
            {submitted && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <p>Form Sucessfully Submitted.</p>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default EntryForm;
