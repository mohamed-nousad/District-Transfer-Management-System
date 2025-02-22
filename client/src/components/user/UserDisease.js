import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Select, Input, Button, message, Spin, Table, Checkbox, Modal } from "antd";
import moment from "moment";
const { Option } = Select;

const UserDisease = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [diseases, setDiseases] = useState([]);
  
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  
  const currentProgressValue = user.progressValue || 0; // Default to 0 if no value exists

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/disease/user/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiseases(response.data || []);
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to fetch diseases"
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
        `${process.env.REACT_APP_API_URL}/user/disease`,
        { ...values, userId: user._id }, // Include userId
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
      render: (text) => (text ? "Yes" : "No")
    },
    {
      title: "Treatment Date",
      dataIndex: "treatment_date",
      key: "treatment_date",
      render: (text) => (text ? moment(text).format("YYYY-MM-DD") : "N/A"),
    },
  ];

  const handleConfirm = async () => {
    setConfirmVisible(false);
    UpdateProgressValue();
  };

  const UpdateProgressValue = async () => {
    try {
      setLoading(true);
      const updatedData = { progressValue: currentProgressValue + 15 };
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/user/${user._id}`,
        updatedData
      );
      message.success(response.data.message || "Profile updated successfully");
    } catch (error) {
      message.error(error.response?.data?.error || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {!checkboxChecked && (
            <>
              <Form.Item
                label="Disease Type"
                name="type"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Heart Disease">Heart Disease</Option>
                  <Option value="Kidney Disease">Kidney Disease</Option>
                  <Option value="Asthma">Asthma</Option>
                  <Option value="AIDS">AIDS</Option>
                  <Option value="Tuberculosis">Tuberculosis</Option>
                  <Option value="Cancer">Cancer</Option>
                  <Option value="Hepatitis">Hepatitis</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Are you currently obtaining treatment?"
                name="are_you_taking_treatment"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="false">No</Option>
                  <Option value="true">Yes</Option>
                </Select>
              </Form.Item>
            </>
          )}
        </div>

        <Form.Item>
          <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)}>
            I don’t have any disease
          </Checkbox>
        </Form.Item>

        {checkboxChecked ? (
          <Button
            type="primary"
            onClick={() => setConfirmVisible(true)}
            block
            disabled={loading}
          >
            {loading ? <Spin /> : "Confirm"}
          </Button>
        ) : (
          <Button type="primary" htmlType="submit" block disabled={loading}>
            {loading ? <Spin /> : "Save"}
          </Button>
        )}
      </Form>

      <Modal
        title="Confirm Submission"
        open={confirmVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
      >
        <p>Are you sure you want to submit with no disease?</p>
      </Modal>

      <h2 style={{ marginTop: 30 }}>Diseases</h2>
      <Table
        dataSource={diseases}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UserDisease;
