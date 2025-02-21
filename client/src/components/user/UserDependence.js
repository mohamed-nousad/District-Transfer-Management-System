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

const Dependence = ({ user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dependences, setDependences] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Removed the unused variable `currentProgressValue`

  const fetchDependences = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user/dependence/user/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDependences(response.data || []);
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to fetch dependences");
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchDependences();
  }, [fetchDependences]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/dependence`,
        { ...values, userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success(response.data.message || "Dependence added successfully");
      form.resetFields();
      fetchDependences();
    } catch (error) {
      message.error(
        error.response?.data?.errors[0]?.msg ||
          error.response?.data?.error ||
          "Failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setConfirmVisible(false);
    onFinish({}); // Submit empty values as "no dependents"
  };

  const columns = [
    {
      title: "Dependent Name",
      dataIndex: "dependentName",
      key: "dependentName",
    },
    {
      title: "Dependent Relationship",
      dataIndex: "dependentRelationship",
      key: "dependentRelationship",
    },
    {
      title: "Dependent NIC",
      dataIndex: "dependentNIC",
      key: "dependentNIC",
      render: (text) => text || "N/A",
    },
    {
      title: "Workplace",
      dataIndex: "workplace",
      key: "workplace",
      render: (text) => text || "N/A",
    },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Dependent DOB",
      dataIndex: "dependent_DOB",
      key: "dependent_DOB",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "School",
      dataIndex: "school",
      key: "school",
      render: (text) => text || "N/A",
    },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Postalcode", dataIndex: "postalcode", key: "postalcode" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {!checkboxChecked && (
            <>
              <Form.Item
                label="Dependent Name"
                name="dependentName"
                style={{ flex: "1 1 48%" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Dependent Relationship"
                name="dependentRelationship"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select>
                  <Option value="Husband">Husband</Option>
                  <Option value="Wife">Wife</Option>
                  <Option value="Son">Son</Option>
                  <Option value="Daughter">Daughter</Option>
                  <Option value="Father">Father</Option>
                  <Option value="Mother">Mother</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Dependent NIC"
                name="dependentNIC"
                style={{ flex: "1 1 48%" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Workplace (optional)"
                name="workplace"
                style={{ flex: "1 1 48%" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Gender"
                name="gender"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Select>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Dependent DOB"
                name="dependent_DOB"
                style={{ flex: "1 1 48%" }}
                rules={[{ required: true, message: "This field is required" }]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="School (optional)"
                name="school"
                style={{ flex: "1 1 48%" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="School / Workplace City (optional)"
                name="city"
                style={{ flex: "1 1 48%" }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="School / Workplace Postalcode (optional)"
                name="postalcode"
                style={{ flex: "1 1 48%" }}
              >
                <Input />
              </Form.Item>
            </>
          )}
        </div>

        {/* "No Dependents" Checkbox */}
        <Form.Item>
          <Checkbox
            onChange={(e) => setCheckboxChecked(e.target.checked)}
          >
            I don't have any dependents
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
      </Form>

      {/* Modal for confirming "no dependents" */}
      <Modal
        title="Confirm Submission"
        open={confirmVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
      >
        <p>Are you sure you want to submit with no dependents?</p>
      </Modal>

      <h2 style={{ marginTop: 30 }}>Dependents</h2>
      <Table
        dataSource={dependences}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Dependence;