import { useState } from "react";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const Categories = () => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [progresspercent, setProgresspercent] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     const form = e.target as HTMLFormElement;
     const fileInput = form.elements[0] as HTMLInputElement;
     const file = fileInput.files?.[0];
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className="bg-gray-200">
      <h1>get storage</h1>
      <form onSubmit={handleSubmit} className="form">
        <input type="file" />
        <button type="submit">Upload</button>
      </form>
      {!imgUrl && (
        <div className="border-2 border-blue-200">
          <div className="border-2 border-red-200" style={{ width: `${progresspercent}%` }}>
            {/* {progresspercent}% */}
          </div>
        </div>
      )}
      {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />}
    </div>
  );
};
export default Categories;

// import { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { storage, firestore } from "../firebase";
// import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
// import { addDoc, collection } from "firebase/firestore";

// interface FormValues {
//   category: string;
//   description: string;
//   image: File | null;
//   isPublic: boolean;
// }

// const Categories = () => {
//   const [imgUrl, setImgUrl] = useState<string | null>(null);
//   const [progresspercent, setProgresspercent] = useState<number>(0);

//   const formik = useFormik<FormValues>({
//     initialValues: {
//       category: "",
//       description: "",
//       image: null,
//       isPublic: false,
//     },
//     validationSchema: Yup.object({
//       category: Yup.string().required("Required"),
//       description: Yup.string().required("Required"),
//       image: Yup.mixed<File>().required("Required"),
//     }),
//     onSubmit: async (values) => {
//       const { category, description, image, isPublic } = values;
//       if (!image) return;

//       // Upload image to storage
//       const storageRef = ref(storage, `files/${image.name}`);
//       const uploadTask = uploadBytesResumable(storageRef, image);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//           setProgresspercent(progress);
//         },
//         (error) => {
//           alert(error);
//         },
//         async () => {
//           // Get download URL and create Firestore document
//           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//           setImgUrl(downloadURL);

//           const diaryEntriesRef = collection(firestore, "diaryEntries");
//           await addDoc(diaryEntriesRef, {
//             category,
//             description,
//             imageUrl: downloadURL,
//             isPublic,
//             createdAt: new Date(),
//           });
//         }
//       );
//     },
//   });

//   return (
//     <div className="bg-gray-200">
//       <h1>get storage</h1>
//       <form onSubmit={formik.handleSubmit} className="form">
//         <div className="form-control">
//           <label htmlFor="category">Category</label>
//           <select id="category" name="category" onChange={formik.handleChange} value={formik.values.category}>
//             <option value="">Select a category</option>
//             <option value="category1">Category 1</option>
//             <option value="category2">Category 2</option>
//             <option value="category3">Category 3</option>
//           </select>
//           {formik.errors.category && formik.touched.category && <div className="error">{formik.errors.category}</div>}
//         </div>
//         <div className="form-control">
//           <label htmlFor="description">Description</label>
//           <textarea id="description" name="description" onChange={formik.handleChange} value={formik.values.description}></textarea>
//           {formik.errors.description && formik.touched.description && <div className="error">{formik.errors.description}</div>}
//         </div>
//         <div className="form-control">
//           <label htmlFor="image">Image</label>
//           <input
//             type="file"
//             id="image"
//             name="image"
//             onChange={(event) => {
//               formik.setFieldValue("image", event.currentTarget.files?.[0] || null);
//             }}
//           />
//           {formik.errors.image && formik.touched.image && <div className="error">{formik.errors.image}</div>}
//         </div>
//         <div className="form-control">
//           <label htmlFor="isPublic">Public?</label>
//           <input type="checkbox" id="isPublic" name="isPublic" onChange={formik.handleChange} checked={formik.values.isPublic} />
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//       {!imgUrl && (
//         <div className="border-2 border-blue-200">
//           <div className="border-2 border-red-200" style={{ width: `${progresspercent}%` }}>
//             {progresspercent}%
//           </div>
//         </div>
//       )}
//       {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />}
//     </div>
//   );
// };

// export default Categories;

// import { Formik, Form, Field, FormikHelpers } from "formik";
// import { db } from "../firebase";
// import { collection, getDoc, doc, DocumentData } from "firebase/firestore";
// import React, { useState, useEffect } from "react";
// import * as Yup from "yup";

// interface FormValues {
//   email: string;
//   password: string;
//   isPublic: boolean;
//   category: string;
//   description: string;
//   image: File | null;
// }

// const Categories = () => {
//   const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setImagePreview(imageUrl);
//     } else {
//       setImagePreview(undefined);
//     }
//   };

//   const handleSubmit = (values: FormValues, onSubmitProps: FormikHelpers<FormValues>) => {
//     setInitialValues({
//       description: values.description,
//       category: values.category,
//       image: values.image,
//       isPublic: values.isPublic,
//       email: values.email,
//       password: values.password,
//     });
//     console.log(values); // log the form values
//     onSubmitProps.resetForm(); // reset the form after submission
//   };
//   const [categories, setCategories] = useState<string[]>([]);
//   useEffect(() => {
//     getCategories();
//   }, []);

//   function getCategories() {
//     const fetchStrings = async () => {
//       try {
//         const categoriesRef = doc(db, "categories", "categories");
//         const categoriesDoc = await getDoc(categoriesRef);
//         const stringArray = categoriesDoc.data()?.categories;
//         if (stringArray) {
//           setCategories(stringArray);
//           console.log("arr", stringArray);
//           console.log("cat", categories);
//         }
//       } catch (error) {
//         console.error("Error fetching strings:", error);
//       }
//     };
//     fetchStrings();
//   }

//   const [initialValues, setInitialValues] = useState<FormValues>({
//     email: "",
//     password: "",
//     category: "",
//     description: " hghj",
//     image: null,
//     isPublic: false,
//   });

//   // Define the validation schema using Yup
//   const validationSchema = Yup.object({
//     description: Yup.string().required("Description is required"),
//     category: Yup.string().required("Category is required"),
//     image: Yup.mixed()
//       .test("fileSize", "File size is too large", (value: Yup.AnyObject | undefined) => {
//         if (!value) return true; // Skip validation if no file is selected
//         const file = value as File;
//         return file.size ? file.size <= 1024 * 1024 : false; // 1MB
//       })
//       .test("fileType", "Only image files are allowed", (value: Yup.AnyObject | undefined) => {
//         if (!value) return true; // Skip validation if no file is selected
//         const file = value as File;
//         return file.type ? ["image/jpeg", "image/png", "image/gif"].includes(file.type) : false;
//       }),
//   });

//   return (
//     <div className=" max-w-xl mx-auto my-5 ">
//       <Formik<FormValues> initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
//         {({ errors, touched, isSubmitting, setFieldValue }) => (
//           <Form>
//             <div className="my-4">
//               <label htmlFor="category">Category</label>
//               <br />
//               <Field as="select" name="category" id="category" className=" rounded-lg border-2 border-gray-700 w-full mt-2 py-2">
//                 <option value="" disabled>
//                   category
//                 </option>
//                 {categories.map((category) => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </Field>
//               {errors.category && touched.category ? <div className=" text-red-400">{errors.category}</div> : null}
//             </div>
//             <div>
//               <label htmlFor="description">Description</label>
//               <br />
//               <Field as="textarea" name="description" id="description" className=" mt-2 border-2 border-gray-700 rounded-lg w-full h-24" />
//               {errors.description && touched.description ? <div className=" text-red-400">{errors.description}</div> : null}
//             </div>
//             <div className="my-2">
//               <label htmlFor="image">Upload Image (optional)</label>
//               <br />
//               <div className="bg-gray-100 bg-opacity-80 h-64 mt-1 mb-4 ">
//                 {/* <div className="bg-slate-200 bg-opacity-60  h-40 w-3/4 mx-auto py-2 "> */}
//                 {imagePreview && <img src={imagePreview} alt="Preview of uploaded image" className="h-52 w-full mx-auto " />}
//                 <div className="mt-2 mx-auto bg-green-100 w-52">
//                   {" "}
//                   <input
//                     type="file"
//                     id="image"
//                     name="image"
//                     onChange={(event) => {
//                       setFieldValue("image", event.currentTarget.files?.[0] || null);
//                       if (event.currentTarget.files?.[0]) {
//                         const imageUrl = URL.createObjectURL(event.currentTarget.files?.[0]);
//                         setImagePreview(imageUrl);
//                       } else {
//                         setImagePreview(undefined);
//                       }
//                     }}
//                     // onChange={handleImageChange}
//                   />
//                 </div>
//                 {/* </div> */}
//               </div>
//             </div>

//             <div>
//               <Field type="email" name="email" id="email" className=" border-2 border-black" />
//             </div>
//             <div>
//               <Field type="password" name="password" id="password" className=" border-2 border-black" />
//               <br />
//             </div>
//             <Field type="checkbox" name="isPublic" id="isPublic" />
//             <label htmlFor="isPublic" className=" ml-4">
//               Is entry public?
//             </label>
//             <button type="submit" disabled={isSubmitting} className="bg-black text-white font-semibold w-full py-3 mx-auto my-6 rounded-lg">
//               Save
//             </button>
//           </Form>
//         )}
//       </Formik>
//       <p>{initialValues.description}</p>
//     </div>
//   );
// };
// export default Categories;
// // import React, { useState, useEffect } from "react";
// // import { collection, doc, getDoc } from "firebase/firestore";
// // import { db } from "../firebase";

// // const Categories = () => {
// //   const [strings, setStrings] = useState<string[]>([]);

// //   // const docref = doc(db, " categories", "categories");
// //   // const docsnap = await getDoc(docref);

// //   useEffect(() => {
// //     const fetchStrings = async () => {
// //       try {
// //         const categoriesRef = doc(db, "categories", "categories");
// //         const categoriesDoc = await getDoc(categoriesRef);
// //         const stringArray = categoriesDoc.data()?.categories;
// //         if (stringArray) {
// //           setStrings(stringArray);
// //         console.log("arr", stringArray);

// //         }
// //       } catch (error) {
// //         console.error("Error fetching strings:", error);
// //       }
// //     };
// //     fetchStrings();
// //   }, []);

// //   return (
// //     <div>

// //       {strings.map((string, index) => (
// //         <div key={index}>
// //           <p>{string}</p>
// //         </div>
// //       ))}

// //     </div>
// //   );
// // };

// // export default Categories;
