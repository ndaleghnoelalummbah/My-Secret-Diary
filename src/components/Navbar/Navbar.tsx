import logo from "../../resource/logo.png";
import React, { FC } from "react";
import Header from "../Header/Header";

interface props {
  heading:string;
}

const Navbar: FC<props> = ({ heading }) => {
  return (
    <div className="bg-black flex p-4 ">
      <img src={logo} alt="logo" />

      <h1 className="text-white mt-2 ml-20">{heading}</h1>
      <div className="ml-auto ">
        <Header />
      </div>
    </div>
  );
};
export default Navbar;
