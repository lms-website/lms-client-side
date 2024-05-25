import { createContext } from "react";
/**
 * Example how to call it
 *  <Table>
 * <Table.header/>
 * <Table.Row></Table.Row>
 * </Table>
 * Table header
 * columns=>array of data wanna show in every columns
 * trClassName=>if you wanna style tr
 * thClassName=>if you wanna style th
 * Row=>add whatever you wanna inside it
 */
const TableContext = createContext();
const Table = ({ children, className }) => {
  return (
    <TableContext.Provider value={{}}>
      <table className={className}>{children}</table>
    </TableContext.Provider>
  );
};
function Header({ columns, trClassName, thClassName }) {
  return (
    <thead>
      <tr className={trClassName}>
        {columns.map((column, index) => (
          <th key={index} className={thClassName}>
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}
function Row({ children }) {
  return <tbody>{children}</tbody>;
}
Table.Header = Header;
Table.Row = Row;
export default Table;
