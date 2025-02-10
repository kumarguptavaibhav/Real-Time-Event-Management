import React, { useEffect, useMemo, useState } from "react";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
import {
  useCancelEventMutation,
  useGetEventQuery,
  useJoinEventMutation,
  useUpdateEventMutation,
} from "../redux/apiSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  eventLevels,
  eventTypes,
  speakerTypes,
  user,
} from "../Utilities/utils";
import moment from "moment";
import socket from "../socket.js";
import toast from "react-hot-toast";

function Dashboard() {
  const user_data = user();
  const token = localStorage.getItem("token");
  const { data, isLoading, refetch } = useGetEventQuery();
  const [cancelEvent] = useCancelEventMutation();
  const [joinEvent] = useJoinEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [joinloadingStates, setJoinLoadingStates] = useState({});
  const [cancelloadingStates, setCancelLoadingStates] = useState({});
  const [updateloadingStates, setUpdateLoadingStates] = useState({});
  useEffect(() => {
    if (!isLoading && data?.response) {
      const transformed_data = data?.response.map((data) => {
        return {
          id: data?.id,
          event_name: data?.event_name,
          event_type: data?.event_type,
          event_level: data?.event_level,
          event_organizers: data?.event_organizers,
          event_description: data?.event_description,
          organization_name: data?.organization_name,
          external_organizers: data?.external_organizers,
          speaker_name: data?.speaker_name,
          speaker_type: data?.speaker_type,
          chief_guest_name: data?.chief_guest_name,
          chief_guest_designation: data?.chief_guest_designation,
          start_date: moment(data?.start_date).format("YYYY-MM-DD HH:mm"),
          end_date: moment(data?.end_date).format("YYYY-MM-DD HH:mm"),
          attendees: data?.attendees.length,
        };
      });
      setRows(transformed_data);
    }
  }, [isLoading, data]);
  useEffect(() => {
    socket.on("attendeeUpdate", (updatedEvent) => {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === updatedEvent.id
            ? { ...row, attendees: updatedEvent.attendees.length }
            : row
        )
      );
    });
    return () => {
      socket.off("attendeeUpdate");
    };
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    setCancelLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await cancelEvent({ id, user: user_data }).unwrap();
      setRows((prev) => prev.filter((row) => row.id !== id));
      if (response?.error) {
        toast.error(response?.response?.message);
        return ;
      }
      toast.success("Successfully deleted the event!");
    } catch (error) {
      toast.error(error?.data?.response?.message);
    } finally {
      setCancelLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const { id, start_date, end_date, isNew, attendees, ...rest } = newRow;
    setUpdateLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      const updatedRow = { ...newRow, isNew: false };
      setRows((prevRows) =>
        prevRows.map((row) => (row.id === id ? updatedRow : row))
      );

      const payload = {
        eventId: id,
        user: user_data?.user,
        data: {
          ...rest,
          start_date: moment(start_date, "YYYY-MM-DD HH:mm").toISOString(),
          end_date: moment(end_date, "YYYY-MM-DD HH:mm").toISOString(),
        },
      };
      const response = await updateEvent(payload).unwrap();

      if (response?.error) {
        toast.error(response?.response?.message);
        return ;
      } else {
        toast.success("Successfully updated the event!");
      }

      return updatedRow;
    } catch (error) {
      toast.error(error?.data?.response?.message);
      return newRow;
    } finally {
      setUpdateLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleJoinEvent = (id) => async () => {
    setJoinLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await joinEvent({
        userId: user_data.user.id,
        eventId: id,
      }).unwrap();
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, attendees: row.attendees + 1 } : row
        )
      );
      if (response?.error) {
        toast.error(response?.response?.message);
        return ;
      }
      toast.success("Successfully joined the event!");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.response?.message);
    } finally {
      setJoinLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "event_name",
        headerName: "Event Name",
        width: 180,
        editable: true,
      },
      {
        field: "event_type",
        headerName: "Event Type",
        width: 180,
        editable: true,
        type: "singleSelect",
        valueOptions: eventTypes,
      },
      {
        field: "event_level",
        headerName: "Event Level",
        width: 180,
        editable: true,
        type: "singleSelect",
        valueOptions: eventLevels,
      },
      {
        field: "event_organizers",
        headerName: "Event Organizers",
        width: 180,
        editable: true,
      },
      {
        field: "event_description",
        headerName: "Event Description",
        width: 180,
        editable: true,
      },
      {
        field: "organization_name",
        headerName: "Organization Name",
        width: 180,
        editable: true,
      },
      {
        field: "external_organizers",
        headerName: "External Organizers",
        width: 180,
        editable: true,
      },
      {
        field: "speaker_name",
        headerName: "Speaker Name",
        width: 180,
        editable: true,
      },
      {
        field: "speaker_type",
        headerName: "Speaker Type",
        width: 180,
        editable: true,
        type: "singleSelect",
        valueOptions: speakerTypes,
      },
      {
        field: "chief_guest_name",
        headerName: "Chief Guest Name",
        width: 180,
        editable: true,
      },
      {
        field: "chief_guest_designation",
        headerName: "Chief Guest Designation",
        width: 180,
        editable: true,
      },
      {
        field: "start_date",
        headerName: "Start Date",
        type: "string",
        width: 220,
        editable: false,
      },
      {
        field: "end_date",
        headerName: "End Date",
        type: "string",
        width: 220,
        editable: false,
      },

      {
        field: "attendees",
        headerName: "Total Attendee",
        width: 120,
        editable: true,
      },
      ...(token
        ? [
            {
              field: "actions",
              type: "actions",
              headerName: "Actions",
              width: 200,
              cellClassName: "actions",
              getActions: ({ id }) => {
                const isInEditMode =
                  rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                  return [
                    <GridActionsCellItem
                      key="save"
                      icon={
                        updateloadingStates[id] ? (
                          <CircularProgress size={22} />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      label="Save"
                      sx={{ color: "primary.main" }}
                      onClick={handleSaveClick(id)}
                    />,
                    <GridActionsCellItem
                      key="cancel"
                      icon={<CancelIcon />}
                      label="Cancel"
                      className="textPrimary"
                      onClick={handleCancelClick(id)}
                      color="inherit"
                    />,
                  ];
                }
                return [
                  <GridActionsCellItem
                    key="edit"
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                    disabled={!token} // Disable if token is null
                  />,
                  <GridActionsCellItem
                    key="delete"
                    icon={
                      cancelloadingStates[id] ? (
                        <CircularProgress size={22} />
                      ) : (
                        <DeleteIcon />
                      )
                    }
                    label="Delete"
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                    disabled={!token} // Disable if token is null
                  />,
                  <Button
                    key="join"
                    variant="contained"
                    size="small"
                    onClick={handleJoinEvent(id)}
                    disabled={!token} // Disable if token is null
                  >
                    {joinloadingStates[id] ? (
                      <CircularProgress size={22} color="white" />
                    ) : (
                      "Join"
                    )}
                  </Button>,
                ];
              },
            },
          ]
        : []),
    ],
    [rowModesModel, cancelloadingStates, joinloadingStates]
  );

  if (isLoading) {
    return (
      <Box sx={{ marginX: "50rem" }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box
      component="main"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowX: "hidden",
        overflowY: "hidden",
        bgcolor: "#f5f5f5",
        marginLeft: "240px",
      }}
    >
      <Box sx={{ maxWidth: "1000px", p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#03045e",
            mt: 2,
            ml: 2,
            textAlign: "left",
          }}
        >
          DASHBOARD
        </Typography>
        <Box
          sx={{
            mt: "2rem",
            height: 500,
            width: "80vw",
            "& .actions": {
              color: "text.secondary",
            },
            "& .textPrimary": {
              color: "text.primary",
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onCellDoubleClick={(params, event) => {
              event.defaultMuiPrevented = true;
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                setRows,
                setRowModesModel,
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            filterMode="client"
            disableRowSelectionOnClick
            sx={{
              borderRadius: "1rem",
              "&::-webkit-scrollbar": { display: "none" },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                display: "none",
              },
              "-ms-overflow-style": "none",
              scrollbarWidth: "none",
              "& .MuiDataGrid-root": {
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                border: "1px solid #ddd",
              },
              "& .MuiDataGrid-row": {
                "&:hover": { backgroundColor: "#e2eafc" },
              },
              "& .MuiDataGrid-cell": {
                padding: "8px",
                fontSize: "14px",
              },
              "& .MuiDataGrid-toolbarContainer": {
                backgroundColor: "#b6ccfe",
                padding: "8px",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#4a90e2",
                color: "black",
                fontSize: "15px",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#d7e3fc",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#b6ccfe",
                borderTop: "1px solid #ddd",
              },
              "& .MuiTablePagination-root": {
                color: "#1a1a1a",
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    fontSize: "14px",
                  },
                "& .MuiTablePagination-select": {
                  fontSize: "14px",
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
