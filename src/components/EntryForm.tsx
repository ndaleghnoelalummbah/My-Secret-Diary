import React, { useState, useEffect,FC } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, getDoc, doc, updateDoc, addDoc, setDoc, DocumentData } from "firebase/firestore";
import { db, auth } from "../firebase";
import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../store";
import { createEntry } from "../features/entriesSlice";
import { Console } from "console";
import { toast } from "react-toastify";
import { useCategories } from "./categories";
import Loader from "./Loader";


// Define the initial values for the form
interface FormValues {
  //createdAt: Date;
  description: string;
  category: string;
  image: File | null;
  isPublic: boolean;
  startDate: string;
  endDate: string;
}

// Define the EntryForm component
//{ createEntry }: ConnectedProps<typeof connector>
const EntryForm = () => {
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const { categories, isLoading, setIsLoading } = useCategories();
  const [submittingForm, setSubmittingForm] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

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
    startDate: "",
    endDate: "",
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
    startDate: Yup.string().required("start date is required"),
    endDate: Yup.string().required("end date is required")
     .test(
      "is-after-startDate",
      "End date must come after start date",
      function (value) {
        const startDate = new Date(this.parent.startDate);
        const endDate = new Date(value);
        return !startDate || !endDate || endDate > startDate;
      }
     ),
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submitted) {
      timer = setTimeout(() => {
        setSubmitted(false);
        navigate("/journal");
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [submitted]);

  //creat a new document with a generated document id

  const onSubmit = async (values: FormValues, onSubmitProps: FormikHelpers<FormValues>) => {
    setSubmittingForm(true);
    setInitialValues({
      // createdAt: new Date(),
      description: values.description,
      category: values.category,
      image: values.image,
      isPublic: values.isPublic,
      startDate: values.startDate,
      endDate: values.endDate,
    });
    const { category, description, image, isPublic, startDate, endDate } = values;
    if (!values.image) return;
    const fileName = `${uuidv4()}.${values.image.name.split(".").pop()}`;
    const storageRef = ref(storage, `files/${fileName}`);
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
            userId,
            startDate,
            endDate,
          });

          // Set imgUrl to the download URL and reset the form
          setImgUrl(downloadURL);
          onSubmitProps.resetForm();
          setImagePreview(undefined);
          setSubmitted(true);
        } catch (error) {
          alert(error);
        } finally {
          setSubmittingForm(false); // Reset the isSubmitting state
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
            {submittingForm && <Loader size={52} color="#000" />}
            <div className="my-4">
              <label htmlFor="category">Category</label>
              <br />
              <Field as="select" name="category" id="category" className=" rounded-lg border-2 border-gray-700 w-full mt-2 py-2">
                <option value="" disabled>
                  Category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Field>
              {isLoading && <Loader size={32} color="#000" />}
              {errors.category && touched.category ? <div className=" text-red-400">{errors.category}</div> : null}
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <br />
              <Field as="textarea" name="description" id="description" className=" mt-2 p-1 border-2 border-gray-700 rounded-lg w-full h-16" />
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
            <div className=" my-4">
              <label htmlFor="startDate">Start Date</label>
              <br />
              <Field type="date" name="startDate" id="startDate" className=" mt-2 p-1 border-2 border-gray-700 rounded-lg w-full h-10" />
              {errors.startDate && touched.startDate ? <div className=" text-red-400">{errors.startDate}</div> : null}
            </div>
            <div>
              <label htmlFor="endDate">End Date</label>
              <br />
              <Field type="date" name="endDate" id="endDate" className=" mt-2 p-1 border-2 border-gray-700 rounded-lg w-full h-10" />
              {errors.endDate && touched.endDate ? <div className=" text-red-400">{errors.endDate}</div> : null}
            </div>
            <button type="submit" disabled={submittingForm} className="bg-black text-white font-semibold w-full py-3 mx-auto my-16 rounded-lg">
              Save
            </button>
            {submitted && (
              <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
                <div className=" bg-white bg-opacity-500 p-8 h-32 rounded-lg shadow-lg">
                  <p>Diary entry saved Sucessfully.</p>
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
