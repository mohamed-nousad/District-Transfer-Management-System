import React, { useState } from "react";
import axios from "axios";
import { Form, Select, DatePicker, Button, message, Spin, Input } from "antd";

const { Option } = Select;

const Dependence = ({ userData , user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/dependence`,
        { ...values, userId: userData.id }, // Include userId
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || "Dependence added successfully");
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.errors[0]?.msg  || error.response?.data?.error  || "Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {/* Dependent Name */}
          <Form.Item
            label="Dependent Name"
            name="dependentName"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {/* Dependent Relationship */}
          <Form.Item
            label="Dependent Relationship"
            name="dependentRelationship"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
          </Form.Item>

          {/* Dependent NIC */}
          <Form.Item
            label="Dependent NIC"
            name="dependentNIC"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>

          {/* Workplace */}
          <Form.Item
            label="Workplace"
            name="workplace"
            style={{ flex: "1 1 48%" }}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
          </Form.Item>

          {/* Gender */}
          <Form.Item
            label="Gender"
            name="gender"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>

          {/* Dependent Date of Birth */}
          <Form.Item
            label="Dependent DOB"
            name="dependent_DOB"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          {/* School */}
          <Form.Item
            label="School"
            name="school"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
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
            label="Postalcode"
            name="postalcode"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
          </Form.Item>
        </div>

        <Button type="primary" htmlType="submit" block disabled={loading}>
          {loading ? <Spin /> : "Save"}
        </Button>
      </Form>
    </div>
  );
};

export default Dependence;
