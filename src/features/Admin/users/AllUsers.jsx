import axios from "axios";
import TableRow from "../../../components/TableRow";
import { apiKey } from "../../../Utils/helper";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const columns = ["Name", "Email", "Date", "Actions"];
const Teachercolumns = [
  "Name",
  "Email",
  "Date",
  "withdraw",
  "Suspended",
  "Actions",
];
const studentColumns = ["Name", "Email", "Date", "withdraw", "Actions"];
const AllUsers = () => {
  const { token } = useSelector((store) => store.auth);

  return (
    <>
      <TableRow
        title="Admin"
        addNewButtonTitle="Add admin"
        columns={columns}
        endpoint="/api/v1/admins/"
        redirect="/users/create-user/?role=admin"
        handleDeleteEndpoint="/api/v1/admins"
      />
      <TableRow
        title="Teachers"
        addNewButtonTitle="Add teacher"
        columns={Teachercolumns}
        hasWithDrowAndSuspended={true}
        endpoint="/api/v1/teachers/admin"
        redirect="/users/create-user/?role=teacher"
        role="teacher"
        showWithDraw={true}
        showSuspended={true}
      />
      <TableRow
        title="Students"
        addNewButtonTitle="Add Student"
        columns={studentColumns}
        endpoint="/api/v1/students/admin"
        redirect="/users/create-user/?role=student"
        role="student"
        showWithDraw={true}
      />
    </>
  );
};

export default AllUsers;
