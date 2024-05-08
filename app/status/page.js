"use client";
import React, { useState, useEffect } from "react";
import { Table } from "antd";
import io from "socket.io-client";
import "../styles/ordersPage.css";

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
    let token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    return token;
  }
  return null;
};

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      const authToken = getToken();
      if (!authToken) {
        console.error("Authorization token is not available.");
        return;
      }

      socket.emit("getOrders", authToken);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    socket.on("getOrders", (data) => {
      processOrders(data);
    });

    return () => {
      clearInterval(interval);
      socket.off("getOrders");
    };
  }, []);

  const processOrders = (data) => {
    const mappedOrders = data.map((order) => {
      const orderDetails = JSON.parse(order.orderDetails);

      // Process order details and create a product description
      const productDescription = orderDetails
        .map((detail) => `${detail.productName} (Quantity: ${detail.quantity})`)
        .join(", ");

      return {
        orderId: order.id,
        product: productDescription,
        status: getStatusLabel(order.status),
      };
    });

    // Filter out orders with status "Cancelled"
    setOrders(mappedOrders.filter((order) => order.status !== "Cancelled"));
  };

  const columns = [
    { title: "Order ID", dataIndex: "orderId", key: "orderId" },
    { title: "Product (Quantity)", dataIndex: "product", key: "product" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const preparingOrders = orders.filter(
    (order) => order.status === "Pending" || order.status === "Shipped"
  );
  const readyOrders = orders.filter((order) => order.status === "Delivered");

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      <div className="order-tables-container">
        <div className="orders-section">
          <h3>Preparing Orders</h3>
          <Table
            columns={columns}
            dataSource={preparingOrders}
            pagination={false}
            className="orders-table"
          />
        </div>
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
