import TableRow from "../../../components/TableRow";
const columns = ["Name", "Email", "Date", "Actions"];
const AllUsers = () => {
  return (
    <>
      <TableRow
        title="Admin"
        addNewButtonTitle="Add admin"
        columns={columns}
        endpoint="/api/v1/admins/"
        redirect="/users/create-user/?role=admin"
      />
      <TableRow
        title="Teachers"
        addNewButtonTitle="Add teacher"
        columns={columns}
        endpoint="/api/v1/teachers/admin"
        redirect="/users/create-user/?role=teacher"
      />
      <TableRow
        title="Students"
        addNewButtonTitle="Add Student"
        columns={columns}
        endpoint="/api/v1/students/admin"
        redirect="/users/create-user/?role=student"
      />
    </>
  );
};

export default AllUsers;
