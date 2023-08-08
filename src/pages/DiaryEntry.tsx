import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import EntryForm from "../components/EntryForm";

const DiaryEntry = () => {
  return (
    <div>
      <Navbar heading=" Diary Entries" />
      <div className=" p-4">
        <div className=" flex justify-between font-semibold text-2xl">
          <span>Create a new diary</span>{" "}
          <span className=" ml-auto">
            <Link to="/journal">X</Link>{" "}
          </span>
        </div>
        <EntryForm  />
        <Footer />
      </div>
    </div>
  );
};
export default DiaryEntry;
