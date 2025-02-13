import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Avatar, Dropdown, Menu , message } from "antd";
import {
  UserOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const HeaderBar = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    message.success("Logged out successfully");
    navigate("/login"); // Redirect to login page
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<ProfileOutlined />}>
        <Link to="/dashboard/update-profile">Update Profile</Link>
      </Menu.Item>     
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: 20,
        background: "#fff",
      }}
    >
      <Dropdown overlay={menu} placement="bottomRight">
        <Avatar
          size="large"
          icon={<UserOutlined />}
          style={{ cursor: "pointer", margin: "13px", background: "#0176d0" }}
        />
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
