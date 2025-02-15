import React from "react";
import { Layout, Spin } from "antd";
import ApprovalAdmin from "../components/admin/ApprovalAdmin";
import CheckingAdmin from "../components/admin/CheckingAdmin";
import RecommendAdmin from "../components/admin/RecommendAdmin";
import useCheckAdminAuth from "../utils/checkAdminAuth";

const { Content } = Layout;

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
      {adminRole === "approveAdmin" ? (
        <ApprovalAdmin />
      ) : adminRole === "recommendAdmin" ? (
        <RecommendAdmin />
      ) : (
        <CheckingAdmin />
      )}

      <h2 style={{ margin: 0 }}>Welcome, {adminRole || "Admin"}!</h2>
    </Content>
  );
};

export default AdminDashboard;
