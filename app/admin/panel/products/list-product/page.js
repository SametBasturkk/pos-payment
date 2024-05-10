"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  notification,
  Modal,
  Form,
  Input,
  Upload,
  Select,
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "../../../../styles/listProduct.css";

const { Option } = Select;

function ListProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="Product"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "category",
      render: (categoryId) => categories[categoryId] || "No category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button type="danger" onClick={() => removeProduct(record.id)}>
            Remove
          </Button>
        </>
      ),
    },
  ];

  const getToken = () => {
    if (typeof window !== "undefined") {
      let token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      return token;
    }
    return null;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("http://localhost:3030/category/list", {
        headers: { Authorization: getToken() },
      });
      const categoryMap = {};
      response.data.forEach((cat) => {
        categoryMap[cat.id] = cat.name;
      });
      setCategories(categoryMap);
    };

    const fetchProducts = async () => {
      const response = await axios.get(
        "http://localhost:3030/product/get-all",
        {
          headers: { Authorization: getToken() },
        }
      );
      const transformedProducts = response.data.map((product) => ({
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        price: product.price,
        image: `http://localhost:3030/product/image/${product.imageUUID}`,
      }));
      setProducts(transformedProducts);
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    form.setFieldsValue({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
    });
    setFileList(
      product && product.image
        ? [{ uid: product.id, name: product.imageUUID, url: product.image }]
        : []
    );
  };

  const removeProduct = async (productId) => {
    const formData = new FormData();
    formData.append("id", productId);
    await axios.post("http://localhost:3030/product/delete", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: getToken(),
      },
    });
    notification.success({
      message: "Success",
      description: "Product removed successfully.",
    });
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  const handleFormSubmit = async (values) => {
    values.category = { id: values.categoryId };
    delete values.categoryId;
    values.id = editingProduct.id;

    if (fileList.length > 0 && fileList[0].originFileObj) {
      const formData = new FormData();
      formData.append("image", fileList[0].originFileObj);
      const uploadResponse = await axios.post(
        "http://localhost:3030/product/image-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getToken(),
          },
        }
      );
      values.imageUUID = uploadResponse.data;
    } else {
      values.imageUUID = editingProduct.imageUUID;
    }

    await axios.post("http://localhost:3030/product/update", values, {
      headers: { Authorization: getToken() },
    });

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editingProduct.id ? { ...product, ...values } : product
      )
    );

    notification.success({
      message: "Success",
      description: "Product updated successfully.",
    });

    setIsModalVisible(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    setFileList(e.fileList);
    return e && e.fileList;
  };

  return (
    <div className="list-products-page">
      <h2>List of Products</h2>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        className="product-table"
      />
      <Modal
        title="Edit Product"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          initialValues={editingProduct}
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select>
              {Object.entries(categories).map(([key, value]) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please input the product price!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <div style={{ marginBottom: "16px" }}>
            <label>Current Image:</label>
            {editingProduct && editingProduct.image ? (
              <Image
                src={editingProduct.image}
                alt="Product"
                style={{ width: "200px", height: "200px", marginLeft: "8px" }}
              />
            ) : (
              <p>No image available</p>
            )}
          </div>
          <Form.Item
            name="upload"
            label="Upload Image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Select product image"
          >
            <Upload
              name="image"
              listType="picture"
              beforeUpload={() => false}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ListProducts;
