import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { apiKey } from "../../../Utils/helper";
import axios from "axios";
import { useSelector } from "react-redux";
import PasswordInput from "../../../components/PasswordInput";
import { toast } from "react-toastify";

const AddNewUser = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const role = searchParam.get("role");
  const { token } = useSelector((store) => store.auth);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [buttonType, setButtonType] = useState("unactive");
  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // for error
    if (value === "") {
      setError((pre) => ({
        ...pre,
        [field]: {
          message: "requiredField",
        },
      }));
    } else if (field === "password") {
      if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(value)) {
        setError((pre) => ({
          ...pre,
          [field]: {
            message: "Password must contain more than 8 letters and numbers.",
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
    } else if (field === "email") {
      if (!/^[^@\s]+@[^@\s]+$/.test(value)) {
        setError((pre) => ({
          ...pre,
          [field]: {
            message: "Invalid email formate",
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
    } else {
      setError((pre) => ({
        ...pre,
        [field]: {
          message: "",
        },
      }));
    }
  };
  const handleErrors = () => {
    let hasErrors = false;

    if (data?.name === "" || !data?.name) {
      setError((prev) => ({
        ...prev,
        name: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else {
      setError((prev) => ({
        ...prev,
        name: {
          message: "",
        },
      }));
    }

    if (data?.email === "" || !data?.email) {
      setError((prev) => ({
        ...prev,
        email: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else if (!/^[^@\s]+@[^@\s]+$/.test(data?.email)) {
      setError((pre) => ({
        ...pre,
        email: {
          message: "Invalid email formate",
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

    if (data?.password?.length <= 8 || !data?.password) {
      setError((prev) => ({
        ...prev,
        password: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(data?.password)) {
      setError((pre) => ({
        ...pre,
        password: {
          message: "Password must contain more than 8 letters and numbers.",
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
  useEffect(() => {
    if (
      data?.name &&
      data?.email &&
      data?.password &&
      !error?.name?.message &&
      !error?.email?.message &&
      !error?.password?.message
    ) {
      setButtonType("primary-outline");
    } else {
      setButtonType("unactive");
    }
  }, [data, error]);
  const handleSubmit = async () => {
    const hasErrors = handleErrors();
    if (!hasErrors) {
      const endpoint =
        role === "admin"
          ? `${apiKey}/api/v1/admins/register`
          : role === "teacher"
          ? `${apiKey}/api/v1/teachers/admin/register`
          : `${apiKey}/api/v1/students/admin/register`;
      try {
        setLoading(true);
        const response = await axios.post(endpoint, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 201 || response.status === 200) {
          if (role === "admin") {
            toast.success("Sucessfully Create new admin");
          } else if (role === "teacher") {
            toast.success("Sucessfully Create new teacher");
          } else {
            toast.success("Sucessfully Create new student");
          }
          setData();
        }
      } catch (error) {
        console.log("Error while creating new user", error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Input
          id="name"
          label="Name"
          value={data?.name || ""}
          type="text"
          placeholder="Enter your name"
          error={error?.name?.message}
          handleChange={handleChange}
        />
        <Input
          id="email"
          label="Email"
          value={data?.email || ""}
          type="email"
          placeholder="Enter your email"
          error={error?.email?.message}
          handleChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PasswordInput
          id="password"
          label="Password"
          value={data?.password || ""}
          type="text"
          placeholder="Enter your password"
          error={error?.password?.message}
          handleChange={handleChange}
        />
      </div>
      <div className="">
        <Button
          loading={loading}
          disabled={loading}
          type={buttonType}
          onClick={handleSubmit}
        >
          Create new user
        </Button>
      </div>
    </div>
  );
};

export default AddNewUser;
