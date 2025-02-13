import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Select, Alert, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";

const { Option } = Select;

const Register = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        values
      );

      if (response) {
        setSuccess(response.data.message || "Registration Successful!");
        setError("");
        message.success(response.data.message || "Registration Successful!");
        setTimeout(() => setSuccess(""), 6000);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setSuccess("");
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      setTimeout(() => setError(""), 6000);
      message.error(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Header />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-2/5">
        <h1 className="text-3xl font-semibold text-gray-700 text-center mb-6">
          Register
        </h1>

        {success && (
          <Alert message={success} type="success" showIcon className="mb-4" />
        )}
        {error && (
          <Alert message={error} type="error" showIcon className="mb-4" />
        )}

        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name with Initial"
                name="nameWithInitial"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="NIC"
                name="NIC"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, type: "email", message: "Invalid email" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Contact Number"
                name="contactNumber"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit" className="w-full mt-4">
            Register
          </Button>
        </Form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;