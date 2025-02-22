import React, { useEffect } from "react";
import { Input, Button, Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          navigate("/dashboard");
        } else {
          message.error("Token expired. Please re-login.");
          localStorage.removeItem("token");
        }
      } catch {
        message.error("Invalid Token. Please login.");
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        values
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        message.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during login:", error);
      message.error(error.response?.data?.message || `Login failed. try again`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Header Section */}
      <Header />

      {/* Login Form Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Login to your account
        </h3>

        <Form
          form={form}
          name="loginForm"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="NIC"
            name="NIC"
            rules={[{ required: true, message: "Please input your NIC!" }]}
          >
            <Input
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => {
                form.setFieldsValue({ NIC: e.target.value.toUpperCase() });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password className="w-full p-2 border border-gray-300 rounded-md" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Are you an admin?{" "}
            <Link to="/admin_login" className="text-blue-600 hover:underline">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
