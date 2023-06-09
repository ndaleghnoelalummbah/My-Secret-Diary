//import Header from "../../components/Header/Header";
import { homeClasses } from "./homeClasses";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Button from "../../components/Button";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  const { container, cardContainer, title, description } = homeClasses;

  return (
    <div className=" max-w-lg mx-auto">
      <Navbar heading="My Secret Diary" />
      <h1 className="text-center mt-20">Welcome to private diary</h1>

      <p className="flex flex-col shrink-0 text-center font-normal ">
        Create private entries, log your activities <br />
        update records and publish what you want
        <br /> the public to see
      </p>
      <Link to="" className="">
        <h2 className="text-center mt-16 underline">GET STARTED</h2>
      </Link>
      <Button label="Sign in with Google" />
      <Button label="Sign in with Facebook" />
      <Footer />
    </div>
  );
};

export default Home;
