"use client";
import React, { useState } from "react";
import { Table, Select } from "antd";
import "../../../styles/ordersPage.css";

const { Option } = Select;

const columns = [
  {
    title: "Order ID",
    dataIndex: "orderId",
    key: "orderId",
  },
  {
    title: "Product",
    dataIndex: "product",
    key: "product",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

const data = [
  {
    key: "1",
    orderId: "001",
    product: "Product A",
    quantity: 2,
    status: "Pending",
  },
  {
    key: "2",
    orderId: "002",
    product: "Product B",
    quantity: 1,
    status: "Shipped",
  },
  {
    key: "3",
    orderId: "003",
    product: "Product C",
    quantity: 3,
    status: "Delivered",
  },
];

function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState("All");

  const handleStatusFilterChange = (value) => {
    setFilterStatus(value);
  };

  const filteredData =
    filterStatus !== "All"
      ? data.filter((item) => item.status === filterStatus)
      : data;

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
