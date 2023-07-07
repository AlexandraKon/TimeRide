import React from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import Header from "../components/Header";
import CustomColumnMenu from "../components/DataGridCustomColumnMenu";
import { useGetRoutesQuery, useDeleteRoutesMutation } from "../state/api";

export const RoutesL = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetRoutesQuery();
  const [deleteRoute] = useDeleteRoutesMutation();
  let res;
  if (data) {
    res = data.result;
  }

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 0.5,
    },
    {
      field: "segons",
      headerName: "Time in seconds",
      flex: 1,
    },
    {
      field: "modalitat",
      headerName: "Mode",
      flex: 0.3,
    },
    {
      field: "user",
      headerName: "User ID",
      flex: 0.3,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.7,
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 0.7,
    },
  ];

  const columnsWithDelete = [
    ...columns,
    {
      field: 'delete',
      headerName: 'Delete',
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <Button 
        onClick={() => handleRowDelete(params.row._id)} 
        sx={{
          color: theme.palette.secondary[200],
          "&:hover": {
            bgcolor: "#0000",
            color: "red",
          },
        }}>
          Delete
        </Button>
      ),
    },
  ];

  const handleRowDelete = async (id) => {
    deleteRoute(id);
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Routes" subtitle="Managing routes and list of routes" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={res || []}
          columns={columnsWithDelete}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
        />
      </Box>
    </Box>
  );
};
