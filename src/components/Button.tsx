import React, { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
  // onClick: () => void;
  label: string;
}

const Button: FC<Props> = ({ label }) => {
  return (
    <div className="bg-black max-w-lg mx-auto text-center text-white py-4 my-4 rounded-lg">
      <button>
        <Link to="/auth"> {label}</Link>
      </button>
    </div>
  );
};

export default Button;
