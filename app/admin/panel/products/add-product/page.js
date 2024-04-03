"use client";
import React from "react";
import { Form, Input, Button, InputNumber, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../../../../styles/addProduct.css";

const AddProduct = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="add-product-page">
      <Form
        name="add_product_form"
        className="add-product-form"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          label="Product Name"
          name="productName"
          rules={[
            { required: true, message: "Please input the product name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input the product description!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Please input the product price!" },
          ]}
        >
          <InputNumber min={1} max={10000} />
        </Form.Item>

        <Form.Item
          name="upload"
          label="Upload Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Select product image"
        >
          <Upload name="logo" action="/upload.do" listType="picture">
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
