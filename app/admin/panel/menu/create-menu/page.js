"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Form, Input, Select, notification } from "antd";
import axios from "axios";

const { Option } = Select;

const MenuList = () => {
  // State variables
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch token from local storage when needed
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  };

  // Fetch categories and menus when the component mounts
  useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, []);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const token = getToken();
      const response = await axios.get("http://localhost:3030/category/list", {
        headers: {
          Authorization: token,
        },
      });
      setCategories(response.data);
    } catch (error) {
      notification.error({ message: "Failed to fetch categories" });
    }
  };

  // Fetch menus from the backend
  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await axios.get("http://localhost:3030/menu/get-all", {
        headers: {
          Authorization: token,
        },
      });
      // Transform the data to match the Ant Design Table data structure
      const transformedMenus = response.data.map((menu) => ({
        id: menu.id,
        name: menu.name,
        // Extracting categories from the response
        categoryList: menu.categories
          .map((category) => category.name)
          .join(", "),
      }));
      setMenus(transformedMenus);
    } catch (error) {
      notification.error({ message: "Failed to fetch menus" });
    } finally {
      setIsLoading(false);
    }
  };

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Menu Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category List",
      dataIndex: "categoryList",
      key: "categoryList",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="danger" onClick={() => removeMenu(record.id)}>
          Remove
        </Button>
      ),
    },
  ];

  // Function to create a new menu
  const createMenu = async (values) => {
    try {
      setIsLoading(true);
      const token = getToken();

      const requestData = {
        name: values.name,
        categories: values.categoryList.map((categoryId) => ({
          id: categoryId,
        })),
      };

      const response = await axios.post(
        "http://localhost:3030/menu/create",
        requestData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      notification.success({ message: "Menu created successfully" });
      fetchMenus(); // Refresh menus list after creating a new menu
    } catch (error) {
      notification.error({ message: "Error creating menu" });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to remove a menu
  const removeMenu = async (menuId) => {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("id", menuId);
      const response = await axios.post(
        `http://localhost:3030/menu/delete`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.status === 200) {
        notification.success({ message: "Menu removed successfully" });
        fetchMenus(); // Refresh menus list after deleting a menu
      } else {
        notification.error({ message: "Error removing menu" });
      }
    } catch (error) {
      notification.error({ message: "Error removing menu" });
    }
  };

  return (
    <div>
      <h2>Menu Management</h2>
      {/* Form for creating a new menu */}
      <Form layout="vertical" onFinish={createMenu}>
        <Form.Item
          name="name"
          label="Menu Name"
          rules={[{ required: true, message: "Please input the menu name!" }]}
        >
          <Input placeholder="Enter menu name" />
        </Form.Item>
        <Form.Item
          name="categoryList"
          label="Category List"
          rules={[
            { required: true, message: "Please select at least one category!" },
          ]}
        >
          <Select mode="multiple" placeholder="Select categories">
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create Menu
          </Button>
        </Form.Item>
      </Form>

      {/* Render the list of menus using the Ant Design Table */}
      <Table
        dataSource={menus}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />
    </div>
  );
};

export default MenuList;
