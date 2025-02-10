import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Layout from "./Layout";
import AddEventForm from "./Forms/AddEventForm";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return <Layout />;
};

const AuthRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" /> : element;
};

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthRoute element={<Login />} />} />
          <Route
            path="/register"
            element={<AuthRoute element={<Register />} />}
          />
          <Route element={<ProtectedRoute element={<Layout />} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-event" element={<AddEventForm />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
