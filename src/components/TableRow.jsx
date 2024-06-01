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
const TableRow = ({
  title = "",
  addNewButtonClick,
  addNewButtonTitle,
  columns = [],
  handleDelete,
  handleUpdate,
  endpoint = "",
}) => {
  const { token } = useSelector((store) => store.auth);
  const [data, setData] = useState();
  const [next, setNext] = useState(data?.pagination?.next?.page);
  const [previous, setPrevious] = useState(data?.pagination?.prev?.page);
  const [loading, setLoading] = useState(false);

  console.log(next, "next", previous);
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
      console.log(response, "pag");
    } catch (error) {
      console.log("Error while pagination: ", error);
    } finally {
      setLoading(false);
    }
    console.log("kk");
  };
  useEffect(() => {
    getData(1);
  }, []);
  return (
    <div className="grid gap-4">
      <div className="flex justify-between gap-1 items-center">
        <h2 className="text-[20px] font-bold text-dark-gray">{title}</h2>
        <Button type="primary-outline" onClick={addNewButtonClick}>
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
                <td className="py-3 text-light-gray capitalize px-2">
                  <div className="flex items-center gap-2">
                    <span role="button" onClick={handleUpdate}>
                      <LuPenSquare color="#aea7a5" size={20} />
                    </span>
                    <span role="button" onClick={handleDelete}>
                      <LuTrash2 color="#c31010" size={20} />
                    </span>
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
  );
};

export default TableRow;
