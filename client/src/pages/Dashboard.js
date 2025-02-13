import React from "react";
import { Button, Layout, Progress, Typography, Spin } from "antd";
import useCheckUserAuth from "../utils/checkUserAuth";

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const { userData, loading } = useCheckUserAuth();
  const profileCompletion = 72; // Dynamically update based on user profile

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
    <Content
      style={{
        minHeight: 280,
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        padding: "30px",
      }}
    >
      {userData ? (
        <div style={{ color: "black", margin: 40 }}>
          <Title level={2}>
            Welcome, {userData.nameWithInitial || "User"} {userData.lastName || ""}!
          </Title>
          <br />
          <Text>{userData.NIC}</Text>
        </div>
      ) : (
        <Title level={2}>Welcome, User!</Title>
      )}
        <Title level={3}>Profile progress</Title>

      <Progress
        percent={profileCompletion}
        status="active"
        showInfo={false}
        strokeColor="#4CAF50"
        style={{ width: "80%", margin: "20px auto" }}
      />

      <Text> {profileCompletion}% </Text>

      <div style={{ marginTop: "20px" }}>
        <Button type="primary" style={{ marginBottom: "10px", width: "250px" }}>
          Add Transfer Request
        </Button>
        <br />
        <Button type="default" style={{ width: "250px" }}>
          Previous Applications
        </Button>
      </div>
    </Content>
  );
};

export default Dashboard;
