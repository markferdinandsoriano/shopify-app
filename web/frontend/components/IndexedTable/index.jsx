import React from "react";

import Headers from "../TableComponents/Headers";
import RowBody from "../TableComponents/RowBody";
import "./styles.css";

import ViewModel from "./viewModel";

const Table = () => {
  const model = ViewModel();

  return (
    <table className="Table-container">
      <Headers />
      <RowBody />
    </table>
  );
};

export default Table;
