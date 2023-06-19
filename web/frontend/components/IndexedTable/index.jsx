import React from "react";
import Headers from "../TableComponents/Headers";
import RowBody from "../TableComponents/RowBody";
import "./styles.css";

const Table = ({ headers, data }) => {
  return (
    <table className="Table-container">
      <Headers headers={headers} />
      <RowBody data={data} headers={headers} />
    </table>
  );
};

export default Table;
