import React, { useState } from "react";
import Table from "./../../components/Table";
import useGetData from "../../hooks/useFetchData";
import { formateDate } from "../../Utils/helper";
import { LuPenSquare, LuTrash2 } from "react-icons/lu";
import SpinnerFullPage from "../../Ui/SpinnerFullPage";
import Button from "../../components/Button";
import TableRow from "../../components/TableRow";
const columns = ["Name", "Email", "Date", "Actions"];
const AllUsers = () => {
  return (
    <>
      <TableRow
        title="Admin"
        addNewButtonTitle="Add admin"
        columns={columns}
        endpoint="/api/v1/admins/"
      />
      <TableRow
        title="Users"
        addNewButtonTitle="Add user"
        columns={columns}
        endpoint="/api/v1/teachers/admin"
      />
    </>
  );
};

export default AllUsers;
