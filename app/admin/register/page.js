"use client";
import React from "react";
import axios from "axios";
import { Button, Checkbox, Form, Input, message } from "antd";

const onFinish = async (values) => {
  try {
    // Assuming the API expects a user object
    const response = await axios.post("http://localhost:3030/admin/register", {
      name: values.name,
      surname: values.surname,
      tckn: values.tckn,
      username: values.username,
      password: values.password,
      email: values.email,
      companyId: values.companyId,
      phone: values.phone,
    });

    console.log("Registration successful:", response.data);
    message.success("Registration successful!");
    window.location.href = "login"; // Redirect to login page or wherever appropriate
  } catch (error) {
    console.error("Registration failed:", error.response.data);
    message.error("Registration failed: " + error.response.data);
  }
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
  message.error("Submission failed!");
};

const App = () => (
  <Form
    name="register"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ role: "user", isActive: false, isDeleted: false }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Name"
      name="name"
      rules={[{ required: true, message: "Please input your name!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Surname"
      name="surname"
      rules={[{ required: true, message: "Please input your surname!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="TCKN"
      name="tckn"
      rules={[{ required: true, message: "Please input your TCKN!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: "Please input your username!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: "Please input your password!" }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: "Please input your email!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Phone"
      name="phone"
      rules={[{ required: true, message: "Please input your phone number!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Company ID"
      name="companyId"
      rules={[{ required: true, message: "Please input company id!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Register
      </Button>
    </Form.Item>
  </Form>
);

export default App;
