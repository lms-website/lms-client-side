import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import sideImage from "../../../assets/logo/Logo_2.jpg";
import "./login.css";
import Cookies from "js-cookie";
import Button from "../../../components/Button";
import ErrorMessage from "../../../components/ErrorMessage";
import { apiKey } from "../../../Utils/helper";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateAuth, updateRole } from "../AuthSlice";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [buttonType, setButtonType] = useState("unactive");
  const role = Cookies.get("role");
  // handle change in data
  const handleChange = (field, value) => {
    // for data
    setData((prev) => ({ ...prev, [field]: value }));
    // for error
    if (value === "") {
      setError((pre) => ({
        ...pre,
        [field]: {
          message: "This field is required",
        },
      }));
    } else {
      setError((pre) => ({
        ...pre,
        [field]: {
          message: "",
        },
      }));
    }
  };
  // handle error
  const handleErrors = () => {
    let hasErrors = false;

    if (data?.email === "" || !data?.email) {
      setError((prev) => ({
        ...prev,
        email: {
          message: "requiredField",
        },
      }));

      hasErrors = true;
    } else {
      setError((prev) => ({
        ...prev,
        email: {
          message: "",
        },
      }));
    }

    if (data?.password.length <= 0) {
      setError((prev) => ({
        ...prev,
        password: {
          message: "requiredField",
        },
      }));

      hasErrors = true;
    } else {
      setError((prev) => ({
        ...prev,
        password: {
          message: "",
        },
      }));
    }

    return hasErrors;
  };
  const handleLogin = async () => {
    const hasErrors = handleErrors();
    if (!hasErrors) {
      const endpoint =
        role === "admin"
          ? `${apiKey}/api/v1/admins/login`
          : `${apiKey}/api/v1/teachers/login`;
      try {
        setLoading(true);

        const response = await axios.post(endpoint, data);

        if (response.status === 201 || response.status === 200) {
          Cookies.set("token", response.data.data, {
            expires: 5,
          });
          toast.success("Successfully logged in");
          dispatch(updateAuth(response.data.data));
          dispatch(updateRole(Cookies.get("role")));
          navigate("/");
        }
        console.log(response);
      } catch (error) {
        console.log("Error while login:", error?.response?.data?.message);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };
  // for toggle type of buttons
  useEffect(() => {
    if (
      data?.email &&
      data?.password &&
      !error.email.message &&
      !error.password.message
    ) {
      setButtonType("primary");
    } else {
      setButtonType("unActive");
    }
  }, [data, error]);
  // to check if  user select role if not redirect to role selection page
  useEffect(() => {
    if (!role || role === undefined) {
      navigate("/user-type");
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-body">
      <div className="login-container">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/3 bg-gradient-to-r from-db5300 to-db5300 p-8 flex justify-center items-center">
            <img className="login-side-image" src={sideImage} alt="Side" />
          </div>
          <div className="w-full md:w-2/3 p-8">
            <h2 className="login-title">Login as {role}</h2>
            <form className="space-y-6 login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="eamil"
                  id="email"
                  required
                  value={data?.email || ""}
                  onChange={(e) => {
                    handleChange("email", e.target.value);
                  }}
                />
                {error?.email?.message && (
                  <ErrorMessage message={error?.email?.message} />
                )}
              </div>
              <div className="form-group ">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  value={data?.password || ""}
                  onChange={(e) => {
                    handleChange("password", e.target.value);
                  }}
                />
                {error?.password?.message && (
                  <ErrorMessage message={error?.password?.message} />
                )}
              </div>

              <Button
                type={buttonType}
                loading={loading}
                disabled={loading}
                onClick={handleLogin}
                className="w-full"
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
