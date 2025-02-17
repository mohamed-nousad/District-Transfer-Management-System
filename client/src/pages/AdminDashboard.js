import React from "react";
import { Layout, Spin, Typography } from "antd";
import ApprovalAdmin from "../components/admin/ApprovalAdmin";
import CheckingAdmin from "../components/admin/CheckingAdmin";
import RecommendAdmin from "../components/admin/RecommendAdmin";
import useCheckAdminAuth from "../utils/checkAdminAuth";

const { Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const { adminRole, loading } = useCheckAdminAuth();

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
        padding: "20px",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
      }}
    >
      <Title level={3} style={{ marginBottom: 10 }}>
        Welcome,{" "}
        {adminRole === "checkingAdmin"
          ? "Checking Admin"
          : adminRole === "recommendAdmin"
          ? "Recommend Admin"
          : adminRole === "approveAdmin"
          ? "Approve Admin"
          : "Admin"}
      </Title>
      <Text className="bg-green-200 text-sm px-4 py-1">
        <strong>Admin Role: </strong>
        {adminRole === "checkingAdmin"
          ? "Checking Admin"
          : adminRole === "recommendAdmin"
          ? "Recommend Admin"
          : adminRole === "approveAdmin"
          ? "Approve Admin"
          : "Admin"}
      </Text>
      {adminRole === "approveAdmin" ? (
        <ApprovalAdmin />
      ) : adminRole === "recommendAdmin" ? (
        <RecommendAdmin />
      ) : (
        <CheckingAdmin />
      )}
    </Content>
  );
};

export default AdminDashboard;
