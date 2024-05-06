"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  Upload,
  Select,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "../../../../styles/addProduct.css";

const { Option } = Select;

const getToken = () => {
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("authToken");
    if (!token) {
      token = sessionStorage.getItem("authToken");
    }
    return token;
  }
  return null;
};

const AddProduct = () => {
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Function to fetch categories from the server
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/category/list",
          {
            headers: {
              Authorization: getToken(),
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        message.error("Failed to fetch categories: " + error.message);
      }
    };

    // Call the function to fetch categories when the component mounts
    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    try {
      // Initialize an empty object for the product data
      let productData = {
        name: values.name,
        price: values.price,
        category: {
          id: values.category,
        },
      };

      console.log(values);

      // If there is an image to upload, handle the image upload separately
      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append("image", fileList[0].originFileObj);

        // Send the image to the server and get the image UUID or URL
        const uploadResponse = await axios.post(
          "http://localhost:3030/product/image-upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Assuming the server returns the image UUID
        const imageUUID = uploadResponse.data;
        productData.imageUUID = imageUUID;
      }

      // Send the product data to the server as JSON in the request body
      await axios.post("http://localhost:3030/product/create", productData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: getToken(),
        },
      });
      message.success("Product added successfully!");
    } catch (error) {
      message.error("Failed to add product: " + error.message);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    setFileList(e.fileList);
    return e && e.fileList;
  };

  return (
    <div className="add-product-page">
      <Form
        name="add_product_form"
        className="add-product-form"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ isActive: false, isDeleted: false }}
        autoComplete="off"
      >
        <Form.Item
          label="Product Name"
          name="name"
          rules={[
            { required: true, message: "Please input the product name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Please input the product price!" },
          ]}
        >
          <InputNumber min={0.01} max={10000} step={0.01} precision={2} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select placeholder="Select a category">
            {/* Populate the select options with the fetched categories */}
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="upload"
          label="Upload Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Select product image"
        >
          <Upload name="logo" listType="picture" beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
