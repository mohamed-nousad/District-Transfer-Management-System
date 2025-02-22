import React, { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb, Button, Drawer, Spin, Alert } from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import UserProfile from "../components/user/UserProfile";
import UserWorkHistory from "../components/user/UserWorkHistory";
import UserDependence from "../components/user/UserDependence";
import UserDisease from "../components/user/UserDisease";
import UserMedicalCondition from "../components/user/UserMedicalCondition";
import UserDisability from "../components/user/UserDisability";
import FinalSubmition from "../components/user/FinalSubmition";
import useCheckUserAuth from "../utils/checkUserAuth";
import axios from "axios";

import { Grid } from "antd";
const { useBreakpoint } = Grid;
const { Content, Sider } = Layout;

const UpdateProfile = () => {
  const { userData, authloading } = useCheckUserAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentSection, setCurrentSection] = useState("BasicDetails");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/user/${userData?.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (userData?.id) fetchUserData();
  }, [userData]);

  const sections = [
    { key: "BasicDetails", label: "Basic Details" },
    { key: "WorkHistory", label: "Work History" },
    { key: "Dependence", label: "Dependence" },
    { key: "Disease", label: "Disease" },
    { key: "MedicalCondition", label: "Medical Condition" },
    { key: "Disability", label: "Disability" },
    { key: "FinalSubmition", label: "FinalSubmition" },
  ];

  const renderContent = () => {
    const content = (
      <div style={{ position: "relative" }}>
        {currentSection === "BasicDetails" && (
          <UserProfile userData={userData} />
        )}
        {currentSection === "WorkHistory" && <UserWorkHistory user={user} />}
        {currentSection === "Dependence" && <UserDependence user={user} />}
        {currentSection === "Disease" && <UserDisease user={user} />}
        {currentSection === "MedicalCondition" && (
          <UserMedicalCondition user={user} />
        )}
        {currentSection === "Disability" && <UserDisability user={user} />}
        {currentSection === "FinalSubmition" && <FinalSubmition user={user} />}
      </div>
    );

    return user?.isSubmited ? (
      <div style={{ position: "relative" }}>
        {content}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {user.isApproved
            ? "Profile Verified - Read only"
            : user.isSubmited
            ? "Profile Submited - Read only"
            : " "}
        </div>
      </div>
    ) : (
      content
    );
  };

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  if (authloading || loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin
          size="large"
          tip="Loading..."
          style={{ fontSize: "24px", transform: "scale(2)" }} // Enlarges the spinner
        />
      </div>
    );

  return (
    <>
      {/* Toggle Button for Mobile View */}
      {(screens.sm || screens.xs) && (
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          style={{
            position: "fixed",
            top: 12,
            left: 20,
            zIndex: 1000,
            borderRadius: "50%",
            width: 50,
            height: 50,
            backgroundColor: "#1890ff",
          }}
        />
      )}

      {/* Sidebar for Larger Screens */}
      {!(screens.sm || screens.xs) && (
        <Sider width={250}>
          <Menu
            mode="inline"
            selectedKeys={[currentSection]}
            style={{ height: "100%", borderRight: 0, padding: "15px" }}
            onClick={({ key }) => setCurrentSection(key)}
          >
            {sections.map((section) => (
              <Menu.Item key={section.key} icon={<UserOutlined />}>
                {section.label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
      )}

      {/* Drawer for Mobile View */}
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={closeDrawer}
        open={drawerVisible} // Updated from 'visible'
      >
        <Menu
          mode="inline"
          selectedKeys={[currentSection]}
          onClick={({ key }) => {
            setCurrentSection(key);
            closeDrawer();
          }}
        >
          {sections.map((section) => (
            <Menu.Item key={section.key} icon={<UserOutlined />}>
              {section.label}
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>

      {/* Main Content */}
      <Content
        style={{
          padding: 40,
          margin: 0,
          minHeight: 280,
          background: "#fff",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Breadcrumb style={{ margin: "auto ", padding: "5px" }}>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{currentSection}</Breadcrumb.Item>
        </Breadcrumb>

        <div className="m-auto w-auto text-center">
          <Alert
            style={{
              maxWidth: 900,
              fontSize: 12,
              padding: "4px 8px",
              alignItems: "center",
              margin: "auto",
            }}
            message={
              user.isApproved
                ? "Profile verified"
                : user.isRejected
                ? "Your data is invalid, please resubmit"
                : user.isSubmited
                ? "Your data submitted, please wait for the approval"
                : "Your profile is not submitted, Please submit."
            }
            type={
              user.isApproved
                ? "success"
                : user.isRejected
                ? "error"
                : user.isSubmited
                ? "success"
                : "warning"
            }
            showIcon
            className="mb-4"
          />
        </div>
        {renderContent()}
        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}
      </Content>
    </>
  );
};

export default UpdateProfile;
