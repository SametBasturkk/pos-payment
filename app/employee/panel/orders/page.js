"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Select } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import io from "socket.io-client";
import "../../../styles/ordersPage.css";

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
  return (
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchOrders = () => {
    const token = getToken();
    if (token) {
      socket.emit("getOrders", token);
    }
  };

  useEffect(() => {
    // Initial fetch of orders
    fetchOrders();

    // Fetch orders every 5 seconds
    const intervalId = setInterval(fetchOrders, 5000);

    // Listen for socket events and handle received data
    socket.on("getOrders", (data) => {
      try {
        const mappedOrders = data.map((order) => {
          const orderDetails = JSON.parse(order.orderDetails);
          const productNames = orderDetails
            .map(
              (detail) => `${detail.productName} (Quantity: ${detail.quantity})`
            )
            .join(", ");

          return {
            orderId: order.id,
            product: productNames,
            status: getStatusLabel(order.status),
            createdAt: new Date(order.createdAt),
          };
        });

        // Sort orders by date in descending order
        mappedOrders.sort((a, b) => b.createdAt - a.createdAt);
        setOrders(mappedOrders);
      } catch (error) {
        console.error("Error processing socket data:", error);
      }
    });

    // Clean up the interval and socket listener when the component unmounts
    return () => {
      clearInterval(intervalId);
      socket.off("getOrders");
    };
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("id", orderId);
      formData.append("status", newStatus);

      await fetch("http://localhost:3030/order/changeStatus", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      // Update orders state with the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, status: getStatusLabel(newStatus) }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
  };

  // Filtered orders based on selected status
  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  // Create buttons for each status
  const renderStatusButtons = (orderId) => {
    const buttons = [
      {
        icon: <ClockCircleOutlined />,
        label: "Pending",
        color: "#1890ff", // Blue
        status: 0,
      },
      {
        icon: <TruckOutlined />,
        label: "Shipped",
        color: "#faad14", // Orange
        status: 1,
      },
      {
        icon: <CheckOutlined />,
        label: "Delivered",
        color: "#52c41a", // Green
        status: 2,
      },
      {
        icon: <CloseOutlined />,
        label: "Cancelled",
        color: "#ff4d4f", // Red
        status: 3,
      },
    ];

    return buttons.map((button) => (
      <Button
        key={button.status}
        type="primary"
        icon={button.icon}
        style={{
          backgroundColor: button.color,
          borderColor: button.color,
          marginRight: "8px",
        }}
        onClick={() => handleStatusChange(orderId, button.status)}
      >
        {button.label}
      </Button>
    ));
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
    {
      title: "Change Status",
      key: "changeStatus",
      render: (text, record) => (
        <div style={{ display: "flex" }}>
          {renderStatusButtons(record.orderId)}
        </div>
      ),
    },
  ];

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      <div className="filter-container">
        <span>Filter by Status:</span>
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          style={{ marginLeft: 8, width: 150 }}
        >
          <Option value="All">All</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Shipped">Shipped</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={filteredOrders}
        pagination={false}
        className="orders-table"
      />
    </div>
  );
};

export default OrdersPage;
