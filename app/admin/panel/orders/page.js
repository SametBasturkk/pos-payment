'use client';
import React, { useState, useEffect } from "react";
import { Table, Select } from "antd";
import "../../../styles/ordersPage.css";
import axios from "axios";

const { Option } = Select;



function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (uuid,orderId, status) => {
    try {
      let formData = new FormData();
      formData.append("status", status);
      formData.append("uuid", uuid);
      await axios.post(
        "http://localhost:3030/order/changeStatus",
        formData,
        {
          headers: {
            Authorization: `${localStorage.getItem("authToken")}`,
          },
        }
      );
      // Update status in the UI
      const updatedOrders = orders.map((order) =>
        order.orderId === orderId ? { ...order, status: getStatusLabel(status) } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  
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
        <Select
          defaultValue={record.status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.uuid, record.orderId, value, record.uuid)}
        >
          <Option value={0}>Pending</Option>
          <Option value={1}>Shipped</Option>
          <Option value={2}>Delivered</Option>
          <Option value={3}>Cancelled</Option>
        </Select>
      ),
    },
  ];

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3030/order/get-all", {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
        },
      });

      // Fetch products for matching with order details
      const productsResponse = await axios.get("http://localhost:3030/product/get-all", {
        headers: {
          Authorization: `${localStorage.getItem("authToken")}`,
        },
      });
      const products = productsResponse.data.reduce((acc, product) => {
        acc[product.uuid] = product;
        return acc;
      }, {});

      // Map over the response data to transform and structure it properly
const mappedOrders = response.data.map((order) => {
  // Parse the order details JSON string
  const orderDetails = JSON.parse(order.orderDetails);
  // Extract product information and match with product details using UUID
  const productsInfo = orderDetails.map((detail) => ({
    id: detail.productID,
    name: products[detail.productID].name,
    description: products[detail.productID].description,
    price: products[detail.productID].price,
    quantity: detail.quantity, // Include quantity here
    image: `http://localhost:3030/product/image/${products[detail.productID].imageUUID}`,
  }));
  const productNames = productsInfo.map((product) => `${product.name} (${product.quantity})`).join(", ");
  const status =
    order.status === 0
      ? "Pending"
      : order.status === 1
      ? "Shipped"
      : order.status === 2
      ? "Delivered"
      : "Cancelled";

  return {
    orderId: order.id,
    uuid: order.uuid,
    product: productNames,
    status: status,
  };
});

setOrders(mappedOrders);

    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusFilterChange = (value) => {
    setFilterStatus(value);
  };




  const filteredData =
    filterStatus !== "All" ? orders.filter((item) => item.status === filterStatus) : orders;

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      <div className="filter-container">
        <span>Filter by Status:</span>
        <Select
          value={filterStatus}
          style={{ width: 150 }}
          onChange={handleStatusFilterChange}
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
        dataSource={filteredData}
        pagination={false}
        className="orders-table"
      />
    </div>
  );
}

export default OrdersPage;
