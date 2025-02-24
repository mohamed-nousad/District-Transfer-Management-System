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
            label="Name denoted by Initials"
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
              <Option value="District Secretariat, Ampara">
                District Secretariat, Ampara
              </Option>
              <Option value="Divisional Secretariat, Ampara">
                Divisional Secretariat, Ampara
              </Option>
              <Option value="Divisional Secretariat, Dehiaththakandiya">
                Divisional Secretariat, Dehiaththakandiya
              </Option>
              <Option value="Divisional Secretariat, Alayadivembu">
                Divisional Secretariat, Alayadivembu
              </Option>
              <Option value="Divisional Secretariat, Uhana">
                Divisional Secretariat, Uhana
              </Option>
              <Option value="Divisional Secretariat, Mahaoya">
                Divisional Secretariat, Mahaoya
              </Option>
              <Option value="Divisional Secretariat, Padiyathalawa">
                Divisional Secretariat, Padiyathalawa
              </Option>
              <Option value="Divisional Secretariat, Damana">
                Divisional Secretariat, Damana
              </Option>
              <Option value="Divisional Secretariat, Lahugala">
                Divisional Secretariat, Lahugala
              </Option>
              <Option value="Divisional Secretariat, Irakkamam">
                Divisional Secretariat, Irakkamam
              </Option>
              <Option value="Divisional Secretariat, Sammanthurai">
                Divisional Secretariat, Sammanthurai
              </Option>
              <Option value="Divisional Secretariat, Sainthamaruthu">
                Divisional Secretariat, Sainthamaruthu
              </Option>
              <Option value="Divisional Secretariat, Ninthavur">
                Divisional Secretariat, Ninthavur
              </Option>
              <Option value="Divisional Secretariat, Addalachchenai">
                Divisional Secretariat, Addalachchenai
              </Option>
              <Option value="Divisional Secretariat, Akkaraipaththu">
                Divisional Secretariat, Akkaraipaththu
              </Option>
              <Option value="Divisional Secretariat, Thirukkovil">
                Divisional Secretariat, Thirukkovil
              </Option>
              <Option value="Divisional Secretariat, Pothuvil">
                Divisional Secretariat, Pothuvil
              </Option>
              <Option value="Divisional Secretariat, Kalmunai (Muslim)">
                Divisional Secretariat, Kalmunai (Muslim)
              </Option>
              <Option value="Divisional Secretariat, Kalmunai (Tamil)">
                Divisional Secretariat, Kalmunai (Tamil)
              </Option>
              <Option value="Divisional Secretariat, Karathivu">
                Divisional Secretariat, Karathivu
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Designation"
            name="designation"
            style={{ flex: "1 1 48%" }}
          >
            <Input />
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item
            label="Duty Assumed Date"
            name="duty_assumed_date"
            style={{ flex: "1 1 48%" }}
          >
            <DatePicker type="date" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="City" name="city" style={{ flex: "1 1 48%" }}>
            <Input />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Form.Item label="Service" name="service" style={{ flex: "1 1 48%" }}>
            <Select>
              <Option value="kalmunai">Sri Lanka Administrative Service</Option>
              <Option value="maruthamunai">
                Sri Lanka Engineering Service
              </Option>
              <Option value="sammanthurai">
                Sri Lanka Accountants' Service
              </Option>
              <Option value="sainthamaruthu">Sri Lanka Planning Service</Option>
              <Option value="akkaraipaththu">
                Sri Lanka Scientific Service
              </Option>
              <Option value="addalachchenai">
                Sri Lanka Architectural Service
              </Option>
              <Option value="lahugala">
                Sri Lanka Information & Communication Technology Service
              </Option>
              <Option value="irakkamam">Government Translators’ Service</Option>
              <Option value="ninthavur">Sri Lanka Librarians’ Service</Option>
              <Option value="pothuvil">Development Officers' Service</Option>
              <Option value="thirukkovil">
                Management Service Officers’ Service
              </Option>
              <Option value="dehiaththakandiya">
                Combined Drivers’ Service
              </Option>
              <Option value="alavidivembu">Office Employees’ Service</Option>
              <Option value="damana">Sri Lanka Technological Service</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Class" name="class" style={{ flex: "1 1 48%" }}>
            <Select>
              <Option value="Class I">Class I </Option>
              <Option value="Class II">Class II </Option>
              <Option value="Class III">Class III </Option>
            </Select>
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" block>
          Update
        </Button>
      </Form>
    </div>
  );
};

export default UserProfile;
