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
  Popconfirm,
} from "antd";
import moment from "moment";

const { Option } = Select;

const UserWorkHistory = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [workhistories, setWorkhistories] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentWorkHistory, setCurrentWorkHistory] = useState(null);

  // Fetch work histories
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
  }, [user._id]);

  useEffect(() => {
    fetchWorkHistories();
  }, [fetchWorkHistories]);

  const handleConfirm = async () => {
    setConfirmVisible(false);
    updateProgressValue();
  };

  const updateProgressValue = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/user/user/progress/${user._id}`,
        { collection: "userworkhistories" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Progress updated successfully");
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to update progress"
      );
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (editMode && currentWorkHistory) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/user/workhistory/${currentWorkHistory._id}`,
          { ...values, userId: user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Work history updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/user/workhistory`,
          { ...values, userId: user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Work history added successfully");
      }
      form.resetFields();
      setEditMode(false);
      setCurrentWorkHistory(null);
      fetchWorkHistories();
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.errors?.[0]?.msg ||
          "Failed. Try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkHistory = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/user/workhistory/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update state immediately after successful deletion
      setWorkhistories((prev) => prev.filter((item) => item._id !== id));
  
      message.success("Work history deleted successfully");
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to delete work history"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      workplace: record.workplace,
      workplace_type: record.workplace_type,
      workplace_city: record.workplace_city,
      workplace_postalcode: record.workplace_postalcode,
      designation: record.designation,
      start_date: moment(record.start_date),
      end_date: moment(record.end_date),
    });
    setEditMode(true);
    setCurrentWorkHistory(record);
  };

  const columns = [
    {
      title: "Workplace Name",
      dataIndex: "workplace",
      key: "workplace",
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
      title: "Workplace Postal Code",
      dataIndex: "workplace_postalcode",
      key: "workplace_postalcode",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
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
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            className="btn bg-blue-500 text-white"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this work history?"
            onConfirm={() => deleteWorkHistory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="btn bg-red-500 text-white">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {!checkboxChecked && (
            <>
              <Form.Item
                label="Workplace Name"
                name="workplace"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Workplace Type"
                name="workplace_type"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
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
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Workplace Postal Code"
                name="workplace_postalcode"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Designation"
                name="designation"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Start Date"
                name="start_date"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="End Date"
                name="end_date"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
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
            {loading ? <Spin /> : editMode ? "Update" : "Save"}
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
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UserWorkHistory;
