import React, { useState, useEffect } from "react";
import { Button, Layout, Progress, Typography, Spin, message } from "antd";
import axios from "axios";
import useCheckUserAuth from "../utils/checkUserAuth";

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const { userData, loading } = useCheckUserAuth();
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (userData) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/user/user/progress/${userData.id}`)
        .then((response) => setProfileCompletion(response.data.progress))
        .catch(() => message.error("Failed to fetch progress"));
    }
  }, [userData]);

  const handleRefresh = () => {
    if (userData) {
      axios
        .put(`${process.env.REACT_APP_API_URL}/user/user/progress/${userData.id}`, { progressValue: profileCompletion })
        .then((response) => {
          setProfileCompletion(response.data.progress);
          message.success("Progress updated!");
        })
        .catch(() => message.error("Failed to update progress"));
    }
  };

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
        <Spin size="large" tip="Loading..." />
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
            Welcome, {userData.nameWithInitial || "User"} {userData.lastName || ""}
          </Title>
          <Text>{userData.NIC}</Text>
        </div>
      ) : (
        <Title level={2}>Welcome, User!</Title>
      )}

      <Title level={3}>Profile Progress</Title>

      <Progress
        percent={profileCompletion}
        status={profileCompletion === 100 ? "success" : "active"}
        showInfo={false}
        strokeColor={profileCompletion === 100 ? "#4CAF50" : "#FF8C00"}
        style={{ width: "80%", margin: "20px auto" }}
      />
      <Text>{profileCompletion}%</Text>

      {profileCompletion === 100 && (
        <span style={{ color: "#4CAF50", fontWeight: "bold", marginLeft: "10px" }}>
          Completed with Verified Badge
        </span>
      )}

      <div style={{ marginTop: "20px" }}>
        <Button
          type="primary"
          style={{ marginBottom: "10px", width: "250px" }}
          onClick={handleRefresh}
        >
          Refresh Progress
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
