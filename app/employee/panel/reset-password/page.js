"use client";
import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import "../../../styles/resetPassword.css";

function ResetPasswordPage() {
  const [form] = Form.useForm();
  const [confirmDirty, setConfirmDirty] = useState(false);

  const onFinish = (values) => {
    console.log("Received values of form:", values);
    // Logic to handle password reset
  };

  const handleConfirmBlur = (e) => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const validateToNextPassword = (_, value) => {
    if (value && confirmDirty) {
      form.validateFields(["confirm"]);
    }
    return Promise.resolve();
  };

  const compareToFirstPassword = (_, value) => {
    if (value && value !== form.getFieldValue("password")) {
      return Promise.reject(
        new Error("The two passwords that you entered do not match!")
      );
    }
    return Promise.resolve();
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      <Form
        form={form}
        name="reset_password_form"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            {
              required: true,
              message: "Please input your new password!",
            },
            {
              validator: validateToNextPassword,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            {
              validator: compareToFirstPassword,
            },
          ]}
        >
          <Input.Password onBlur={handleConfirmBlur} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ResetPasswordPage;
