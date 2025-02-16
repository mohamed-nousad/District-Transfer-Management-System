import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Select, DatePicker, Button, message, Spin, Table } from "antd";
import moment from "moment";

const { Option } = Select;

const UserDisability = ({ userData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [TreatmentDate, setTreatmentDate] = useState(false);
  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/disease/user/${userData.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiseases(response.data || []);
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to fetch diseases");
    } finally {
      setLoading(false);
    }
  };

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
      fetchDiseases();
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
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Are You Taking Treatment",
      dataIndex: "are_you_taking_treatment",
      key: "are_you_taking_treatment",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Treatment Date",
      dataIndex: "treatment_date",
      key: "treatment_date",
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : "N/A"),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <Form.Item
            label="Disease Type"
            name="type"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select onChange={(value) => setTreatmentDate(value === "false")}>
              <Option value="Heart Disease">Heart Disease</Option>
              <Option value="Kidney Disease">Kidney Disease</Option>
              <Option value="Asthma">Asthma</Option>
              <Option value="AIDS">AIDS</Option>
              <Option value="Tuberculosis">Tuberculosis</Option>
              <Option value="Cancer">Cancer</Option>
              <Option value="Hapatatis">Hapatatis</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Are you currently obtaining treatement?"
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
              label="Treatment start Date"
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
      <h2 style={{ marginTop: 30 }}>Diseases</h2>
      <Table
        dataSource={diseases}
        columns={columns}
        rowKey="id"
        loading={loading}
        responsive
      />
    </div>
  );
};

export default UserDisability;
