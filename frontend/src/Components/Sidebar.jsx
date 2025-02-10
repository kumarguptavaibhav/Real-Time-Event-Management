import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCardIcon from "@mui/icons-material/AddCard";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { toast } from "react-hot-toast";
import PersonIcon from "@mui/icons-material/Person";
import Divider from "@mui/material/Divider";
import { user } from "../Utilities/utils";

const drawerWidth = 240;

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = localStorage.getItem("token");
  const user_data = user();
  const handleLogout = () => {
    dispatch(logout);
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logout Successfully");
  };
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  ];
  if (token) {
    menuItems.push({
      text: "Add New Event",
      icon: <AddCardIcon />,
      path: "/create-event",
    });
  }
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#03045e",
          borderTopRightRadius: "1.5rem",
          borderBottomRightRadius: "1.5rem",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
          padding: "0.5rem",
        }}
      >
        <PersonIcon sx={{ fontSize: 40, color: "white" }} />
        <Typography sx={{ color: "white" }}>
          {token ? user_data?.user?.name : "Guest User"}
        </Typography>
      </Box>
      <Divider sx={{ width: "100%", bgcolor: "rgba(255, 255, 255, 0.12)" }} />
      <List sx={{ mt: 4, color: "black" }}>
        {menuItems.map((item) => (
          <Box
            sx={{
              marginX: "1rem",
              borderRadius: "0.5rem",
              backgroundColor: pathname === item.path ? "#caf0f8" : null,
            }}
          >
            <Link to={item.path} key={item.text}>
              <ListItem button to={item.path}>
                <ListItemIcon
                  sx={{ color: pathname === item.path ? "#03045e" : "white" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: pathname === item.path ? "#03045e" : "white" }}
                />
              </ListItem>
            </Link>
          </Box>
        ))}
        <Box sx={{ marginX: "1rem", borderRadius: "0.5rem" }}>
          <ListItem button onClick={handleLogout} sx={{ cursor: "pointer" }}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText primary="Log Out" sx={{ color: "white" }} />
          </ListItem>
        </Box>
      </List>
    </Drawer>
  );
}

export default Sidebar;
