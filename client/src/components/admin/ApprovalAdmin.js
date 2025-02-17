import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Card, Alert, Button } from "antd";
import { fetchRecommendedUsers } from "../../utils/adminRoutes"; // Import the utility function

export default function CheckingAdmin() {
  const navigate = useNavigate();
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken"); // Assuming token is stored in localStorage

    if (!token) {
      setMessage("❌ Unauthorized! Please log in as an admin.");
      return;
    }
    fetchRecommendedUsers(token, setRecommendedUsers, setMessage);
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "nameWithInitial",
      key: "name",
    },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    {
      title: "NIC",
      dataIndex: "NIC",
      key: "nic",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Contact",
      dataIndex: "contactNumber",
      key: "contact",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() =>
            navigate(`/admin_dashboard/view-profile/${record._id}`)
          }
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {message && (
        <Alert message={message} type="error" showIcon className="mb-4" />
      )}

      <Card title="Recommended Users" bordered>
        <Table
          columns={columns}
          dataSource={recommendedUsers}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "No recommended users available." }}
          scroll={{ x: "max-content" }} // Enables horizontal scrolling for wide content
          responsive
        />
      </Card>
    </div>
  );
}
