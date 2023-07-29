//import Header from "../../components/Header/Header";
import { homeClasses } from "./homeClasses";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Auth from "../../components/Auth/Auth";

const Home = () => {
  const { container, cardContainer, title, description } = homeClasses;
  return (
    <div className="  mx-auto ">
      <Navbar heading="My Secret Diary" />
      <div className="px-4">
        <h1 className="text-center mt-24">Welcome to private diary</h1>
        <p className="flex flex-col shrink-0 text-center font-normal ">
          Create private entries, log your activities <br />
          update records and publish what you want
          <br /> the public to see
        </p>
        <Link to="" className="">
          <h2 className="text-center mt-16 underline">GET STARTED</h2>
        </Link>
        <Auth />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
