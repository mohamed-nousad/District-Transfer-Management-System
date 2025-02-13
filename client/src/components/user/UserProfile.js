import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Select, DatePicker, message, Spin } from "antd";
import moment from "moment";

const { Option } = Select;

const UserProfile = ({ userData }) => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user/user/${userData.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(response.data);
        form.setFieldsValue({
          ...response.data,
          dateOfBirth: response.data.dateOfBirth
            ? moment(response.data.dateOfBirth)
            : null,
          first_appointment_date: response.data.first_appointment_date
            ? moment(response.data.first_appointment_date)
            : null,
          duty_assumed_date: response.data.duty_assumed_date
            ? moment(response.data.duty_assumed_date)
            : null,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [form, userData.id]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/user/${user._id}`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message);
    } catch (error) {
      if (error.response?.data.errors) {
        error.response.data.errors.forEach((err) => message.error(err.msg));
      } else {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin
          size="large"
          tip="Loading..."
          style={{ fontSize: "24px", transform: "scale(2)" }} // Enlarges the spinner
        />
      </div>
    );

  if (error)
    return <h2 style={{ color: "red", textAlign: "center" }}>{error}</h2>;
  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Name with Initial"
            name="nameWithInitial"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="First Name"
            name="firstName"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>
          <Form.Item label="NIC" name="NIC" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item label="Gender" name="gender" style={{ flex: "1 1 48%" }}>
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            style={{ flex: "1 1 48%" }}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item label="Address" name="address" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" style={{ flex: "1 1 48%" }}>
            <Input type="email" />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Contact Number"
            name="contactNumber"
            style={{ flex: "1 1 48%" }}
          >
            <Input type="tel" />
          </Form.Item>
          <Form.Item
            label="First Appointment Date"
            name="first_appointment_date"
            style={{ flex: "1 1 48%" }}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Workplace"
            name="workplace"
            style={{ flex: "1 1 48%" }}
          >
            <Select>
              <Option value="kalmunai">kalmunai</Option>
              <Option value="marthamunai">marthamunai</Option>
            </Select>
          </Form.Item>
          <Form.Item label="City" name="city" style={{ flex: "1 1 48%" }}>
            <Select>
              <Option value="kalmunai">kalmunai</Option>
              <Option value="maruthamunai">maruthamunai</Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Duty Assumed Date"
            name="duty_assumed_date"
            style={{ flex: "1 1 48%" }}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Postal Code"
            name="postal_code"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Designation"
            name="designation"
            style={{ flex: "1 1 48%" }}
          >
            <Select>
              <Option value="officer">Officer</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Current Workplace"
            name="current_workplace"
            style={{ flex: "1 1 48%" }}
          >
            <Select>
              <Option value="kalmunai">Kalmunai</Option>
              <Option value="maruthamunai">Maruthamunai</Option>
            </Select>
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item label="Service" name="service" style={{ flex: "1 1 48%" }}>
            <Select>
              <Option value="1st service">1st service</Option>
              <Option value="2nd service">2nd service</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Class" name="class" style={{ flex: "1 1 48%" }}>
            <Select>
              <Option value="1st class">1st Class</Option>
              <Option value="2nd class">2nd Class</Option>
            </Select>
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" block>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default UserProfile;
