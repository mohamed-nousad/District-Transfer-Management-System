import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Button, Drawer, Spin } from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import UserProfile from "../components/admin/UserProfile";
import UserWorkHistory from "../components/admin/UserWorkHistory";
import UserDependence from "../components/admin/UserDependence";
import UserDisease from "../components/admin/UserDisease";
import UserMedicalCondition from "../components/admin/UserMedicalCondition";
import UserDisability from "../components/admin/UserDisability";
import FinalReview from "../components/admin/FinalReview";
import useCheckAdminAuth from "../utils/checkAdminAuth";

import { Grid } from "antd";
const { useBreakpoint } = Grid;
const { Content, Sider } = Layout;

const UpdateProfile = () => {
  const { adminRole, loading } = useCheckAdminAuth();

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
    { key: "FinalReview", label: "Final Review" },
  ];

  const renderContent = () => {
    switch (currentSection) {
      case "UserProfile":
        return <UserProfile adminRole={adminRole} />;
      case "WorkHistory":
        return <UserWorkHistory adminRole={adminRole} />;
      case "Dependence":
        return <UserDependence adminRole={adminRole} />;
      case "Disease":
        return <UserDisease adminRole={adminRole} />;
      case "MedicalCondition":
        return <UserMedicalCondition adminRole={adminRole} />;
      case "Disability":
        return <UserDisability adminRole={adminRole} />;
      case "FinalReview":
        return <FinalReview adminRole={adminRole} />;
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
            <Link to="/admin_dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>User Profile</Breadcrumb.Item>
        </Breadcrumb>
        {renderContent()}
      </Content>
    </>
  );
};

export default UpdateProfile;
