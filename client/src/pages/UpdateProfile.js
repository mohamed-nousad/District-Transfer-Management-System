import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Button, Drawer, Spin } from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import UserProfile from "../components/user/UserProfile";
import UserWorkHistory from "../components/user/UserWorkHistory";
import UserDependence from "../components/user/UserDependence";
import UserDisease from "../components/user/UserDisease";
import UserMedicalCondition from "../components/user/UserMedicalCondition";
import UserDisability from "../components/user/UserDisability";
import FinalSubmition from "../components/user/FinalSubmition";
import useCheckAdminAuth from "../utils/checkUserAuth";

import { Grid } from "antd";
const { useBreakpoint } = Grid;
const { Content, Sider } = Layout;

const UpdateProfile = () => {
  const { userData, loading } = useCheckAdminAuth();

  const [currentSection, setCurrentSection] = useState("UserProfile");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint(); // Detect screen size

  const sections = [
    { key: "UserProfile", label: "User Profile" },
    { key: "WorkHistory", label: "Work History" },
    { key: "Dependence", label: "Dependence" },
    { key: "Disease", label: "Disease" },
    { key: "MedicalCondition", label: "Medical Condition" },
    { key: "Disability", label: "Disability" },
    { key: "FinalSubmition", label: "FinalSubmition" },
  ];

  const renderContent = () => {
    switch (currentSection) {
      case "UserProfile":
        return <UserProfile userData={userData} />;
      case "WorkHistory":
        return <UserWorkHistory userData={userData} />;
      case "Dependence":
        return <UserDependence userData={userData} />;
      case "Disease":
        return <UserDisease userData={userData} />;
      case "MedicalCondition":
        return <UserMedicalCondition userData={userData} />;
      case "Disability":
        return <UserDisability userData={userData} />;
      case "FinalSubmition":
        return <FinalSubmition userData={userData} />;
      default:
        return null;
    }
  };

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  if (loading)
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
      {screens.sm || screens.xs ? (
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
      ) : null}

      {/* Sidebar for larger screens */}
      {!screens.sm && !screens.xs && (
        <Sider width={250}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[currentSection]}
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

      {/* Drawer for mobile/tablet screens */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        visible={drawerVisible}
        width={250}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={[currentSection]}
          style={{
            height: "100%",
            borderRight: 0,
            padding: "15px",
            backgroundColor: "#fff",
          }}
          onClick={({ key }) => setCurrentSection(key)}
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
          <Breadcrumb.Item>User Profile</Breadcrumb.Item>
        </Breadcrumb>
        {renderContent()}
      </Content>
    </>
  );
};

export default UpdateProfile;
