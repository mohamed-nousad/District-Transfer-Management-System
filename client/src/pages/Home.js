import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Button, Typography, Radio, Space } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import logo from "../assets/images/logo.png";
import bg from "../assets/images/images.jpg";

const { Content, Header } = Layout;
const { Title } = Typography;

const HomePage = () => {
  const [language, setLanguage] = useState("en"); // Default language is English

  // Language content
  const languageData = {
    en: {
      title: "District Secretariat Ampara",
      loginButton: "Get start",
      adminLoginButton: "Admin Login",
    },
    ta: {
      title: "அம்பாறை பிரதேச செயலகம்",
      loginButton: "புகுபதிகை",
      adminLoginButton: "நிர்வாக புகுபதிகை",
    },
    si: {
      title: "අපේ වේදිකාවට සාදරයෙන් පිළිගනිමු",
      loginButton: "ප්‍රවේශය",
      adminLoginButton: "පරිපාලක ප්‍රවේශය",
    },
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        textAlign: "center",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header with Language Selector */}
      <Header
        style={{
          background: "transparent", // Correct spelling
          padding: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Space>
          <GlobalOutlined style={{ color: "white", fontSize: "16px" }} />
          <Radio.Group
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="ta">தமிழ்</Radio.Button>
            <Radio.Button value="en">English</Radio.Button>
            <Radio.Button value="si">සිංහල</Radio.Button>
          </Radio.Group>
        </Space>
      </Header>

      {/* Main Content */}
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ width: "150px", marginBottom: "20px" }}
        />
        <Title style={{ color: "white" , fontStyle: "oblique"}} level={2}>
          {languageData[language].title}
        </Title>

        {/* Buttons Section */}
        <Space size="large">
          <Link to="/login">
            <Button type="primary" size="large">
              {languageData[language].loginButton}
            </Button>
          </Link>
          <Link to="/admin_login">
            <Button type="dashed" size="large">
              {languageData[language].adminLoginButton}
            </Button>
          </Link>
        </Space>
      </Content>
    </Layout>
  );
};

export default HomePage;
