import React, { useState, FC } from "react";
import { useCategories } from "./categories";
import Loader from "./Loader";
import { FormValues } from "../pages/Dashboard";

interface Props {
  setShowForm: (showForm: boolean) => void;
  initialValues: FormValues;
  setInitialValues: React.Dispatch<React.SetStateAction<FormValues>>;
}

const FilterForm: FC<Props> = ({ setShowForm, initialValues, setInitialValues }) => {
  const { categories, isLoading, setIsLoading } = useCategories();
  const [submittingForm, setSubmittingForm] = useState(false);
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSubmittingForm(true);
    setInitialValues({
      ...initialValues,
      [event.target.name]: event.target.value,
    });
    setSubmittingForm(false);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowForm(false);
    console.log(initialValues);
    
    // submit form with formValues
  };

  return (
    <div className=" w-screen h-screen fixed top-0 right-0 left-0 flex justify-end z-50">
      <div className=" h-full bg-white  right-0  w-2/3 md:w-1/4 ">
        <div className="bg-black p-7 ">
          <h2 className="text-white font-bold text-lg mt-2 ml-4 ">Filter</h2>
        </div>
        <div className=" p-6 shadow-lg  h-full ">
          <h2 className=" font-semibold text-2xl">Filter your diary entries</h2>
          <form onSubmit={handleSubmit}>
            <div className="my-6">
              <label htmlFor="category">Category</label>
              <br />
              <select value={initialValues.category} name="category" id="category" onChange={handleChange} className=" rounded-lg border-2 border-gray-700 w-full mt-1 py-2">
                <option value="" disabled>
                  Category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {isLoading && <Loader size={32} color="#000" />}
            </div>
            <div>
              <label htmlFor="startDate">Start Date</label>
              <br />
              <input type="date" name="startDate" id="startDate" value={initialValues.startDate} onChange={handleChange} className=" rounded-lg border-2 border-gray-700 w-full mt-1 py-2" />
            </div>
            <div className="my-6">
              <label htmlFor="endDate">End Date</label>
              <br />
              <input type="date" name="endDate" id="endDate" value={initialValues.endDate} onChange={handleChange} className=" rounded-lg border-2 border-gray-700 w-full mt-1 py-2" />
            </div>

            <button type="submit" disabled={submittingForm} className="bg-black text-white font-semibold w-full py-3 mx-auto my-4 rounded-lg">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default FilterForm;
