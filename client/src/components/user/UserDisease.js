import React, { useState } from "react";
import axios from "axios";
import { Form, Select, DatePicker, Button, message, Spin } from "antd";

const { Option } = Select;

const UserDisability = ({ userData , user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [TreatmentDate, setTreatmentDate] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/disease`,
        { ...values, userId: userData.id }, // Include userId
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || "Disease added successfully");
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <Form.Item
            label="Type"
            name="type"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select onChange={(value) => setTreatmentDate(value === "false")}>
              <Option value="mental">Mental </Option>
              <Option value="visual">Visual</Option>
              <Option value="phycological">Phycological</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="are_you_taking_treatment"
            name="are_you_taking_treatment"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select onChange={(value) => setTreatmentDate(value === "true")}>
              <Option value="false">No</Option>
              <Option value="true">Yes</Option>
            </Select>
          </Form.Item>

          {TreatmentDate && (
            <Form.Item
              label="treatment_date"
              name="treatment_date"
              style={{ flex: "1 1 48%" }}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
          )}
        </div>
        <Button type="primary" htmlType="submit" block disabled={loading}>
          {loading ? <Spin /> : "Save"}
        </Button>
      </Form>
    </div>
  );
};

export default UserDisability;
