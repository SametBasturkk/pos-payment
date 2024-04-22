"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, Checkbox, message } from "antd";
import axios from "axios";

function App() {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const token = localStorage.getItem("authToken");

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get("http://localhost:3030/category/list", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setCategories(JSON.parse(response.data));
      })
      .catch((error) => {
        message.error("Failed to fetch categories");
      });
  };

  // Handle form submission to create a new category
  const handleFormSubmit = (values) => {
    axios
      .post("http://localhost:3030/category/create", values, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {
        message.success("Category created successfully");
        form.resetFields(); // Reset form after successful creation
        fetchCategories(); // Refresh the list of categories
      })
      .catch((error) => {
        message.error("Failed to create category");
      });
  };

  // Handle category deletion
  const handleDelete = (id) => {
    axios
      .delete(`/category/delete?id=${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {
        setCategories(categories.filter((category) => category.id !== id));
        message.success("Category deleted successfully");
      })
      .catch((error) => {
        message.error("Failed to delete category");
      });
  };

  // Define table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="danger" onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Category Management</h1>

      {/* Form for creating a new category */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        style={{ marginBottom: "20px" }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the category name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Create Category
        </Button>
      </Form>

      {/* Table for displaying the list of categories */}
      <Table dataSource={categories} columns={columns} rowKey="id" />
    </div>
  );
}

export default App;
