import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Select, Input, Button, message, Spin, Table } from "antd";
import moment from "moment";
const { Option } = Select;

const { TextArea } = Input;

const UserMedicalCondition = ({ userData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    fetchMedicalConditions();
  }, []);

  const fetchMedicalConditions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/medicalcondition/user/${userData.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConditions(response.data || []);
    } catch (error) {
      message.error("Failed to fetch medical conditions");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/medicalcondition`,
        { ...values, userId: userData.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(
        response.data.message || "Medical condition added successfully"
      );
      form.resetFields();
      fetchMedicalConditions(); // Refresh the table after adding
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.errors[0]?.msg ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Notes", dataIndex: "notes", key: "notes" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            flexDirection: "column",
          }}
        >
          <Form.Item
            label="Medical Condition Type"
            name="type"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Pregnancy">Pregnancy</Option>
              <Option value="Teraphy">Teraphy</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Notes"
            name="notes"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <TextArea rows={4} rules={[{ required: true }]} />
            <br />
            <br />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" block disabled={loading}>
          {loading ? <Spin /> : "Save"}
        </Button>
      </Form>

      <h2 style={{ marginTop: 30 }}>Medical Conditions</h2>
      <Table
        dataSource={conditions}
        columns={columns}
        rowKey="id"
        loading={loading}
        responsive
      />
    </div>
  );
};

export default UserMedicalCondition;
