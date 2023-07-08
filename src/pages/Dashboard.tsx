import React, { FC } from "react";
import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
const Dashboard: FC = () => {
  return (
    <div className=" max-w-2xl mx-auto">
      <Navbar heading="Welcome to my Diary app!!" />
      <Header />
      <h1></h1>
    </div>
  );
};
export default Dashboard;
