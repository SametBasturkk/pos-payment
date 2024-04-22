"use client";
import React from "react";
import axios from "axios";
import { Button, Checkbox, Form, Input, message } from "antd";

const onFinish = async (values) => {
  try {
    const response = await axios.post("http://localhost:3030/admin/login", {
      username: values.username,
      password: values.password,
    });

    console.log("Login successful:", response.data);
    message.success("Login successful!");
    localStorage.setItem("authToken", response.data);
    window.location.href = "/admin/panel";
  } catch (error) {
    console.log("Login failed:", error.response.data);
    message.error("Login failed: " + error.response.data);
  }
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
  message.error("Submission failed!");
};

const App = () => (
  <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[
        {
          required: true,
          message: "Please input your username!",
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: "Please input your password!",
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default App;
