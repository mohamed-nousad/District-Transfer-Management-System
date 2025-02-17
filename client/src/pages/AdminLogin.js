import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { jwtDecode } from "jwt-decode";
import {
  Input,
  Button,
  Form,
  Checkbox,
  Alert,
  Card,
  Typography,
  message,
} from "antd";

const { Title } = Typography;

const AdminLogin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          navigate("/admin_dashboard");
        } else {
          message.error("Token expired. Please re-login.");
          localStorage.removeItem("adminToken");
        }
      } catch {
        message.error("Invalid Token. Please login.");
        localStorage.removeItem("adminToken");
      }
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/admin/login`,
        { adminId: values.adminId, password: values.password },
        { withCredentials: true }
      );

      if (res.data.accessToken) {
        const decodedToken = jwtDecode(res.data.accessToken);
        if (decodedToken.exp * 1000 < Date.now()) {
          setError("Session expired. Please log in again.");
          setLoading(false);
          return;
        }

        localStorage.setItem("adminToken", res.data.accessToken);
        navigate("/admin_dashboard");
        message.success("Login successful!");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.message;
        setError(errorMessage || "Login failed. Please try again.");
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Header />
      <Card className="shadow-lg w-full max-w-md p-6">
        <Title level={3} className="text-center">
          Admin Login
        </Title>

        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}

        <Form
          layout="vertical"
          onFinish={handleLogin}
          initialValues={{ remember: true }}
        >
          <Form.Item
            label="Admin ID"
            name="adminId"
            rules={[{ required: true, message: "Please enter your Admin ID" }]}
          >
            <Input value={userId} onChange={(e) => setUserId(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
