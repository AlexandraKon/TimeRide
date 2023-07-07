import React from "react";
import { Box, useTheme, Button } from "@mui/material";
import { useGetCommentsQuery, useDeleteCommentsMutation } from "../state/api";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../components/Header";
import CustomColumnMenu from "../components/DataGridCustomColumnMenu";

export const Comments = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetCommentsQuery();
  const [deleteComment] = useDeleteCommentsMutation();
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
      field: "text",
      headerName: "Text",
      flex: 1,
    },
    {
      field: "user",
      headerName: "User ID",
      flex: 0.2,
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
    deleteComment(id);
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Comments" subtitle="Managing comments and list of comments" />
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
