import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Select,
  Button,
  message,
  Spin,
  Table,
  Checkbox,
  Modal,
  DatePicker,
  Popconfirm,
} from "antd";
import moment from "moment";
const { Option } = Select;

const UserDisease = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [diseases, setDiseases] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Fetch diseases for the user
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
      message.error(error.response?.data?.error || "Failed to fetch diseases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  // Handle form submission
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/disease`,
        { ...values, userId: user._id },
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

  // Handle disease deletion
  const deleteDisease = async (diseaseId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/user/disease/${diseaseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message || "Disease deleted successfully");
      fetchDiseases(); // Refresh the diseases list
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to delete disease");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setConfirmVisible(false);
    UpdateProgressValue();
  };

  const UpdateProgressValue = () => {
    let collection = "userdiseases";
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

  // Columns for the diseases table
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
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete this disease?"
          onConfirm={() => deleteDisease(record._id)} // Pass disease ID to delete
          okText="Yes"
          cancelText="No"
        >
          <Button className="btn bg-red-500 text-white">Delete</Button>
        </Popconfirm>
      ),
    },
  ];
  const takingTreatment = Form.useWatch("are_you_taking_treatment", form);

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

              {takingTreatment === "true" && (
                <Form.Item
                  label="Treatment Date"
                  name="treatment_date"
                  style={{ flex: "1 1 48%" }}
                  rules={[
                    { required: true, message: "Treatment date is required" },
                  ]}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                </Form.Item>
              )}
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
        rowKey="_id" // Ensure rowKey is set to the unique ID field
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UserDisease;
