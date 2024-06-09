import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import Table from "../../components/Table";

import { useSelector } from "react-redux";
import axios from "axios";
import {
  apiKey,
  convertYearToISOString,
  formateDate,
  generateYears,
} from "../../Utils/helper";
import Spinner from "../../Ui/Spinner";
import {
  LuChevronLeft,
  LuChevronRight,
  LuPenSquare,
  LuTrash2,
} from "react-icons/lu";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import Input from "../../components/Input";
import ErrorMessage from "../../components/ErrorMessage";
const columns = ["Name", "From", "To", "Students", "Teachers", "Actions"];
const AcademicYearContainer = () => {
  const { token } = useSelector((store) => store.auth);
  const [data, setData] = useState();
  const [next, setNext] = useState(data?.pagination?.next?.page);
  const [previous, setPrevious] = useState(data?.pagination?.prev?.page);
  const [loading, setLoading] = useState(false);
  const [buttonType, setButtonType] = useState("unactive");
  // add new acadamic year
  const [addNewYearPopup, setAddNewYearPopup] = useState(false);
  const [newAcademicYearData, setNewAcademicYearData] = useState();
  const [loadingNewAcademicYear, setLoadingNewAcademicYear] = useState(false);
  const [addNewYearError, setAddNewYearError] = useState();
  //  update
  const [updateNewYearPopup, setUpdateNewYearPopup] = useState(false);
  const [updateAcademicYearData, setUpdateAcademicYearData] = useState();
  const [loadingUpdateAcademicYear, setLoadingUpdateAcademicYear] =
    useState(false);
  const [updateNewYearError, setUpdateNewYearError] = useState();
  const [fromChange, setFromChange] = useState(false);
  const [toChange, setToChange] = useState(false);
  const years = generateYears();
  const getData = async (page) => {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
      setLoading(true);

      const response = await axios.get(
        `${apiKey}/api/v1/academic-years/?page=${page}`,
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
      const response = await axios.delete(
        `${apiKey}/api/v1/academic-years/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        }
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Sucessfully delete acadmic year");
        getData(1);
      }
    } catch (error) {
      console.log("Error while delting", error);
    }
  };

  // add new academic year
  const handleAddChange = (field, value) => {
    setNewAcademicYearData((pre) => ({ ...pre, [field]: value }));
    if (value === "") {
      setAddNewYearError((pre) => ({
        ...pre,
        [field]: {
          message: "This field is required",
        },
      }));
    } else {
      setAddNewYearError((pre) => ({
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

    if (newAcademicYearData?.name === "" || !newAcademicYearData?.name) {
      setAddNewYearError((prev) => ({
        ...prev,
        name: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else {
      setAddNewYearError((prev) => ({
        ...prev,
        name: {
          message: "",
        },
      }));
    }
    if (
      newAcademicYearData?.fromYear === "" ||
      !newAcademicYearData?.fromYear
    ) {
      setAddNewYearError((prev) => ({
        ...prev,
        fromYear: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else {
      setAddNewYearError((prev) => ({
        ...prev,
        fromYear: {
          message: "",
        },
      }));
    }
    if (newAcademicYearData?.toYear === "" || !newAcademicYearData?.toYear) {
      setAddNewYearError((prev) => ({
        ...prev,
        toYear: {
          message: "This field is require",
        },
      }));

      hasErrors = true;
    } else {
      setAddNewYearError((prev) => ({
        ...prev,
        toYear: {
          message: "",
        },
      }));
    }
    return hasErrors;
  };
  const AddNewAcademicYear = async () => {
    const hasErrors = handleAddAcadamicError();
    const { fromYear, toYear, name } = newAcademicYearData;
    const from = convertYearToISOString(fromYear);
    const to = convertYearToISOString(toYear);
    const sendData = { fromYear: from, toYear: to, name };
    if (!hasErrors) {
      try {
        setLoadingNewAcademicYear(true);
        const response = await axios.post(
          `${apiKey}/api/v1/academic-years`,
          sendData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          toast.success("Sucessfully Create new acadamic year");
          setAddNewYearPopup(false);
          setNewAcademicYearData();
          getData(1);
        }
      } catch (error) {
        if (error?.response?.data?.message === "Academic year already exist") {
          setAddNewYearError((prev) => ({
            ...prev,
            name: {
              message: "Academic year already exist",
            },
          }));
        }
      } finally {
        setLoadingNewAcademicYear(false);
      }
    }
  };
  useEffect(() => {
    if (
      newAcademicYearData?.name &&
      newAcademicYearData?.fromYear &&
      newAcademicYearData?.toYear &&
      !addNewYearError?.name?.message &&
      !addNewYearError?.fromYear?.message &&
      !addNewYearError?.toYear?.message
    ) {
      setButtonType("primary-outline");
    } else {
      setButtonType("unactive");
    }
  }, [newAcademicYearData, addNewYearError]);
  // update
  const handleUpdate = (item) => {
    setUpdateNewYearPopup(true);

    const { fromYear, toYear, _id, name } = item;
    const newDateFrom = new Date(fromYear);
    const newDateTo = new Date(toYear);
    const from = newDateFrom.getFullYear();
    const to = newDateTo.getFullYear();
    setUpdateAcademicYearData({ fromYear: from, toYear: to, _id, name });
  };
  const handleUpdateChange = (field, value) => {
    setUpdateAcademicYearData((pre) => ({ ...pre, [field]: value }));
    if (value === "") {
      setUpdateNewYearError((pre) => ({
        ...pre,
        [field]: {
          message: "This field is required",
        },
      }));
    } else {
      setUpdateNewYearError((pre) => ({
        ...pre,
        [field]: {
          message: "",
        },
      }));
    }
  };
  const handleSubmitUpdate = async () => {
    const { fromYear, toYear, name } = updateAcademicYearData;
    const from = fromChange ? convertYearToISOString(fromYear) : fromYear;
    const to = toChange ? convertYearToISOString(toYear) : toYear;
    const sendData = { fromYear: from, toYear: to, name };
    try {
      setLoadingUpdateAcademicYear(true);
      const response = await axios.put(
        `${apiKey}/api/v1/academic-years/${updateAcademicYearData?._id}`,
        sendData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setUpdateNewYearPopup(false);
        setFromChange(false);
        setToChange(false);
        getData(1);
      }
    } catch (error) {
      if (error?.response?.data?.message === "Academic year alredy exist") {
        setUpdateNewYearError((prev) => ({
          ...prev,
          name: {
            message: "Academic year already exist",
          },
        }));
      }
    } finally {
      setLoadingUpdateAcademicYear(false);
    }
  };

  return (
    <>
      <div>
        <div className="grid gap-4">
          <div className="flex justify-between gap-1 items-center">
            <h2 className="text-[20px] font-bold text-dark-gray">
              Academic year
            </h2>
            <Button
              type="primary-outline"
              onClick={() => setAddNewYearPopup(true)}
            >
              Add academic year
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
                      {formateDate(item?.fromYear)}
                    </td>
                    <td className="py-3 text-light-gray capitalize px-2">
                      {formateDate(item?.toYear)}
                    </td>
                    <td className="py-3 text-light-gray capitalize px-2">
                      {item?.students?.length}
                    </td>
                    <td className="py-3 text-light-gray capitalize px-2">
                      {item?.teachers?.length}
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
        visible={addNewYearPopup}
        onHide={() => setAddNewYearPopup(false)}
        header="Add new acadamic year"
      >
        <div className="grid gap-4">
          <Input
            id="name"
            label="Name"
            value={newAcademicYearData?.name || ""}
            type="text"
            placeholder="Enter your name"
            error={addNewYearError?.name?.message}
            handleChange={handleAddChange}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
            <div className="grid gap-1">
              <label htmlFor="from" className="label">
                From
              </label>
              <Dropdown
                inputId="from"
                value={newAcademicYearData?.fromYear || ""}
                onChange={(e) => handleAddChange("fromYear", e.target.value)}
                options={years}
                optionLabel="name"
                placeholder="Select from year"
                className={`w-full input !py-2 ${
                  addNewYearError?.fromYear?.message && "!border-error"
                } `}
              />
              {addNewYearError?.fromYear?.message && (
                <ErrorMessage message={addNewYearError?.fromYear?.message} />
              )}
            </div>
            <div className="grid gap-1">
              <label htmlFor="to" className="label">
                To
              </label>
              <Dropdown
                value={newAcademicYearData?.toYear || ""}
                onChange={(e) => handleAddChange("toYear", e.target.value)}
                options={years}
                optionLabel="name"
                placeholder="Select to year"
                className={`w-full input !py-2 ${
                  addNewYearError?.toYear?.message && "!border-error"
                } `}
              />
              {addNewYearError?.toYear?.message && (
                <ErrorMessage message={addNewYearError?.toYear?.message} />
              )}
            </div>
          </div>
          <div className="">
            <Button
              loading={loadingNewAcademicYear}
              disabled={loadingNewAcademicYear}
              type={buttonType}
              className="w-full"
              onClick={AddNewAcademicYear}
            >
              Create acadamic year
            </Button>
          </div>
        </div>
      </Dialog>
      {/* end new academic year */}
      {/* update new academic year */}
      <Dialog
        className="w-[700px] max-w-[95%]"
        visible={updateNewYearPopup}
        onHide={() => setUpdateNewYearPopup(false)}
        header="Update acadamic year"
      >
        <div className="grid gap-4">
          <Input
            id="name"
            label="Name"
            value={updateAcademicYearData?.name || ""}
            type="text"
            placeholder="Enter your name"
            error={updateNewYearError?.name?.message}
            handleChange={handleUpdateChange}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
            <div className="grid gap-1">
              <label htmlFor="from" className="label">
                From
              </label>
              <Dropdown
                inputId="from"
                value={updateAcademicYearData?.fromYear || ""}
                onChange={(e) => {
                  handleUpdateChange("fromYear", e.target.value);
                  setFromChange(true);
                }}
                options={years}
                optionLabel="name"
                placeholder="Select from year"
                className={`w-full input !py-2 ${
                  updateNewYearError?.fromYear?.message && "!border-error"
                } `}
              />
              {updateNewYearError?.fromYear?.message && (
                <ErrorMessage message={updateNewYearError?.fromYear?.message} />
              )}
            </div>
            <div className="grid gap-1">
              <label htmlFor="to" className="label">
                To
              </label>
              <Dropdown
                value={updateAcademicYearData?.toYear || ""}
                onChange={(e) => {
                  handleUpdateChange("toYear", e.target.value);
                  setToChange(true);
                }}
                options={years}
                optionLabel="name"
                placeholder="Select to year"
                className={`w-full input !py-2 ${
                  updateNewYearError?.toYear?.message && "!border-error"
                } `}
              />
              {updateNewYearError?.toYear?.message && (
                <ErrorMessage message={updateNewYearError?.toYear?.message} />
              )}
            </div>
          </div>
          <div className="">
            <Button
              loading={loadingUpdateAcademicYear}
              disabled={loadingUpdateAcademicYear}
              className="w-full"
              onClick={handleSubmitUpdate}
            >
              {`update ${updateAcademicYearData?.name}`}
            </Button>
          </div>
        </div>
      </Dialog>
      {/* end update academic year */}
    </>
  );
};

export default AcademicYearContainer;
