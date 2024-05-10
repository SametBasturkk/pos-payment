"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Select,
  Modal,
  notification,
  List,
  Card,
  Image,
} from "antd";
import axios from "axios";
import "../../../../styles/menuManagement.css";

const { Option } = Select;

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState([]);

  // Function to retrieve the authentication token
  const getToken = () => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
      );
    }
    return null;
  };

  // Fetch categories and menus when the component mounts
  useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, []);

  // Function to fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const token = getToken();
      const response = await axios.get("http://localhost:3030/category/list", {
        headers: { Authorization: token },
      });
      setCategories(response.data);
    } catch (error) {
      notification.error({ message: "Failed to fetch categories" });
    }
  };

  // Function to fetch menus from the backend
  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("http://localhost:3030/menu/get-all", {
        headers: { Authorization: token },
      });
      const transformedMenus = response.data.map((menu) => ({
        id: menu.id,
        name: menu.menuName,
        categoryList: menu.categories
          .map((category) => category.name)
          .join(", "),
        categoryIds: menu.categories.map((category) => category.id),
      }));
      setMenus(transformedMenus);
    } catch (error) {
      notification.error({ message: "Failed to fetch menus" });
    } finally {
      setIsLoading(false);
    }
  };

  // Columns configuration for the Table component
  const columns = [
    { title: "Menu Name", dataIndex: "name", key: "name" },
    { title: "Category List", dataIndex: "categoryList", key: "categoryList" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showDetails(record)}>Details</Button>
          <Button
            type="primary"
            danger
            onClick={() => removeMenu(record.id)}
            style={{
              background: "#ff4d4f",
              borderColor: "transparent",
              marginLeft: 8,
            }}
          >
            Remove
          </Button>
        </>
      ),
    },
  ];

  // Function to create a new menu
  const createMenu = async (values) => {
    setIsLoading(true);
    try {
      const token = getToken();
      const requestData = {
        name: values.name,
        categories: values.categoryList.map((categoryId) => ({
          id: categoryId,
        })),
      };
      await axios.post("http://localhost:3030/menu/create", requestData, {
        headers: { Authorization: token },
      });
      notification.success({ message: "Menu created successfully" });
      fetchMenus();
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
      await axios.post(
        "http://localhost:3030/menu/delete",
        { id: menuId },
        {
          headers: { Authorization: token },
        }
      );
      notification.success({ message: "Menu removed successfully" });
      fetchMenus();
    } catch (error) {
      notification.error({ message: "Error removing menu" });
    }
  };

  // Function to show menu details and fetch products by category
  const showDetails = async (menu) => {
    setSelectedMenu(menu);
    setIsModalVisible(true);

    // Fetch products by category when showing details
    try {
      const token = getToken();
      const categoryIds = menu.categoryIds;

      // Fetch products for each category and combine them
      const productResponses = await Promise.all(
        categoryIds.map((categoryId) => {
          return axios.post(
            "http://localhost:3030/product/get-by-category",
            { id: categoryId },
            {
              headers: { Authorization: token },
            }
          );
        })
      );

      // Combine all product lists from different category responses
      const combinedProducts = productResponses.flatMap(
        (response) => response.data
      );
      setProductsByCategory(combinedProducts);
    } catch (error) {
      notification.error({ message: "Error fetching products by category" });
      setProductsByCategory([]); // Reset in case of error
    }
  };

  // Function to handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
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

      {/* Table for displaying the list of menus */}
      <Table
        dataSource={menus}
        columns={columns}
        rowKey="id"
        loading={isLoading}
      />

      {/* Modal for displaying menu and product details */}
      <Modal
        title="Menu Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedMenu && (
          <div>
            <p>
              <strong>Name:</strong> {selectedMenu.name}
            </p>
            <p>
              <strong>Categories:</strong> {selectedMenu.categoryList}
            </p>

            {/* Display the list of products for the selected menu */}
            <h4>Products:</h4>
            {productsByCategory.length > 0 ? (
              <List
                grid={{ gutter: 16, column: 2 }} // Configure grid with 2 columns
                dataSource={productsByCategory}
                renderItem={(product) => (
                  <List.Item>
                    <Card title={product.name}>
                      {/* Display product image if available */}
                      {product.imageUUID && (
                        <Image
                          src={`http://localhost:3030/product/image/${product.imageUUID}`}
                          alt={product.name}
                          style={{ marginBottom: 8 }}
                        />
                      )}
                      <p>{product.description}</p>
                      <p>
                        <strong>Price:</strong> ${product.price.toFixed(2)}
                      </p>
                    </Card>
                  </List.Item>
                )}
              />
            ) : (
              <p>No products found for these categories.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MenuList;
