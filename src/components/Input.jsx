import React from "react";

import ErrorMessage from "./ErrorMessage";

const Input = ({
  id,
  label,
  value,
  type,
  placeholder,
  error,
  handleChange,
  refrence,
}) => {
  return (
    <div className="grid gap-1  ">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        ref={refrence}
        type={type}
        id={id}
        value={value}
        className={`input ${error ? "input-error" : null} `}
        placeholder={placeholder}
        onChange={(e) => handleChange(id, e.target.value)}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default Input;
