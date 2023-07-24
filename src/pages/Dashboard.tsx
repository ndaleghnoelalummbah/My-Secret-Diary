import React, { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Link } from "react-router-dom";
import DiaryCard from "../components/DiaryCard";
import search from "../resource/search.png";
import filter from "../resource/filter.png";
import { useCategories } from "../components/categories";

const Dashboard: FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [clicked, setClicked] = useState(false);
  const categories = useCategories();

  useEffect(() => {
    // Display a success toast message when the component mounts
    toast.success("Login successful!", {
      autoClose: 2000,
    });

    // Set the isLoaded state to true after a delay
    const timeoutId = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setClicked(true);
    setFilterQuery(event.target.value);
      //alert(filterQuery);
  };
// useEffect(() => {
//   // This code will run immediately after the state update
//   }, [filterQuery]);
  return (
    <div>
      {isLoaded ? (
        <>
          <Navbar heading="Welcome to my Diary app!!" />
          <div className="p-6 ">
            <div className=" flex justify-between ">
              <span className="font-semibold text-2xl">Welcome Back</span>
              <button className=" bg-black rounded-lg text-white font-medium ml-auto px-4 py-2">
                <Link to="/journal/create">New entry</Link>
              </button>
            </div>
            <div className=" my-4 flex justify-between ">
              <div className=" flex row w-9/12 bg-blue-200">
                <input type="text" placeholder="Type here to search" value={searchQuery} onChange={handleSearchQueryChange} className=" border-b-2 border-black p-1 w-full" />
                <img src={search} alt="search" className=" -ml-8 border-b-2 border-black" />
              </div>

              <div className=" flex row w-2/12 bg-blue-200 border-b-2 border-black justify-end">
                <div></div>
                {!clicked && <img src={filter} alt="filter" onClick={() => setClicked(true)} />}
                {clicked && (
                  <select value={filterQuery} name="category" id="category" onChange={handleFilter} className=" border-b-2 border-black p-1 w-full">
                    <option value="" disabled>
                      category
                    </option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <DiaryCard search={searchQuery} filter={filterQuery} />
            <Footer />
          </div>
        </>
      ) : (
        <h2 className=" text-center text-2xl"> ....Sucessfully Login....</h2>
      )}
    </div>
  );
};

export default Dashboard;
