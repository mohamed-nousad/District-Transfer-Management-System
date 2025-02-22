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
          // Check if the error response has data and error message
          const errorMessage =
            error.response && error.response.data && error.response.data.error
              ? error.response.data.error
              : "Failed to update progress"; // Default message
          message.error(errorMessage);
        });
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/medicalcondition`,
        { ...values, userId: user._id },
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
                rules={[
                  { required: true, message: "This field is required" },
                  { max: 300, message: "Maximum length is 300 characters" },
                ]}
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
