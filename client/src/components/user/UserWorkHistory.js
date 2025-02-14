import React, { useState } from "react";
import axios from "axios";
import { Form, Select, DatePicker, Button, message, Spin } from "antd";

const { Option } = Select;

const UserWorkHistory = ({ userData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/workhistory`,
        { ...values, userId: userData.id }, // Include userId
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(
        response.data.message || "Workhistory added successfully"
      );
      form.resetFields();
    } catch (error) {
      message.error(
        error.response?.data?.errors[0]?.msg || "Failed. Try again"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 30 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <Form.Item
            label="Workplace"
            name="workplace"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
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
            label="Workplace Type"
            name="workplace_type"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Workplace City"
            name="workplace_city"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Workplace Postal Code"
            name="workplace_postalcode"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="32000">
                32000 - District Secretariat, Ampara
              </Option>
              <Option value="32000">
                32000 - Divisional Secretariat, Ampara
              </Option>
              <Option value="32010">
                32010 - Divisional Secretariat, Dehiaththakandiya
              </Option>
              <Option value="32020">
                32020 - Divisional Secretariat, Alayadivembu
              </Option>
              <Option value="32030">
                32030 - Divisional Secretariat, Uhana
              </Option>
              <Option value="32040">
                32040 - Divisional Secretariat, Mahaoya
              </Option>
              <Option value="32050">
                32050 - Divisional Secretariat, Padiyathalawa
              </Option>
              <Option value="32060">
                32060 - Divisional Secretariat, Damana
              </Option>
              <Option value="32070">
                32070 - Divisional Secretariat, Lahugala
              </Option>
              <Option value="32080">
                32080 - Divisional Secretariat, Irakkamam
              </Option>
              <Option value="32090">
                32090 - Divisional Secretariat, Sammanthurai
              </Option>
              <Option value="32100">
                32100 - Divisional Secretariat, Sainthamaruthu
              </Option>
              <Option value="32110">
                32110 - Divisional Secretariat, Ninthavur
              </Option>
              <Option value="32120">
                32120 - Divisional Secretariat, Addalachchenai
              </Option>
              <Option value="32130">
                32130 - Divisional Secretariat, Akkaraipaththu
              </Option>
              <Option value="32140">
                32140 - Divisional Secretariat, Thirukkovil
              </Option>
              <Option value="32150">
                32150 - Divisional Secretariat, Pothuvil
              </Option>
              <Option value="32160">
                32160 - Divisional Secretariat, Kalmunai (Muslim)
              </Option>
              <Option value="32170">
                32170 - Divisional Secretariat, Kalmunai (Tamil)
              </Option>
              <Option value="32180">
                32180 - Divisional Secretariat, Karathivu
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Designation"
            name="designation"
            style={{ flex: "1 1 48%" }}
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="mental">Mental</Option>
              <Option value="visual">Visual</Option>
              <Option value="psychological">Psychological</Option>
            </Select>
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
        </div>

        <Button type="primary" htmlType="submit" block disabled={loading}>
          {loading ? <Spin /> : "Save"}
        </Button>
      </Form>
    </div>
  );
};

export default UserWorkHistory;
