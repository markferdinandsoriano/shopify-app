import { Pagination, HorizontalStack } from "@shopify/polaris";
import React from "react";
import CustomPagination from "../CustomPagination";

import Select from "../Select";

import "./styles.css";

import viewModel from "./viewModel.js";

export default function PaginationComponent() {
  const model = viewModel();
  return (
    <HorizontalStack blockAlign="end" align="center" gap="2">
      <div
        style={{
          width: "18%",
          display: "block",
          justifyContent: "flex-start",
          marginBottom: "1em",
        }}
      >
        <Select getSelectedValue={model?.handleSelectedLimit} />
      </div>
      <div
        style={{
          width: "80%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "1em",
        }}
      >
        <CustomPagination
          currentPage={model?.currentPage}
          totalPages={model?.totalPages}
          siblings={model?.siblings}
          onChangePage={model?.handlePageChange}
          hasNextPage={model?.pageInfo?.hasNextPage}
          hasPrevPage={model?.pageInfo?.hasPreviousPage}
          pageLimit={model?.currentLimit}
        />
      </div>
    </HorizontalStack>
  );
}
