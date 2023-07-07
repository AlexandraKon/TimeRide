import React from "react";
import { Box, useTheme, Button } from "@mui/material";
import { useGetUsersQuery, useDeleteUserMutation } from "../state/api";
import { DataGrid } from "@mui/x-data-grid";

import Header from "../components/Header";
import CustomColumnMenu from "../components/DataGridCustomColumnMenu";

export const Users = () => {
  const theme = useTheme();
  const { data, isLoading} = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  let res;
  if (data) {
    res = data.result;
  }

  const columns = [
    {
      field: "idUsuari",
      headerName: "ID",
      flex: 0.2,
    },
    {
      field: "username",
      headerName: "User Name",
      flex: 0.5,
    },
    {
      field: "mail",
      headerName: "Email",
      flex: 0.8,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "city",
      headerName: "City",
      flex: 0.4,
    },
    {
      field: "profilePicture",
      headerName: "Profile Picture",
      flex: 0.5,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 0.5,
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
        onClick={() => handleRowDelete(params.row.idUsuari)} 
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
    deleteUser(id);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Users" subtitle="Managing users and list of users" />
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
          getRowId={(row) => row.idUsuari}
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