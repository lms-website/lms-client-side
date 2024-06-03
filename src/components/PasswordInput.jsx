import React, { useRef, useState } from "react";

import { GoEye, GoEyeClosed } from "react-icons/go";
import ErrorMessage from "./ErrorMessage";
const PasswordInput = ({
  id,
  label,
  placeholder,
  error,
  handleChange,
  onTypingError = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const password = useRef(null);
  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
    const inputType = showPassword ? "password" : "text";
    password.current.type = inputType;
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="w-full relative">
        <input
          ref={password}
          type="password"
          id={id}
          className={`input w-full pr-14 ${
            onTypingError && error ? "input-error" : null
          } `}
          placeholder={placeholder}
          onChange={(e) => handleChange(id, e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <span
          onClick={toggleShowPassword}
          className={`absolute top-[50%] translate-y-[-50%] right-5`}
          role="button"
        >
          {showPassword ? <GoEye size={18} /> : <GoEyeClosed size={18} />}
        </span>
      </div>

      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default PasswordInput;
