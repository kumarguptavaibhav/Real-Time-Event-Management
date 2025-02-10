import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCredentials, setCredentialsAsGuest } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../redux/apiSlice";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading, isError }] = useLoginUserMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      console.log("start");
      const response = await loginUser(data).unwrap();
      console.log("response", response);

      if (response?.error === true) {
        toast.error(response?.response?.message);
        return;
      }

      dispatch(setCredentials(response?.response));
      toast.success("Login Successfully");
      navigate("/dashboard");
      reset();
    } catch (error) {
      toast.error(error?.data?.response?.message || "Login failed");
    }
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh", backgroundColor: "#03045e" }}>
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
          marginX: "auto",
          backgroundColor: "white"
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
          Sign In
        </Typography>
        <TextField
          required
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
            "Sign In"
          )}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            dispatch(
              setCredentialsAsGuest({
                token: null,
                user: null,
              })
            );
            navigate("/dashboard");
            toast.success("Guest Login Successfully");
          }}
          disableFocusRipple
          sx={{ mt: "-0.5rem" }}
        >
          Guest Sign In
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
            Dont't have an account?
          </Typography>
          <Typography
            sx={{ fontSize: "0.8rem", color: "#074799", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Sign up now.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
