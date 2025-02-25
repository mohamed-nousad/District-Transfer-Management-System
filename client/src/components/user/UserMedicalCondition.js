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
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

const UserMedicalCondition = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [conditions, setConditions] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null); // Track condition being edited

  // Fetching medical conditions for the user
  const fetchMedicalConditions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/medicalcondition/user/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConditions(response.data || []);
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to fetch medical conditions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalConditions();
  }, []);

  const deleteMedicalCondition = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/user/medicalcondition/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update state immediately after successful deletion
      setConditions((prev) => prev.filter((item) => item._id !== id));
  
      message.success("Medical condition deleted successfully");
    } catch (error) {
      message.error(
        error.response?.data?.error || "Failed to delete medical condition"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setConfirmVisible(false);
    UpdateProgressValue();
  };

  const UpdateProgressValue = () => {
    let collection = "usermedicalconditions";

    if (user) {
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/user/user/progress/${user._id}`,
          { collection: collection } // Pass the collection name dynamically
        )
        .then((response) => {
          message.success(
            response.data.message || "Progress updated successfully"
          );
        })
        .catch((error) => {
          const errorMessage =
            error.response && error.response.data && error.response.data.error
              ? error.response.data.error
              : "Failed to update progress";
          message.error(errorMessage);
        });
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = editingCondition
        ? `${process.env.REACT_APP_API_URL}/user/medicalcondition/${editingCondition._id}`
        : `${process.env.REACT_APP_API_URL}/user/medicalcondition`;

      const method = editingCondition ? "put" : "post";
      
      const response = await axios({
        method,
        url,
        data: { ...values, userId: user._id },
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success(
        response.data.message || "Medical condition saved successfully"
      );
      form.resetFields();
      setEditingCondition(null); // Reset the editing condition after saving
      fetchMedicalConditions(); // Refresh the table after saving
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
      render: (text) => text || "N/A",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "N/A",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button
            className="btn bg-blue-500 text-white"
            onClick={() => setEditingCondition(record)} // Set the condition being edited
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this disease?"
            onConfirm={() => deleteMedicalCondition(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="btn bg-red-500 text-white" style={{ marginLeft: 8 }}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Prepopulate the form if editing a condition
  useEffect(() => {
    if (editingCondition) {
      form.setFieldsValue({
        type: editingCondition.type,
        notes: editingCondition.notes,
      });
    } else {
      form.resetFields();
    }
  }, [editingCondition, form]);

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
          {!checkboxChecked && (
            <>
              <Form.Item
                label="Medical Condition Type"
                name="type"
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select>
                  <Option value="Pregnancy">Pregnancy</Option>
                  <Option value="Therapy">Therapy</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Notes"
                name="notes"
                rules={[{ required: true, message: "This field is required" }]}
              >
                <TextArea placeholder="Enter your notes (Max 300 characters)" />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Checkbox onChange={(e) => setCheckboxChecked(e.target.checked)}>
              I don’t have any medical condition
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
            <Button
              type="primary"
              onClick={form.submit}
              block
              disabled={loading}
            >
              {loading ? <Spin /> : "Save"}
            </Button>
          )}
        </div>
      </Form>

      <Modal
        title="Confirm Submission"
        open={confirmVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
      >
        <p>Are you sure you want to submit with no medical condition?</p>
      </Modal>

      <h2 style={{ marginTop: 30 }}>Medical Conditions</h2>
      <Table
        dataSource={conditions}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UserMedicalCondition;
