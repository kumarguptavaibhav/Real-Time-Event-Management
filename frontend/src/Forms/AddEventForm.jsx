import {
  TextField,
  FormControl,
  Button,
  Typography,
  Box,
  FormLabel,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import {
  eventLevels,
  eventTypes,
  speakerTypes,
  user,
} from "../Utilities/utils";
import moment from "moment";
import { useCreateEventMutation } from "../redux/apiSlice";

function AddEventForm() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm();
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const user_data = user();
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required!");
        return;
      }
      const { start_date, end_date, ...rest } = data;
      const payload = {
        data: {
          start_date: moment(start_date).format("YYYY-MM-DDTHH:mm:ssZ"),
          end_date: moment(end_date).format("YYYY-MM-DDTHH:mm:ssZ"),
          ...rest,
        },
        user: user_data?.user,
      };
      const response = await createEvent(payload).unwrap();
      if (response?.error) {
        toast.error(response?.response?.message);
        return ;
      }
      toast.success("Successfully created the event!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.response?.message);
    }
  };
  const handleCancel = () => {
    reset();
  };

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
      <Box sx={{ p: 3, mt: 2 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "left",
            fontWeight: "bold",
            mb: 3,
            color: "#03045e",
          }}
        >
          Add New Event
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>Event Name*</FormLabel>
              <Controller
                name="event_name"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="event_name"
                    variant="outlined"
                    placeholder="Enter Event Name"
                    error={!!errors.event_name}
                    helperText={errors.event_name?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </FormControl>

            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>Event Description*</FormLabel>
              <Controller
                name="event_description"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="event_description"
                    variant="outlined"
                    placeholder="Enter Event Description"
                    error={!!errors.event_description}
                    helperText={errors.event_description?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </FormControl>

            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>Event Level*</FormLabel>
              <Controller
                name="event_level"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Autocomplete
                    options={eventLevels}
                    getOptionLabel={(option) => option}
                    isOptionEqualToValue={(option, value) => option === value}
                    value={field.value || ""}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Enter Event Level"
                        fullWidth
                        id="event_level"
                        size="small"
                        error={!!errors.event_level}
                        helperText={errors.event_level?.message}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>Event Type*</FormLabel>
              <Controller
                name="event_type"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Autocomplete
                    options={eventTypes}
                    getOptionLabel={(option) => option}
                    isOptionEqualToValue={(option, value) => option === value}
                    value={field.value || ""}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Enter Event Type"
                        fullWidth
                        id="event_type"
                        size="small"
                        error={!!errors.event_type}
                        helperText={errors.event_type?.message}
                      />
                    )}
                  />
                )}
              />
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl sx={{ width: "25rem" }}>
                <FormLabel>Start Date*</FormLabel>
                <Controller
                  name="start_date"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          id: "start_date",
                          error: !!errors.start_date,
                          helperText: errors.start_date?.message,
                        },
                      }}
                    />
                  )}
                />
              </FormControl>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl sx={{ width: "25rem" }}>
                <FormLabel>End Date*</FormLabel>
                <Controller
                  name="end_date"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          id: "end_date",
                          error: !!errors.end_date,
                          helperText: errors.end_date?.message,
                        },
                      }}
                    />
                  )}
                />
              </FormControl>
            </LocalizationProvider>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>Event Organizers*</FormLabel>
              <Controller
                name="event_organizers"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="event_organizers"
                    variant="outlined"
                    placeholder="Enter Event Organizers"
                    error={!!errors.event_organizers}
                    helperText={errors.event_organizers?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </FormControl>

            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>Organization Name*</FormLabel>
              <Controller
                name="organization_name"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="organization_name"
                    variant="outlined"
                    placeholder="Enter Organization Name"
                    error={!!errors.organization_name}
                    helperText={errors.organization_name?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </FormControl>

            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>External Organizers*</FormLabel>
              <Controller
                name="external_organizers"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="external_organizers"
                    variant="outlined"
                    placeholder="Enter External Organizers"
                    error={!!errors.external_organizers}
                    helperText={errors.external_organizers?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>Speaker Type*</FormLabel>
              <Controller
                name="speaker_type"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Autocomplete
                    options={speakerTypes}
                    getOptionLabel={(option) => option}
                    isOptionEqualToValue={(option, value) => option === value}
                    value={field.value || ""}
                    onChange={(_, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Enter Speaker Type"
                        fullWidth
                        id="speaker_type"
                        size="small"
                        error={!!errors.speaker_type}
                        helperText={errors.speaker_type?.message}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>Speaker Name*</FormLabel>
              <Controller
                name="speaker_name"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="speaker_name"
                    variant="outlined"
                    placeholder="Enter Speaker Name"
                    error={!!errors.speaker_name}
                    helperText={errors.speaker_name?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </FormControl>
            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>Chief Guest Name*</FormLabel>
              <Controller
                name="chief_guest_name"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="chief_guest_name"
                    variant="outlined"
                    placeholder="Enter Chief Guest Name"
                    error={!!errors.chief_guest_name}
                    helperText={errors.chief_guest_name?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <FormControl sx={{ width: "25rem" }}>
              <FormLabel>Chief Guest Designation*</FormLabel>
              <Controller
                name="chief_guest_designation"
                control={control}
                defaultValue=""
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="chief_guest_designation"
                    variant="outlined"
                    placeholder="Enter Chief Guest Designation"
                    error={!!errors.chief_guest_designation}
                    helperText={errors.chief_guest_designation?.message}
                    fullWidth
                    size="small"
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              gap: "1rem",
            }}
          >
            <Button
              sx={{
                backgroundColor: "#cf142b",
                borderColor: "#cf142b",
                color: "white",
              }}
              onClick={handleCancel}
            >
              CANCEL
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "CREATE"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AddEventForm;
