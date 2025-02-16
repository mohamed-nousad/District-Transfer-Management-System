import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserPageContainer from "./layouts/UserPageContainer"; // Layout with sidebar and header
import AdminPageContainer from "./layouts/AdminPageContainer"; // Layout with sidebar and header
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateProfile from "./pages/UpdateProfile";
import ApprovedUsers from "./pages/ApprovedUsers";
import RejectedUsers from "./pages/RejectedUsers";
import TotalUsers from "./pages/TotalUsers";
import UserViewProfile from "./pages/UserViewProfile";
import Test from "./pages/Test";
import Test2 from "./pages/Test2";

const RoutesPage = () => {
  return (
    <Router>
      <Routes>
        {/* Routes with UserPageContainer Layout */}
        <Route element={<UserPageContainer />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Routes with AdminPageContainer Layout */}
        <Route element={<AdminPageContainer />}>
          <Route path="/admin_dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin_dashboard/approved-users"
            element={<ApprovedUsers />}
          />
          <Route
            path="/admin_dashboard/rejected-users"
            element={<RejectedUsers />}
          />
          <Route path="/admin_dashboard/total-users" element={<TotalUsers />} />
          <Route
            path="/admin_dashboard/view-profile/:id"
            element={<UserViewProfile />}
          />
        </Route>

        {/* Routes without PageContainer Layout */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/dashboard/update-profile" element={<UpdateProfile />} />
        <Route path="/test" element={<Test />} />
        <Route path="/test2" element={<Test2 />} />
      </Routes>
    </Router>
  );
};

export default RoutesPage;
