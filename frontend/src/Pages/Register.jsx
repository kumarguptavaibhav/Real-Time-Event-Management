import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useCreateUserMutation } from "../redux/apiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const response = await createUser(data).unwrap();
      if (response?.error) {
        toast.error(response?.response?.message);
        return ;
      }
      navigate("/login");
      toast.success("Successfully Registered");
    } catch (error) {
      toast.error(error?.data?.response?.message);
    }
  };
  return (
    <Box sx={{ width: "100vw", backgroundColor: "#03045e", height: '100vh' }}>
      <Box
        sx={{
          width: "20rem",
          border: "0.06rem solid",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          padding: "1rem",
          borderRadius: "1rem",
          borderColor: "#0A3981",
          backgroundColor: 'white',
          marginX: 'auto',
        }}
      >
        <Typography
          sx={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            margin: "auto",
            fontSize: "2rem",
            color: "#03045e",
          }}
        >
          Sign Up
        </Typography>
        <TextField
          required
          label="Name"
          variant="outlined"
          size="small"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          required
          type="email"
          label="Email"
          variant="outlined"
          size="small"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          required
          type="password"
          label="Password"
          variant="outlined"
          size="small"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          required
          type="password"
          label="Confirm Password"
          variant="outlined"
          size="small"
          {...register("conf_password", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          error={!!errors.conf_password}
          helperText={errors.conf_password?.message}
        />
        <Button
          sx={{
            backgroundColor: "#074799",
            color: "white",
            borderColor: "#074799",
          }}
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          disableFocusRipple
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Register"
          )}
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: "-1rem",
            gap: "0.25rem",
          }}
        >
          <Typography sx={{ fontSize: "0.8rem" }}>
            Already have an account?
          </Typography>
          <Typography
            sx={{ fontSize: "0.8rem", color: "#074799", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login now.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
