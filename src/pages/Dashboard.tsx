import React, { FC, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Button";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Link } from "react-router-dom";
const Dashboard: FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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

  return (
    <div>
      {isLoaded ? (
        <>
          <Navbar heading="Welcome to my Diary app!!" />
          <div className="px-6 py-4">
            <div className=" flex justify-between ">
              <span className="font-semibold text-2xl">Welcome Back</span>
              <button className=" bg-black rounded-lg text-white font-medium ml-auto px-4 py-2">
                <Link to="/journal/create">New entry</Link>
              </button>
            </div>
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
