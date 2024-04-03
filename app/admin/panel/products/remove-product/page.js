"use client";
import React, { useState } from "react";
import { Form, Button, Select } from "antd";
import "../../../../styles/removeProduct.css";

const { Option } = Select;

function RemoveProduct() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ];

  const onFinish = () => {
    if (selectedProduct) {
      console.log("Removing product:", selectedProduct);
    }
  };

  return (
    <div className="remove-product-page">
      <Form
        name="remove_product_form"
        className="remove-product-form"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <Form.Item
          label="Select Product"
          name="product"
          rules={[{ required: true, message: "Please select a product!" }]}
        >
          <Select
            placeholder="Select a product"
            onChange={(value) => setSelectedProduct(value)}
          >
            {products.map((product) => (
              <Option key={product.id} value={product.name}>
                {product.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Remove
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RemoveProduct;
