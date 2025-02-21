import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
  Input,
  Table,
} from "antd";
import moment from "moment";
const { Option } = Select;

const Dependence = ({ userData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [dependences, setDependences] = useState([]);

  useEffect(() => {
    fetchDependences();
  }, []);

  const fetchDependences = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/dependence/user/${userData.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDependences(response.data || []);
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to fetch dependences"
      );
    } finally {
      setLoading(false);
    }
  };

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
      fetchDependences();
    } catch (error) {
      message.error(
        error.response?.data?.errors[0]?.msg ||
          error.response?.data?.error ||
          "Failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Dependent Name",
      dataIndex: "dependentName",
      key: "dependentName",
    },
    {
      title: "Dependent Relationship",
      dataIndex: "dependentRelationship",
      key: "dependentRelationship",
    },
    {
      title: "Dependent NIC",
      dataIndex: "dependentNIC",
      key: "dependentNIC",
      render: (text) => text || "N/A",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      key: "workplace",
      render: (text) => text || "N/A",
    },
    { title: "gender", dataIndex: "gender", key: "gender" },
    {
      title: "Dependent DOB",
      dataIndex: "dependent_DOB",
      key: "dependent_DOB",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "School",
      dataIndex: "school",
      key: "school",
      render: (text) => text || "N/A",
    },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Postalcode", dataIndex: "postalcode", key: "postalcode" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {/* Dependent Name */}
          <Form.Item
            label="Dependent Name"
            name="dependentName"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input />
          </Form.Item>

          {/* Dependent Relationship */}
          <Form.Item
            label="Dependent Relationship"
            name="dependentRelationship"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Select>
              <Option value="Husbend">Husbend</Option>
              <Option value="Wife">Wife</Option>
              <Option value="Son">Son</Option>
              <Option value="Daughter">Daughter</Option>
              <Option value="Father">Father</Option>
              <Option value="Mother">Mother</Option>
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
            label="Workplace (optional)"
            name="workplace"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>

          {/* Gender */}
          <Form.Item
            label="Gender"
            name="gender"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true, message: "This field is required" }]}
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
            rules={[{ required: true, message: "This field is required" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          {/* School */}
          <Form.Item
            label="School (optional)"
            name="school"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="School / Workplace City  (optional)"
            name="city"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="School / Workplace Postalcode  (optional)"
            name="postalcode"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>
        </div>

        <Button type="primary" htmlType="submit" block disabled={loading}>
          {loading ? <Spin /> : "Save"}
        </Button>
      </Form>
      <h2 style={{ marginTop: 30 }}>Dependences</h2>
      <Table
        dataSource={dependences}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Dependence;
