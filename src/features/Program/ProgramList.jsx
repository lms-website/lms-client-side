import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiKey } from "../../Utils/helper";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ErrorMessage from "../../components/ErrorMessage";
import { Dialog } from "primereact/dialog";
import {
  LuChevronLeft,
  LuChevronRight,
  LuPenSquare,
  LuTrash2,
} from "react-icons/lu";
import Spinner from "../../Ui/Spinner";
import Table from "../../components/Table";
const columns = ["Name", "Description", "Duration", "Actions"];
const ProgramList = () => {
  const { token } = useSelector((store) => store.auth);
  const [data, setData] = useState();
  const [next, setNext] = useState(data?.pagination?.next?.page);
  const [previous, setPrevious] = useState(data?.pagination?.prev?.page);
  const [loading, setLoading] = useState(false);

  const [buttonType, setButtonType] = useState("unactive");
  // add new acadamic term
  const [addNewTermPopup, setAddNewTermPopup] = useState(false);
  const [newAcadamicTermData, setNewAcadamicTermData] = useState();
  const [loadingNewAcadamicTerm, setLoadingNewAcadamicTerm] = useState(false);
  const [addNewTermError, setAddNewTermError] = useState();
  //  update
  const [updateNewTermPopup, setUpdateNewTermPopup] = useState(false);
  const [updateAcadamicTermData, setUpdateAcadamicTermData] = useState();
  const [loadingUpdateAcadamicTerm, setLoadingUpdateAcadamicTerm] =
    useState(false);
  const [updateNewTermError, setUpdateNewTermError] = useState();

  const getData = async (page) => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      setLoading(true);

      const response = await axios.get(
        `${apiKey}/api/v1/programs/?page=${page}`,
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

  const handleDelete = async (id) => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      const response = await axios.delete(`${apiKey}/api/v1/programs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Sucessfully delete programme");
        getData(1);
      }
    } catch (error) {
      console.log("Error while delting", error);
    }
  };

  // add new academic year
  const handleAddChange = (field, value) => {
    setNewAcadamicTermData((pre) => ({ ...pre, [field]: value }));
    if (value === "") {
      setAddNewTermError((pre) => ({
        ...pre,
        [field]: {
          message: "This field is required",
        },
      }));
    } else {
      setAddNewTermError((pre) => ({
        ...pre,
        [field]: {
          message: "",
        },
      }));
    }
  };
  // error
  const handleAddAcadamicError = () => {
    let hasErrors = false;

    if (newAcadamicTermData?.name === "" || !newAcadamicTermData?.name) {
      setAddNewTermError((prev) => ({
        ...prev,
        name: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else {
      setAddNewTermError((prev) => ({
        ...prev,
        name: {
          message: "",
        },
      }));
    }
    if (
      newAcadamicTermData?.description === "" ||
      !newAcadamicTermData?.description
    ) {
      setAddNewTermError((prev) => ({
        ...prev,
        description: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else {
      setAddNewTermError((prev) => ({
        ...prev,
        description: {
          message: "",
        },
      }));
    }
    if (
      newAcadamicTermData?.duration === "" ||
      !newAcadamicTermData?.duration
    ) {
      setAddNewTermError((prev) => ({
        ...prev,
        duration: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else {
      setAddNewTermError((prev) => ({
        ...prev,
        duration: {
          message: "",
        },
      }));
    }
    return hasErrors;
  };
  const AddNewAcademicTerm = async () => {
    const hasErrors = handleAddAcadamicError();
    if (!hasErrors) {
      try {
        setLoadingNewAcadamicTerm(true);
        const response = await axios.post(
          `${apiKey}/api/v1/programs/`,
          newAcadamicTermData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          toast.success("Sucessfully Create new Programme");
          setAddNewTermPopup(false);
          setNewAcadamicTermData();
          getData(1);
        }
      } catch (error) {
        if (error?.response?.data?.message === "Program already exist") {
          setAddNewTermError((prev) => ({
            ...prev,
            name: {
              message: "Programme already exist",
            },
          }));
        }
      } finally {
        setLoadingNewAcadamicTerm(false);
      }
    }
  };
  useEffect(() => {
    if (
      newAcadamicTermData?.name &&
      newAcadamicTermData?.description &&
      newAcadamicTermData?.duration &&
      !addNewTermError?.name?.message &&
      !addNewTermError?.description?.message &&
      !addNewTermError?.duration?.message
    ) {
      setButtonType("primary-outline");
    } else {
      setButtonType("unactive");
    }
  }, [newAcadamicTermData, addNewTermError]);
  // update
  const handleUpdate = (item) => {
    setUpdateNewTermPopup(true);

    setUpdateAcadamicTermData(item);
  };
  const handleUpdateChange = (field, value) => {
    setUpdateAcadamicTermData((pre) => ({ ...pre, [field]: value }));
    if (value === "") {
      setUpdateNewTermError((pre) => ({
        ...pre,
        [field]: {
          message: "This field is required",
        },
      }));
    } else {
      setUpdateNewTermError((pre) => ({
        ...pre,
        [field]: {
          message: "",
        },
      }));
    }
  };
  const handleSubmitUpdate = async () => {
    const { description, duration, name } = updateAcadamicTermData;

    const sendData = { description, duration, name };
    try {
      setLoadingUpdateAcadamicTerm(true);
      const response = await axios.put(
        `${apiKey}/api/v1/programs/${updateAcadamicTermData?._id}`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setUpdateNewTermPopup(false);

        getData(1);
      }
    } catch (error) {
      if (error?.response?.data?.message === "Program alredy exist") {
        setUpdateNewTermError((prev) => ({
          ...prev,
          name: {
            message: "Programme already exist",
          },
        }));
      }
    } finally {
      setLoadingUpdateAcadamicTerm(false);
    }
  };
  return (
    <>
      <div>
        <div className="grid gap-4">
          <div className="flex justify-between gap-1 items-center">
            <h2 className="text-[20px] font-bold text-dark-gray">Programmes</h2>
            <Button
              type="primary-outline"
              onClick={() => setAddNewTermPopup(true)}
            >
              Add Pogramme
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
                      {item?.duration}
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
        visible={addNewTermPopup}
        onHide={() => setAddNewTermPopup(false)}
        header="Add new acadamic term"
      >
        <div className="grid gap-4">
          <Input
            id="name"
            label="Name"
            value={newAcadamicTermData?.name || ""}
            type="text"
            placeholder="Enter your name"
            error={addNewTermError?.name?.message}
            handleChange={handleAddChange}
          />
          <div className="grid gap-1">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              value={newAcadamicTermData?.description || ""}
              onChange={(e) => handleAddChange("description", e.target.value)}
              id="description"
              className={`resize-none h-[10vh] input ${
                addNewTermError?.description?.message && "input-error"
              }`}
              placeholder="Enter terms descriptions"
            ></textarea>
            {addNewTermError?.description?.message && (
              <ErrorMessage message={addNewTermError?.description?.message} />
            )}
          </div>
          <Input
            id="duration"
            label="Duration"
            value={newAcadamicTermData?.duration || ""}
            type="text"
            placeholder="Enter terms duration"
            error={addNewTermError?.duration?.message}
            handleChange={handleAddChange}
          />

          <div className="">
            <Button
              loading={loadingNewAcadamicTerm}
              disabled={loadingNewAcadamicTerm}
              type={buttonType}
              className="w-full"
              onClick={AddNewAcademicTerm}
            >
              Create Programme
            </Button>
          </div>
        </div>
      </Dialog>
      {/* end new academic term */}
      {/* update new academic term */}
      <Dialog
        className="w-[700px] max-w-[95%]"
        visible={updateNewTermPopup}
        onHide={() => setUpdateNewTermPopup(false)}
        header="Update acadamic term"
      >
        <div className="grid gap-4">
          <Input
            id="name"
            label="Name"
            value={updateAcadamicTermData?.name || ""}
            type="text"
            placeholder="Enter your name"
            error={updateNewTermError?.name?.message}
            handleChange={handleUpdateChange}
          />
          <div className="grid gap-1">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              value={updateAcadamicTermData?.description || ""}
              onChange={(e) =>
                handleUpdateChange("description", e.target.value)
              }
              id="description"
              className={`resize-none h-[10vh] input ${
                updateNewTermError?.description?.message && "input-error"
              }`}
              placeholder="Enter terms descriptions"
            ></textarea>
            {updateNewTermError?.description?.message && (
              <ErrorMessage
                message={updateNewTermError?.description?.message}
              />
            )}
          </div>
          <Input
            id="duration"
            label="Duration"
            value={updateAcadamicTermData?.duration || ""}
            type="text"
            placeholder="Enter terms duration"
            error={updateNewTermError?.duration?.message}
            handleChange={handleUpdateChange}
          />
          <div className="">
            <Button
              loading={loadingUpdateAcadamicTerm}
              disabled={loadingUpdateAcadamicTerm}
              className="w-full"
              onClick={handleSubmitUpdate}
            >
              {`update terms`}
            </Button>
          </div>
        </div>
      </Dialog>
      {/* end update academic year */}
    </>
  );
};

export default ProgramList;
