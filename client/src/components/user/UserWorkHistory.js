import React, { useState, useEffect, useCallback } from "react";
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
  Checkbox,
  Modal,
} from "antd";
import moment from "moment";

const { Option } = Select;

const UserWorkHistory = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [workhistories, setWorkhistories] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const currentProgressValue = user.progressValue || 0; // Default to 0 if no value exists

  // Fetch work histories with useCallback
  const fetchWorkHistories = useCallback(async () => {
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
        error.response?.data?.error || "Failed to fetch work histories"
      );
    } finally {
      setLoading(false);
    }
  }, [user._id]); // Add user._id to the dependency array

  useEffect(() => {
    fetchWorkHistories();
  }, [fetchWorkHistories]); // Include fetchWorkHistories in the dependency array

  const handleConfirm = async () => {
    setConfirmVisible(false);
    UpdateProgressValue();
  };

  const UpdateProgressValue = async () => {
    try {
      setLoading(true);
      const updatedData = { progressValue: currentProgressValue + 15 };

      // Send the update request to the backend
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

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/workhistory`,
        { ...values, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(
        response.data.message || "Work history added successfully"
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
          {/* Render form fields conditionally based on checkboxChecked */}
          {!checkboxChecked && (
            <>
              <Form.Item
                label="Workplace Name"
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
                  <Option value="District Secretariat">
                    District Secretariat
                  </Option>
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
            </>
          )}
        </div>

        <Form.Item>
          <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)}>
            I don’t have any work history
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
          <Button type="primary" onClick={form.submit} block disabled={loading}>
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
        <p>Are you sure you want to submit with no work history?</p>
      </Modal>

      <h2 style={{ marginTop: 30 }}>Work Histories</h2>
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
