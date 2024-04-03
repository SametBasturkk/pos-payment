"use client";
import React from "react";
import { Table } from "antd";
import "../../../styles/listProduct.css";

function ListProducts() {
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
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => `$${text}`,
    },
  ];

  const products = [
    {
      id: 1,
      name: "Product 1",
      description: "Description 1",
      price: 10,
      image: "path_to_image1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      description: "Description 2",
      price: 20,
      image: "path_to_image2.jpg",
    },
    {
      id: 3,
      name: "Product 3",
      description: "Description 3",
      price: 30,
      image: "path_to_image3.jpg",
    },
  ];

  return (
    <div className="list-products-page">
      <h2>List of Products</h2>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        className="product-table"
      />
    </div>
  );
}

export default ListProducts;
