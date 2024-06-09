import React, { useEffect, useState } from "react";
import {
  LuPenSquare,
  LuTrash2,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import Button from "./Button";
import Table from "./Table";
import { apiKey, formateDate } from "../Utils/helper";
import axios from "axios";
import { useSelector } from "react-redux";
import Spinner from "../Ui/Spinner";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import Input from "./Input";
import PasswordInput from "./PasswordInput";
const TableRow = ({
  title = "",
  addNewButtonClick,
  addNewButtonTitle,
  columns = [],
  handleDeleteEndpoint,

  handleUpdateEndpoint,
  endpoint = "",
  redirect = "",
  role = "admin",
  showWithDraw = false,
  showSuspended = false,
}) => {
  const { token } = useSelector((store) => store.auth);
  const [data, setData] = useState();
  const [next, setNext] = useState(data?.pagination?.next?.page);
  const [previous, setPrevious] = useState(data?.pagination?.prev?.page);
  const [loading, setLoading] = useState(false);
  // update admin
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [updatePopup, setUpdatePopup] = useState(false);
  const [tempData, setTempData] = useState();
  const [error, setError] = useState();
  // for update admin
  const handleChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
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

    if (tempData?.name === "" || !tempData?.name) {
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

    if (tempData?.email === "" || !tempData?.email) {
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

    if (tempData?.password?.length <= 8 || !tempData?.password) {
      setError((prev) => ({
        ...prev,
        password: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(tempData?.password)) {
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

  const updateAdminData = async () => {
    const controller = new AbortController();
    const signal = controller.signal;
    const sendData = {
      email: tempData?.email,
      name: tempData?.name,
      password: tempData?.password,
    };

    try {
      setLoadingUpdate(true);
      const response = await axios.put(`${apiKey}/api/v1/admins/`, sendData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      if (response.status === 200) {
        toast.success("Sucessfully update data");
        setUpdatePopup(false);
      }
      console.log(response.data, "re");
    } catch (error) {
      console.log("error ", error);
      if (error?.response?.data?.message === "this emailis taken/exist") {
        toast.error("Email already exist.");
      }
    } finally {
      setLoadingUpdate(false);
    }
  };
  const getData = async (page) => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      setLoading(true);

      const response = await axios.get(`${apiKey}${endpoint}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      if (response.status === 200) {
        setData(response.data);
        setNext(response.data?.pagination?.next?.page || null);
        setPrevious(response.data?.pagination?.prev?.page || null);
      }
    } catch (error) {
      // console.log("Error while pagination: ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData(1);
  }, []);
  // delete admin
  const handleDelete = async (id) => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      const response = await axios.delete(
        `${apiKey}${handleDeleteEndpoint}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Admin deleted sucessfully");
        getData(1);
      }
    } catch (error) {
      console.log("Error while delting", error);
    }
  };
  const handleSuspendUser = async (item) => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      const response = await axios.put(
        `${apiKey}/api/v1/admins/suspend/teacher/${item?._id}`,
        { suspended: !item?.isSuspended },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

      if (response.status === 200) {
        toast.success("Sucessfully update teacher state");
        getData(1);
      }
    } catch (error) {
      console.log("Error while delting", error);
    }
  };
  const withdrawUser = async (item) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const Endpoint =
      role === "teacher"
        ? `${apiKey}/api/v1/admins/withdraw/teacher/${item?._id}`
        : `${apiKey}/api/v1/admins/withdraw/student/${item?._id}`;
    const sendData =
      role === "teacher"
        ? { withdrawTeacher: !item?.isWitdrawn }
        : { withdrawStudent: !item?.isWithdrawn };
    try {
      const response = await axios.put(Endpoint, sendData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      if (response.status === 200) {
        if (role === "teacher") {
          toast.success("Sucessfully withdrow teacher");
        } else {
          toast.success("Sucessfully withdrow student");
        }
        getData(1);
      }
    } catch (error) {
      console.log("Error while delting", error);
    }
  };
  // update
  const handleUpdate = (item) => {
    setUpdatePopup(true);
    setTempData(item);
  };
  const renderActions = (item) => {
    if (role === "admin") {
      return (
        <>
          {/* <span role="button" onClick={() => handleUpdate(item)}>
            <LuPenSquare color="#aea7a5" size={20} />
          </span> */}
          <span role="button" onClick={() => handleDelete(item._id)}>
            <LuTrash2 color="#c31010" size={20} />
          </span>
        </>
      );
    } else if (role === "teacher") {
      return (
        <>
          <Button
            type="primary-outline"
            className="!h-[40px] !shadow-none"
            onClick={() => withdrawUser(item)}
          >
            Withdraw
          </Button>
          <Button
            className="!h-[40px] !shadow-none"
            type="primary-outline"
            onClick={() => handleSuspendUser(item)}
          >
            Suspend
          </Button>
        </>
      );
    } else if (role === "student") {
      return (
        <Button
          type="primary-outline"
          className="!h-[40px] !shadow-none"
          onClick={() => withdrawUser(item)}
        >
          Withdraw
        </Button>
      );
    }
    return null;
  };
  return (
    <>
      <div className="grid gap-4">
        <div className="flex justify-between gap-1 items-center">
          <h2 className="text-[20px] font-bold text-dark-gray">{title}</h2>
          <Button
            to={redirect}
            type="primary-outline"
            onClick={addNewButtonClick}
          >
            {addNewButtonTitle}
          </Button>
        </div>

        <Table className=" w-full ">
          <Table.Header columns={columns} trClassName="" thClassName="py-3" />
          <Table.Row>
            {loading ? (
              <tr className="w-full bg-white">
                <td
                  colSpan={columns.length}
                  className="py-3 text-center h-[20vh]"
                >
                  <div className="flex justify-center items-center h-full">
                    <Spinner className="w-6 h-6" />
                  </div>
                </td>
              </tr>
            ) : (
              data?.data?.map((item) => (
                <tr
                  key={item?._id}
                  className="border-b bg-white  border-extra-light-gray"
                >
                  <td className="py-3 text-light-gray capitalize px-2">
                    {item?.name}
                  </td>
                  <td className="py-3 text-light-gray capitalize px-2">
                    {item?.email}
                  </td>
                  <td className="py-3 text-light-gray capitalize px-2">
                    {formateDate(item?.createdAt)}
                  </td>
                  {showWithDraw && (
                    <td className="py-3 text-light-gray capitalize px-2">
                      {`${
                        role === "teacher"
                          ? item?.isWitdrawn
                          : item?.isWithdrawn
                      }`}
                    </td>
                  )}
                  {showSuspended && (
                    <td className="py-3 text-light-gray capitalize px-2">
                      {`${item?.isSuspended}`}
                    </td>
                  )}
                  <td className="py-3 text-light-gray capitalize px-2">
                    <div className="flex items-center gap-2">
                      {renderActions(item)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </Table.Row>
        </Table>
        <div className="flex items-center justify-center gap-4 w-full">
          <span
            role="button"
            onClick={() => {
              if (previous) {
                getData(previous);
              }
            }}
            className={`pagination ${
              !previous ? "disabled" : ""
            } transition-all ease-in-out duration-300 py-2 px-2 border border-light-gray rounded-[5px] flex`}
          >
            <LuChevronLeft className="icon-gray" />
          </span>
          <span
            role="button"
            onClick={() => {
              if (next) {
                getData(next);
              }
            }}
            className={`pagination ${
              !next ? "disabled" : ""
            } transition-all ease-in-out duration-300 py-2 px-2 border border-light-gray rounded-[5px] flex`}
          >
            <LuChevronRight className="icon-gray" />
          </span>
        </div>
      </div>
      {/* update  */}
      <Dialog
        visible={updatePopup}
        className="w-[700px] max-w-full"
        onHide={() => setUpdatePopup(false)}
        header="Update"
      >
        <div className="grid gap-4">
          <Input
            id="name"
            label="name"
            type="text"
            placeholder="Enter your name"
            error={error?.name?.message}
            value={tempData?.name || ""}
            handleChange={handleChange}
          />
          <Input
            id="email"
            label="Email"
            value={tempData?.email || ""}
            type="email"
            placeholder="Enter your email"
            error={error?.email?.message}
            handleChange={handleChange}
          />

          <PasswordInput
            id="password"
            label="Password"
            value={tempData?.password}
            type="text"
            placeholder="Enter your password"
            error={error?.password?.message}
            handleChange={handleChange}
          />
          <div>
            <Button
              className="w-full"
              loading={loadingUpdate}
              disabled={loadingUpdate}
              type="primary-outline"
              onClick={updateAdminData}
            >
              update
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TableRow;
