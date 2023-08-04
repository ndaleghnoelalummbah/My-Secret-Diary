import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks/storeHook";

const Header = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className=" border-gray-200 w-24 ml-auto px-4 lg:px-6 py-2.5 ">
      <div >{user ? <Link to="/profile">{user?.photoUrl ? <img className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300  " src={user.photoUrl} alt="Avatar" /> : <div className="w-24 h-24 mb-3 text-4xl font-bold grid place-content-center bg-green-200 rounded-full shadow-lg">{user?.email[0].toUpperCase()}</div>}</Link> : <></>}</div>
    </nav>
  );
};

export default Header;
