import React, { useState } from "react";
import axios from "axios";
import { Form, Select, DatePicker, Button, message, Spin, Input } from "antd";

const { Option } = Select;

const UserWorkHistory = ({ userData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/workhistory`,
        { ...values, userId: userData.id }, // Include userId
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || "Workhistory added successfully");
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.error || "failed. try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <Form.Item
            label="Workplace"
            name="workplace"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Workplace Type"
            name="workplace_type"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Workplace City"
            name="workplace_city"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Workplace Postal Code"
            name="workplace_postal_code"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Designation"
            name="designation"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="start_date"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="end_date"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Button type="primary" htmlType="submit" block disabled={loading}>
          {loading ? <Spin /> : "Save"}
        </Button>
      </Form>
    </div>
  );
};

export default UserWorkHistory;
