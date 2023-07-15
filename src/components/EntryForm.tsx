import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { collection, getDoc, doc, addDoc, setDoc, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../store";
import { createEntry } from "../features/entriesSlice";
import { Console } from "console";

// Define the initial values for the form
interface FormValues {
  description: string;
  category: string;
  image: File | null;
  isPublic: boolean;
}
// Define the EntryForm component
//{ createEntry }: ConnectedProps<typeof connector>
const EntryForm = () => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    getCategories();
  }, []);

  function getCategories() {
    const fetchStrings = async () => {
      try {
        const categoriesRef = doc(db, "categories", "categories");
        const categoriesDoc = await getDoc(categoriesRef);
        const stringArray = categoriesDoc.data()?.categories;
        if (stringArray) {
          setCategories(stringArray);
          console.log("arr", stringArray);
          console.log("cat", categories);
        }
      } catch (error) {
        console.error("Error fetching strings:", error);
      }
    };
    fetchStrings();
  }

  const [initialValues, setInitialValues] = useState<FormValues>({
    description: "",
    category: "",
    image: null,
    isPublic: false,
  });
  //const [formData, setFormData] = useState(initialValues);

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    description: Yup.string().required("Description is required"),
    // category: Yup.string().required("Category is required"),
    image: Yup.mixed()
      .test("fileSize", "File size is too large", (value: Yup.AnyObject | undefined) => {
        if (!value) return true; // Skip validation if no file is selected
        const file = value as File;
        return file.size ? file.size <= 1024 * 1024 : false; // 1MB
      })
      .test("fileType", "Only image files are allowed", (value: Yup.AnyObject | undefined) => {
        if (!value) return true; // Skip validation if no file is selected
        const file = value as File;
        return file.type ? ["image/jpeg", "image/png", "image/gif"].includes(file.type) : false;
      }),
  });

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setImagePreview(imageUrl);
  //   } else {
  //     setImagePreview(undefined);
  //   }
  // };

//creat a new document with a generated document id
const diaryRef = doc(collection(db,"categories"));
 
  const onSubmit = (values: FormValues, onSubmitProps: FormikHelpers<FormValues>) => {
    setInitialValues({
      description: values.description,
      category: values.category,
      image: values.image,
      isPublic: values.isPublic,
    });
    // later write to the document by merging to the existing content
    //await setDoc(diaryRef, initialValues, {merge: true})
    console.log(values);
    onSubmitProps.resetForm();
    // alert("yuu")
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
              <Field as="textarea" name="description" id="description" className=" mt-2 border-2 border-gray-700 rounded-lg w-full h-24" />
              {errors.description && touched.description ? <div className=" text-red-400">{errors.description}</div> : null}
            </div>
            <div className="my-2">
              <label htmlFor="image">Upload Image (optional)</label>
              <br />
              <div className="bg-gray-100 bg-opacity-80 h-64 mt-1 mb-4 ">
                {/* <div className="bg-slate-200 bg-opacity-60  h-40 w-3/4 mx-auto py-2 "> */}
                {imagePreview && <img src={imagePreview} alt="Preview of uploaded image" className="h-52 w-full mx-auto " />}
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
            {/* <button onClick={onSubmit} type="button">console</button> */}
          </Form>
        )}
      </Formik>
      <p>{initialValues.description}</p>
      {/* <p>{categories}</p> */}
    </div>
  );
};
export default EntryForm;
// // Define the mapStateToProps function to connect the createEntry action to the EntryForm component
// const mapStateToProps = (state: RootState) => ({});

// // Define the mapDispatchToProps function to connect the createEntry action to the EntryForm component
// const mapDispatchToProps = {
//   createEntry,
// };

// // Connect the EntryForm component to the Redux store using the connect function from react-redux
// const connector = connect(mapStateToProps, mapDispatchToProps);
// export default connector(EntryForm);

//URL.createObjectURL(file)

// Define the submit function for the form
// const onSubmit = async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
//   // Create a reference to the Firestore database and the Firebase storage
//   try {
//     const storageRef = storage.ref();

//     // Create a reference to the image file with a unique ID generated by uuidv4
//     const imageRef = storageRef.child(`images/${uuidv4()}`);

//     // Upload the image file to Firebase storage
//     const uploadTask = imageRef.put(values.image as File);
//     uploadTask.on(
//       "state_changed",
//       null,
//       (error: Error) => {
//         console.error(error);
//       },
//       async () => {
//         // Once the image is uploaded, get the download URL and create a new entry in Firestore
//         const imageUrl = await imageRef.getDownloadURL();
//         const entriesRef = db.collection("entries");
//         const newEntry = {
//           description: values.description,
//           category: values.category,
//           image: values.image,
//           isPublic: values.isPublic,
//           createdAt: new Date(),
//         };
//         await entriesRef.add(newEntry);

//         // Dispatch the "createEntry" action with the new entry
//         createEntry(newEntry);

//         // Reset the form
//         resetForm();

//       }
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };

//   const handleFormSubmitwrong = async (values: PostFormValues) => {
//     try {
// //const db = firebase.firestore();
//       const postsRef = db.collection("posts");
//       const newPost = {
//         description: values.description || null,
//         image: values.image?.url || null,
//         isPublic: values.isPublic,
//         category: values.category,
//         userId:auth.currentUser?.uid || null,
//         createdAt: db.FieldValue.serverTimestamp(),
//       };
//       await postsRef.add(newPost);
//       onSubmit(values);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleFormSubmit}>
//       {({ isSubmitting, setFieldValue }) => (
//         <Form>
//           <div>
//             <label htmlFor="description">Description</label>
//             <Field as="textarea" name="description" id="description" />
//             <ErrorMessage name="description" component="div" />
//           </div>
//           <div>
//             <label htmlFor="image">Image</label>
//             <input type="file" accept="image/*" onChange={handleFileUpload} />
//             {values.image && <img src={values.image.url} alt={values.image.name} />}
//             <ErrorMessage name="image" component="div" />
//           </div>
//           <div>
//             <Field type="checkbox" name="isPublic" id="isPublic" />
//             <label htmlFor="isPublic">IsPublic</label>
//             <ErrorMessage name="isPublic" component="div" />
//           </div>
//           <div>
//             <label htmlFor="category">Category</label>
//             <Field as="select" name="category" id="category">
// {categories.map((category) => (
//   <option key={category} value={category}>
//     {category}
//   </option>
// ))}
//             </Field>
//             <ErrorMessage name="category" component="div" />
//           </div>
//           <button type="submit" disabled={isSubmitting}>
//             Submit
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default EntryForm;