import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
  Table,
  Input,
} from "antd";
import moment from "moment";
const { Option } = Select;

const UserWorkHistory = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [workhistories, setWorkhistories] = useState([]);

  useEffect(() => {
    fetchWorkHistories();
  }, []);

  const fetchWorkHistories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/workhistory/user/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkhistories(response.data || []);
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to fetch workhistories"
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
        `${process.env.REACT_APP_API_URL}/user/workhistory`,
        { ...values, userId: user._id }, // Include userId
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(
        response.data.message || "Workhistory added successfully"
      );
      form.resetFields();
      fetchWorkHistories(); // Refresh the table after adding
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.errors[0]?.msg ||
          "Failed. Try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Workplace Type",
      dataIndex: "workplace_type",
      key: "workplace_type",
    },
    {
      title: "Workplace City",
      dataIndex: "workplace_city",
      key: "workplace_city",
    },
    {
      title: "Workplace Postalcode",
      dataIndex: "workplace_postalcode",
      key: "workplace_postalcode",
    },
    { title: "Designation", dataIndex: "designation", key: "designation" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <Form.Item
            label="Workplace name"
            name="workplace"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Workplace Type"
            name="workplace_type"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="District Secretariat">District Secretariat</Option>
              <Option value="Divisional Secretariat">
                Divisional Secretariat
              </Option>
              <Option value="Ministry / Department">
                Ministry / Department
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Workplace City"
            name="workplace_city"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Workplace Postal Code"
            name="workplace_postalcode"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Designation"
            name="designation"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Input />
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
      <h2 style={{ marginTop: 30 }}>Work Hoistories</h2>
      <Table
        dataSource={workhistories}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UserWorkHistory;
