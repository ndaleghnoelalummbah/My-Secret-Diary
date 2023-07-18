// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// interface FormValues {
//   image: File | null;
// }

// const validationSchema = Yup.object().shape({
//   image: Yup.mixed()
//     .test("fileSize", "File size is too large", (value: File | undefined) => {
//       if (!value) return true; // Skip validation if no file is selected
//       return value.size <= 1024 * 1024; // 1MB
//     })
//     .test("fileType", "Only image files are allowed", (value:File |undefined) => {
//       if (!value) return true; // Skip validation if no file is selected
//       return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
//     }),
// });

// function MyForm() {
//   const initialValues: FormValues = {
//     image: null,
//   };

//   const handleSubmit = (values: FormValues) => {
//     console.log(values);
//   };

//   return (
//     <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
//       {({ values, setFieldValue, errors, touched }) => (
//         <Form>
//           <label htmlFor="image">Upload an image:</label>
//           <Field
//             id="image"
//             name="image"
//             type="file"
//             onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//               setFieldValue("image", event.currentTarget.files?.[0] || null);
//             }}
//             className={touched.image && errors.image ? "border-red-500" : ""}
//           />
//           <ErrorMessage name="image" className="text-red-500" />
//           <button type="submit">Submit</button>
//         </Form>
//       )}
//     </Formik>
//   );
// }

// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// interface FormValues {
//   image: File | null;
// }

// const validationSchema = Yup.object().shape({
//   image: Yup.mixed()
//     .test("fileSize", "File size is too large", (value: File | undefined) => {
//       if (!value) return true; // Skip validation if no file is selected
//       return value.size ? value.size <= 1024 * 1024 : false; // 1MB
//     })
//     .test("fileType", "Only image files are allowed", (value: File | undefined) => {
//       if (!value) return true; // Skip validation if no file is selected
//       return value.type ? ["image/jpeg", "image/png", "image/gif"].includes(value.type) : false;
//     }),
// });

// function MyForm() {
//   const initialValues: FormValues = {
//     image: null,
//   };

//   const handleSubmit = (values: FormValues) => {
//     console.log(values);
//   };

//   return (
//     <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
//       {({ values, setFieldValue, errors, touched }) => (
//         <Form>
//           <label htmlFor="image">Upload an image:</label>
//           <Field
//             id="image"
//             name="image"
//             type="file"
//             onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//               setFieldValue("image", event.currentTarget.files?.[0] || null);
//             }}
//             className={touched.image && errors.image ? "border-red-500" : ""}
//           />
//           <ErrorMessage name="image" className="text-red-500" />
//           <button type="submit">Submit</button>
//         </Form>
//       )}
//     </Formik>
//   );
// }

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface FormValues {
  image: File | null;
}

const validationSchema = Yup.object().shape({
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

const Trialform=()=> {
  const initialValues: FormValues = {
    image: null,
  };

  const handleSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, setFieldValue, errors, touched }) => (
        <Form>
          <label htmlFor="image">Upload an image:</label>
          <Field
            id="image"
            name="image"
            type="file"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFieldValue("image", event.currentTarget.files?.[0] || null);
            }}
            className={touched.image && errors.image ? "border-red-500" : ""}
          />
          <ErrorMessage name="image" className="text-red-500" />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}
export default Trialform;

// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// interface FormValues {
//   image: File | null;
// }

// const validationSchema = Yup.object().shape({
//   image: Yup.mixed()
//     .test("fileSize", "File size is too large", (value: AnyPresentValue | undefined) => {
//       if (!value) return true; // Skip validation if no file is selected
//       const file = value as File;
//       return file.size ? file.size <= 1024 * 1024 : false; // 1MB
//     })
//     .test("fileType", "Only image files are allowed", (value: AnyPresentValue | undefined) => {
//       if (!value) return true; // Skip validation if no file is selected
//       const file = value as File;
//       return file.type ? ["image/jpeg", "image/png", "image/gif"].includes(file.type) : false;
//     }),
// });

// function Trialform() {
//   const initialValues: FormValues = {
//     image: null,
//   };

//   const handleSubmit = (values: FormValues) => {
//     console.log(values);
//   };

//   return (
//     <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
//       {({ values, setFieldValue, errors, touched }) => (
//         <Form>
//           <label htmlFor="image">Upload an image:</label>
//           <Field
//             id="image"
//             name="image"
//             type="file"
//             onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//               setFieldValue("image", event.currentTarget.files?.[0] || null);
//             }}
//             className={touched.image && errors.image ? "border-red-500" : ""}
//           />
//           <ErrorMessage name="image" className="text-red-500" />
//           <button type="submit">Submit</button>
//         </Form>
//       )}
//     </Formik>
//   );
// }
