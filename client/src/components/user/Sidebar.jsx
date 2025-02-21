import React, { useState } from "react";
import { Modal, Menu, Drawer, Button, Form, Input } from "antd";
import {
  LockOutlined,
  UserOutlined,
  SettingOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

const Sidebar = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleChangePassword = (values) => {
    console.log("New Password:", values);
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Toggle Button for Mobile View */}
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={showDrawer}
        style={{
          position: "fixed",
          top: 12,
          left: 20,
          zIndex: 1000,
          borderRadius: "50%",
          width: 50,
          height: 50,
          backgroundColor: "#1890ff",
        }}
      />

      {/* Sidebar Menu */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        visible={visible}
      >
        {/* Sidebar Menu */}
        <Menu mode="vertical" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>

          <SubMenu key="2" icon={<SettingOutlined />} title="Settings">
            <Menu.Item key="2-1">
              <Link to="/settings">General Settings</Link>
            </Menu.Item>
            <Menu.Item key="2-2" icon={<LockOutlined />} onClick={showModal}>
              Change Password
            </Menu.Item>
          </SubMenu>
        </Menu>
        {/* Change Password Modal */}
        <Modal
          title="Change Password"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={window.innerWidth < 768 ? "90%" : 500} // Responsive width
        >
          <Form layout="vertical" onFinish={handleChangePassword}>
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password!",
                },
              ]}
            >
              <Input.Password placeholder="Enter current password" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter a new password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    return value && value === getFieldValue("newPassword")
                      ? Promise.resolve()
                      : Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Drawer>
    </>
  );
};

export default Sidebar;
