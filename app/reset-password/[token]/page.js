"use client";
import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message } from "antd";
import { useParams } from "next/navigation";
import { LockOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useParams();

  const onFinishResetPassword = async (values) => {
    setIsSubmitting(true);
    try {
      console.log("Resetting password for token:", values.token);
      console.log("New password:", values.newPassword);

      const formData = new FormData();
      formData.append("token", token);
      formData.append("password", values.newPassword);

      await axios.post("http://localhost:3030/panel/forgot-password", formData);

      message.success(
        "Password reset successful! You can now log in with your new password."
      );
    } catch (error) {
      console.error("Password reset failed:", error);
      message.error("Password reset failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "20px" }}>
      <h2>Reset Password</h2>
      <Form
        name="resetPassword"
        layout="vertical"
        onFinish={onFinishResetPassword}
        autoComplete="off"
      >
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter a new password!" },
            { min: 6, message: "Password must be at least 6 characters long!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="New password"
          />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value === getFieldValue("newPassword")) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm new password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
