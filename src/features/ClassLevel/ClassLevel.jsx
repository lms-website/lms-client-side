import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiKey } from "../../Utils/helper";
import { toast } from "react-toastify";
import {
  LuChevronLeft,
  LuChevronRight,
  LuPenSquare,
  LuTrash2,
} from "react-icons/lu";
import Spinner from "../../Ui/Spinner";
import Table from "../../components/Table";
import Button from "../../components/Button";
import { Dialog } from "primereact/dialog";
import Input from "../../components/Input";
import ErrorMessage from "../../components/ErrorMessage";
const columns = [
  "Name",
  "Description",
  "Students",
  "Teachers",
  "Subjects",
  "Actions",
];
const ClassLevel = () => {
  const { token } = useSelector((store) => store.auth);
  const [data, setData] = useState();
  const [next, setNext] = useState(data?.pagination?.next?.page);
  const [previous, setPrevious] = useState(data?.pagination?.prev?.page);
  const [loading, setLoading] = useState(false);

  // add new classLevel
  const [buttonType, setButtonType] = useState("unactive");
  const [createClassLevelPopup, setCreateClassLevelPopup] = useState(false);
  const [classLevelData, setClassLevelData] = useState();
  const [loadingClassLevel, setLoadingClassLevel] = useState(false);
  const [createClassLevelError, setCreateClassLevelError] = useState();
  // update
  const [updateClassLevelPopup, setUpdateClassLevelPopup] = useState(false);
  const [updateClassLevelData, setUpdateClassLevelData] = useState();
  const [loadingUpdateClassLevel, setLoadingUpdateClassLevel] = useState(false);
  const [updateClassLevelError, setUpdateClassLevelError] = useState();

  const getData = async (page) => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      setLoading(true);

      const response = await axios.get(
        `${apiKey}/api/v1/class-Levels/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

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
  // create new class level
  const handleAddChange = (field, value) => {
    setClassLevelData((pre) => ({ ...pre, [field]: value }));
    if (value === "") {
      setCreateClassLevelError((pre) => ({
        ...pre,
        [field]: {
          message: "This field is required",
        },
      }));
    } else {
      setCreateClassLevelError((pre) => ({
        ...pre,
        [field]: {
          message: "",
        },
      }));
    }
  };
  // error
  const handleAddClassLevel = () => {
    let hasErrors = false;

    if (classLevelData?.name === "" || !classLevelData?.name) {
      setCreateClassLevelError((prev) => ({
        ...prev,
        name: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else {
      setCreateClassLevelError((prev) => ({
        ...prev,
        name: {
          message: "",
        },
      }));
    }
    if (classLevelData?.description === "" || !classLevelData?.description) {
      setCreateClassLevelError((prev) => ({
        ...prev,
        description: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else {
      setCreateClassLevelError((prev) => ({
        ...prev,
        description: {
          message: "",
        },
      }));
    }

    return hasErrors;
  };
  const AddNewClassLevel = async () => {
    const hasErrors = handleAddClassLevel();
    if (!hasErrors) {
      try {
        setLoadingClassLevel(true);
        const response = await axios.post(
          `${apiKey}/api/v1/class-Levels/`,
          classLevelData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          toast.success("Sucessfully Create new acadamic term");
          setCreateClassLevelPopup(false);
          setClassLevelData();
          getData(1);
        }
      } catch (error) {
        if (error?.response?.data?.message === "Academic term already exist") {
          setCreateClassLevelError((prev) => ({
            ...prev,
            name: {
              message: "Academic term already exist",
            },
          }));
        }
      } finally {
        setLoadingClassLevel(false);
      }
    }
  };
  useEffect(() => {
    if (
      classLevelData?.name &&
      classLevelData?.description &&
      !createClassLevelError?.name?.message &&
      !createClassLevelError?.description?.message
    ) {
      setButtonType("primary-outline");
    } else {
      setButtonType("unactive");
    }
  }, [classLevelData, createClassLevelError]);
  // delet
  const handleDelete = async (id) => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      const response = await axios.delete(
        `${apiKey}/api/v1/class-Levels/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Sucessfully delete class level");
        getData(1);
      }
    } catch (error) {
      console.log("Error while delting", error);
    }
  };

  // update
  const handleUpdate = (item) => {
    setUpdateClassLevelPopup(true);

    setUpdateClassLevelData(item);
  };
  const handleUpdateChange = (field, value) => {
    setUpdateClassLevelData((pre) => ({ ...pre, [field]: value }));
    if (value === "") {
      setUpdateClassLevelError((pre) => ({
        ...pre,
        [field]: {
          message: "This field is required",
        },
      }));
    } else {
      setUpdateClassLevelError((pre) => ({
        ...pre,
        [field]: {
          message: "",
        },
      }));
    }
  };
  const handleSubmitUpdate = async () => {
    const { description, name } = updateClassLevelData;

    const sendData = { description, name };
    try {
      setLoadingUpdateClassLevel(true);
      const response = await axios.put(
        `${apiKey}/api/v1/class-Levels/${updateClassLevelData?._id}`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setUpdateClassLevelPopup(false);

        getData(1);
      }
    } catch (error) {
      if (error?.response?.data?.message === "Academic term alredy exist") {
        setUpdateClassLevelError((prev) => ({
          ...prev,
          name: {
            message: "Academic term already exist",
          },
        }));
      }
    } finally {
      setLoadingUpdateClassLevel(false);
    }
  };

  return (
    <>
      <div>
        <div className="grid gap-4">
          <div className="flex justify-between gap-1 items-center">
            <h2 className="text-[20px] font-bold text-dark-gray">
              Class levels
            </h2>
            <Button
              type="primary-outline"
              onClick={() => setCreateClassLevelPopup(true)}
            >
              Create new class level
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
                      {item?.description}
                    </td>
                    <td className="py-3 text-light-gray capitalize px-2">
                      {item?.students?.length}
                    </td>
                    <td className="py-3 text-light-gray capitalize px-2">
                      {item?.teachers?.length}
                    </td>
                    <td className="py-3 text-light-gray capitalize px-2">
                      {item?.subjects?.length}
                    </td>

                    <td className="py-3 text-light-gray capitalize px-2">
                      <div className="flex items-center gap-2">
                        <span role="button" onClick={() => handleUpdate(item)}>
                          <LuPenSquare color="#aea7a5" size={20} />
                        </span>
                        <span
                          role="button"
                          onClick={() => handleDelete(item._id)}
                        >
                          <LuTrash2 color="#c31010" size={20} />
                        </span>
                      </div>
                    </td>
                    <td></td>
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
      </div>
      {/* add new academic year */}
      <Dialog
        className="w-[700px] max-w-[95%]"
        visible={createClassLevelPopup}
        onHide={() => setCreateClassLevelPopup(false)}
        header="Add new acadamic term"
      >
        <div className="grid gap-4">
          <Input
            id="name"
            label="Name"
            value={classLevelData?.name || ""}
            type="text"
            placeholder="Enter your name"
            error={createClassLevelError?.name?.message}
            handleChange={handleAddChange}
          />
          <div className="grid gap-1">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              value={classLevelData?.description || ""}
              onChange={(e) => handleAddChange("description", e.target.value)}
              id="description"
              className={`resize-none h-[10vh] input ${
                createClassLevelError?.description?.message && "input-error"
              }`}
              placeholder="Enter terms descriptions"
            ></textarea>
            {createClassLevelError?.description?.message && (
              <ErrorMessage
                message={createClassLevelError?.description?.message}
              />
            )}
          </div>

          <div className="">
            <Button
              loading={loadingClassLevel}
              disabled={loadingClassLevel}
              type={buttonType}
              className="w-full"
              onClick={AddNewClassLevel}
            >
              Create class level
            </Button>
          </div>
        </div>
      </Dialog>
      {/* end new academic term */}
      {/* update new academic term */}
      <Dialog
        className="w-[700px] max-w-[95%]"
        visible={updateClassLevelPopup}
        onHide={() => setUpdateClassLevelPopup(false)}
        header="Update acadamic term"
      >
        <div className="grid gap-4">
          <Input
            id="name"
            label="Name"
            value={updateClassLevelData?.name || ""}
            type="text"
            placeholder="Enter your name"
            error={updateClassLevelError?.name?.message}
            handleChange={handleUpdateChange}
          />
          <div className="grid gap-1">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              value={updateClassLevelData?.description || ""}
              onChange={(e) =>
                handleUpdateChange("description", e.target.value)
              }
              id="description"
              className={`resize-none h-[10vh] input ${
                updateClassLevelError?.description?.message && "input-error"
              }`}
              placeholder="Enter terms descriptions"
            ></textarea>
            {updateClassLevelError?.description?.message && (
              <ErrorMessage
                message={updateClassLevelError?.description?.message}
              />
            )}
          </div>

          <div className="">
            <Button
              loading={loadingUpdateClassLevel}
              disabled={loadingUpdateClassLevel}
              className="w-full"
              onClick={handleSubmitUpdate}
            >
              {`update class level`}
            </Button>
          </div>
        </div>
      </Dialog>
      {/* end update academic year */}
    </>
  );
};

export default ClassLevel;
