import React, { useState, useEffect } from "react";
import {
  message,
  Spin,
  Typography,
  Col,
  Card,
  Divider,
  Row,
  Space,
} from "antd";
import { Button, Tag } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // Add this import

const { Text } = Typography;

const UserProfile = ({ adminRole }) => {
  const { id } = useParams(); // Get ID from URL params
  const [user, setUser] = useState(null); // Corrected to user (singular)

  useEffect(() => {
    // Fetch user details
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/user/${id}`)
      .then((response) => setUser(response.data))
      .catch(() => message.error("Failed to load user data"));
  }, [id]);

  const handleStatusChange = async (status) => {
    let endpoint = status;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/${endpoint}/${id}`
      );
      if (response.status === 200) {
        setUser({ ...user, status });
        message.success(response.data.message);
      } else {
        message.error(response.data.error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error(
        error.response?.data?.errors?.[0]?.msg ||
          error.response?.data?.error ||
          "Failed to load user data"
      );
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 30 }}>
      {user && (
        <Card
          bordered
          style={{
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Tag
            color="green"
            style={{ fontSize: 16, padding: "5px 10px", borderRadius: 5 }}
          >
            <strong>Admin Role:</strong>{" "}
            {adminRole === "checkingAdmin"
              ? "Checking Admin"
              : adminRole === "recommendAdmin"
              ? "Recommend Admin"
              : adminRole === "approveAdmin"
              ? "Approve Admin"
              : "Admin"}
          </Tag>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text></Text> <Text>{user.nameWithInitial}</Text>
            </Col>
            <Col span={12}>
              <Text></Text> <Text>{user.NIC}</Text>
            </Col>
          </Row>

          <Divider />

          <Space
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
              justifyContent: "start",
            }}
          >
            <Button
              type="primary"
              onClick={() =>
                handleStatusChange(
                  adminRole === "checkingAdmin"
                    ? "check"
                    : adminRole === "recommendAdmin"
                    ? "recommend"
                    : "approve"
                )
              }
              disabled={["check", "recommend", "approve"].includes(user.status)}
            >
              {adminRole === "checkingAdmin"
                ? "Check"
                : adminRole === "recommendAdmin"
                ? "Recommend"
                : "Approve"}
            </Button>

            <Button
              danger
              onClick={() => handleStatusChange("reject")}
              disabled={user.status === "rejected"}
            >
              Reject
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default UserProfile;
