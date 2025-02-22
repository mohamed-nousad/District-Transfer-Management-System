import React, { useState } from "react";
import { Form, Button, Checkbox, Spin, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Paragraph } = Typography;

const FinalSubmissionPage = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const id = user._id ?? id;

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const onFinish = async () => {
    if (!termsAccepted) {
      message.error("You must accept the terms and conditions.");
      return;
    }

    try {
      setLoading(true);

      // Update the user's `isSubmited` status to true
      const updatedData = { isSubmited: true, isRejected: false };

      // Send the update request to backend
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/user/${id}`, // User ID in the URL
        updatedData
      );

      message.success(response.data.message || "Profile updated successfully");

      // Redirect to another page (like a thank-you page) after successful submission
      navigate("/dashboard");
    } catch (error) {
      message.error(
        error.response?.data?.error || "Update failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "auto",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <Title level={2}>Final Submission</Title>

      <Form layout="vertical" onFinish={onFinish}>
        {!user.isSubmited &&
        user.isMedicalConditionSubmited &&
        user.isWorkHistorySubmited &&
        user.isDependenceSubmited &&
        user.isDisabilitySubmited &&
        user.isDiseaseSubmited ? (
          <>
            <Paragraph>
              Before submitting, please review and accept the Terms &
              Conditions.
            </Paragraph>

            <Form.Item>
              <Checkbox onChange={handleTermsChange}>
                I hereby confirm that my details are correct and according to my
                knowledge.{" "}
                <a href="/terms" className="text-blue-500">
                  Terms & Conditions
                </a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                disabled={loading || !termsAccepted}
              >
                {loading ? <Spin /> : "Submit"}
              </Button>
            </Form.Item>
          </>
        ) : null}
      </Form>
    </div>
  );
};

export default FinalSubmissionPage;
