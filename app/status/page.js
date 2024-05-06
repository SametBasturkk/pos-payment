"use client";
import React, { useState, useEffect } from "react";
import { Table } from "antd";
import "../styles/ordersPage.css";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:9092");

const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Shipped";
    case 2:
      return "Delivered";
    case 3:
      return "Cancelled";
    default:
      return "";
  }
};

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

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();

    return () => {
      socket.off("getOrders");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      socket.emit("getOrders", localStorage.getItem("authToken"));

      socket.on("getOrders", async (data) => {
        try {
          const response = data;

          // Fetch products for matching with order details
          const productsResponse = await axios.get(
            "http://localhost:3030/product/get-all",
            {
              headers: {
                Authorization: getToken(),
              },
            }
          );

          if (!productsResponse.data || !Array.isArray(productsResponse.data)) {
            console.error("Invalid products response:", productsResponse.data);
            return;
          }

          const products = productsResponse.data.reduce((acc, product) => {
            acc[product.id] = product;
            return acc;
          }, {});

          // Map over the response data to transform and structure it properly
          const mappedOrders = response.map((order) => {
            // Parse the order details JSON string
            const orderDetails = JSON.parse(order.orderDetails);
            // Extract product information and match with product details using UUID
            const productsInfo = orderDetails.map((detail) => ({
              id: detail.productID,
              name: products[detail.productID]
                ? products[detail.productID].name
                : "Unknown Product",
              description: products[detail.productID]
                ? products[detail.productID].description
                : "No description",
              price: products[detail.productID]
                ? products[detail.productID].price
                : 0,
              quantity: detail.quantity,
              image: products[detail.productID]
                ? `http://localhost:3030/product/image/${
                    products[detail.productID].imageUUID
                  }`
                : "",
            }));
            const productNames = productsInfo
              .map((product) => `${product.name} (${product.quantity})`)
              .join(", ");
            const status = getStatusLabel(order.status);

            return {
              orderId: order.id,
              id: order.id,
              product: productNames,
              status: status,
            };
          });

          // Filter out cancelled orders
          const nonCancelledOrders = mappedOrders.filter(
            (order) => order.status !== "Cancelled"
          );

          setOrders(nonCancelledOrders);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Product (Quantity)",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  // Separate orders into "Preparing Orders" and "Ready for Take It" based on status
  const preparingOrders = orders.filter(
    (order) => order.status === "Pending" || order.status === "Shipped"
  );
  const readyOrders = orders.filter((order) => order.status === "Delivered");

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      <div className="order-tables-container">
        {/* Preparing Orders Table */}
        <div className="orders-section">
          <h3>Preparing Orders</h3>
          <Table
            columns={columns}
            dataSource={preparingOrders}
            pagination={false}
            className="orders-table"
          />
        </div>

        {/* Ready for Take It Table */}
        <div className="orders-section">
          <h3>Ready for Take It</h3>
          <Table
            columns={columns}
            dataSource={readyOrders}
            pagination={false}
            className="orders-table"
          />
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
