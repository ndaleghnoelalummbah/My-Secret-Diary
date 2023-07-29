import React, { FC } from "react";
interface Props {
  label: string;
  styleProps: string;
  type: "button" | "submit" | "reset";
  btnAction?: () => void;
  disabled?: boolean;
}

const Button: FC<Props> = ({ label, type, btnAction, disabled, styleProps }) => {
  return (
    <div className={styleProps}>
      <button type={type} onClick={btnAction} disabled={disabled}>
        {label}
      </button>
    </div>
  );
};

export default Button;
