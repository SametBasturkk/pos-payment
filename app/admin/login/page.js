"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Checkbox, Form, Input, message, Select, Tabs } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Option } = Select;

const checkAuthAndRedirect = () => {
  const authToken =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (authToken) {
    window.location.href = "http://localhost:3000/admin/panel/dashboard";
  }
};

const onFinishLogin = async (values, rememberMe) => {
  try {
    const response = await axios.post("http://localhost:3030/admin/login", {
      username: values.username,
      password: values.password,
    });
    console.log("Login successful:", response.data);
    message.success("Login successful!");

    if (rememberMe) {
      sessionStorage.setItem("authToken", response.data);
    } else {
      localStorage.setItem("authToken", response.data);
    }

    window.location.href = "http://localhost:3000/admin/panel/dashboard";
  } catch (error) {
    console.error("Login failed:", error.response?.data || "Network error");
    message.error(
      `Login failed: ${error.response?.data || "Check your network connection"}`
    );
  }
};

const onFinishRegister = async (values) => {
  try {
    const response = await axios.post("http://localhost:3030/admin/register", {
      name: values.name,
      surname: values.surname,
      tckn: values.tckn,
      username: values.username,
      password: values.password,
      email: values.email,
      company: {
        id: values.companyId,
      },
      phone: values.phone,
    });
    console.log("Registration successful:", response.data);
    message.success("Registration successful!");
    window.location.href = "/admin/login";
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || "Network error"
    );
    message.error(
      `Registration failed: ${
        error.response?.data || "Check your network connection"
      }`
    );
  }
};

const onFinishResetPassword = async (values) => {
  try {
    let formData = new FormData();
    formData.append("email", values.email);
    axios.post("http://localhost:3030/admin/forgot-password-mail", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Password reset request sent for email:", values.email);
    message.success(
      "Password reset request sent successfully! Please check your email."
    );
  } catch (error) {
    console.error("Password reset request failed:", error);
    message.error("Password reset request failed. Please try again.");
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    checkAuthAndRedirect();

    // Fetch the company list from the API
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:3030/company/list");
        setCompanies(response.data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        message.error("Failed to fetch companies. Please try again.");
      }
    };

    fetchCompanies();
  }, []);

  const onTabChange = (key) => {
    setActiveTab(key);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <Tabs defaultActiveKey="login" onChange={onTabChange} centered>
      <TabPane tab="Login" key="login">
        <Form
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={(values) => onFinishLogin(values, rememberMe)}
          autoComplete="off"
          style={{ maxWidth: 300, margin: "auto" }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox onChange={handleRememberMeChange}>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Log In
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab="Register" key="register">
        <Form
          name="register"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinishRegister}
          autoComplete="off"
          style={{ maxWidth: 300, margin: "auto" }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Surname"
            name="surname"
            rules={[{ required: true, message: "Please input your surname!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Surname" />
          </Form.Item>
          <Form.Item
            label="TCKN"
            name="tckn"
            rules={[{ required: true, message: "Please input your TCKN!" }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="TCKN" />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            label="Company"
            name="companyId"
            rules={[{ required: true, message: "Please select a company!" }]}
          >
            <Select placeholder="Select a company">
              {companies.map((company) => (
                <Option key={company.id} value={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
      <TabPane tab="Reset Password" key="reset">
        <Form
          name="resetPassword"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinishResetPassword}
          autoComplete="off"
          style={{ maxWidth: 300, margin: "auto" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </TabPane>
    </Tabs>
  );
};

export default App;
