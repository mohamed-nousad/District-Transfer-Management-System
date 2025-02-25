import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Select,
  Input,
  Button,
  message,
  Spin,
  Table,
  Checkbox,
  Modal,
  Popconfirm,
} from "antd";
const { Option } = Select;

const UserDisability = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [disabilities, setDisabilities] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // Track editing record

  // Fetch disabilities
  const fetchDisabilities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/disability/user/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDisabilities(response.data || []);
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to fetch disabilities"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisabilities();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let response;
      if (editingRecord) {
        // Update existing disability
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/user/disability/${editingRecord._id}`,
          { ...values, userId: user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Disability updated successfully");
      } else {
        // Add new disability
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/disability`,
          { ...values, userId: user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Disability added successfully");
      }

      form.resetFields();
      fetchDisabilities();
      setEditingRecord(null); // Reset editing state after submit
    } catch (error) {
      message.error(
        error.response?.data?.error ||
          error.response?.data?.errors?.[0]?.msg ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record); // Set the record to edit
    form.setFieldsValue({
      type: record.type,
      level: record.level,
      since_birth: record.since_birth.toString(),
      how_many_years: record.how_many_years || "", // Optional field
    });
  };

  const handleConfirm = async () => {
    setConfirmVisible(false);
    updateProgressValue();
  };

  const updateProgressValue = () => {
    let collection = "userdisabilities";

    if (user) {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/user/user/progress/${user._id}`,
          { collection: collection }
        )
        .then((response) => {
          message.success(
            response.data.message || "Progress updated successfully"
          );
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.error || "Failed to update progress";
          message.error(errorMessage);
        });
    }
  };

  const deleteDisability = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/user/disability/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDisabilities((prev) => prev.filter((item) => item._id !== id));

      message.success("Disability deleted successfully");
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to delete disability"
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
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Since Birth",
      dataIndex: "since_birth",
      key: "since_birth",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Number of years",
      dataIndex: "how_many_years",
      key: "how_many_years",
      render: (text) => text || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            className="btn bg-blue-500 text-white"
            onClick={() => handleEdit(record)} // Edit button
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this disability?"
            onConfirm={() => deleteDisability(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="btn bg-red-500 text-white">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const howManyYears = Form.useWatch("since_birth", form);

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {!checkboxChecked && (
            <>
              <Form.Item
                label="Disability Type"
                name="type"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Hearing">Hearing</Option>
                  <Option value="Visual">Visual</Option>
                  <Option value="Physical">Physical</Option>
                  <Option value="Psychological">Psychological</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Disability Level"
                name="level"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Severe">Severe</Option>
                  <Option value="Mild">Mild</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Since Birth"
                name="since_birth"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="true">Yes</Option>
                  <Option value="false">No</Option>
                </Select>
              </Form.Item>
              {howManyYears === "false" && (
                <Form.Item
                  label="Number of years"
                  name="how_many_years"
                  style={{ flex: "1 1 48%" }}
                  rules={[{ required: true, message: "Number of years is required" }]}
                >
                  <Input style={{ width: "100%" }} />
                </Form.Item>
              )}
            </>
          )}
        </div>

        <Form.Item>
          <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)}>
            I don’t have any disability
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
            {loading ? <Spin /> : editingRecord ? "Update" : "Save"}
          </Button>
        )}
      </Form>

      <Modal
        title="Confirm Submission"
        open={confirmVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
      >
        <p>Are you sure you want to submit with no disability?</p>
      </Modal>

      <h2 style={{ marginTop: 30 }}>Disabilities</h2>
      <Table
        dataSource={disabilities}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UserDisability;
