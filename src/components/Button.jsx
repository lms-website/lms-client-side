import React from "react";
import { Link } from "react-router-dom";
import Spinner from "../Ui/Spinner";

const Button = ({
  children,
  onClick,
  to,
  type = "primary",
  role = "button",
  disabled,
  loading,
  className,
  target,
}) => {
  const base_style = `flex items-center gap-2  justify-center text-center py-3 px-4 outline-none rounded-lg transition-all duration-300 ease-in-out text-base font-bold shadow-main-shadow hover:shadow-hover-shadow `;
  const styles = {
    primary: `${base_style} bg-primary text-white hover:bg-primary-light text-white  `,
    "primary-outline": `${base_style} border border-primary hover:bg-extra-light-grey text-primary`,
    unactive: `${base_style} bg-white text-extra-light-grey`,
  };
  if (to)
    return (
      <Link target={target} className={`${styles[type]} ${className}`} to={to}>
        {children}
      </Link>
    );
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={role}
      className={`${styles[type]} ${className}`}
    >
      {children}
      {loading && <Spinner />}
    </button>
  );
};

export default Button;
