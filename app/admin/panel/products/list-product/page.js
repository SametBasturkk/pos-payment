"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, notification } from "antd";
import axios from "axios";
import "../../../../styles/listProduct.css";

function ListProducts() {
  const [products, setProducts] = useState([]);

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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="danger" onClick={() => removeProduct(record.uuid)}>
          Remove
        </Button>
      ),
    },
  ];

  useEffect(() => {
    // Fetch products from the API
    axios
      .get("http://localhost:3030/product/get-all", {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        const apiProducts = response.data;

        // Transform API products to match the Ant Design Table data structure
        const transformedProducts = apiProducts.map((product) => ({
          id: product.id,
          name: product.name,
          description: "test",
          price: product.price,
          uuid: product.uuid,
          image: `http://localhost:3030/product/image/${product.imageUUID}`, // Construct the image URL
        }));

        setProducts(transformedProducts);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const removeProduct = async (productId) => {
    try {
      const formData = new FormData();
      formData.append("uuid", productId);
      await axios.post("http://localhost:3030/product/delete", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${localStorage.getItem("authToken")}`,
        },
      });

      notification.success({
        message: "Success",
        description: "Product removed successfully.",
      });

      // Update the products list by removing the deleted product
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.uuid !== productId)
      );
    } catch (error) {
      console.error("Error removing product:", error);
      notification.error({
        message: "Error",
        description: "Failed to remove product. Please try again.",
      });
    }
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
    </div>
  );
}

export default ListProducts;
