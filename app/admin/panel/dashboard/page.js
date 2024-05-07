"use client";
import { useEffect, useState } from "react";
import { Card } from "antd";
import {
  ShoppingCartOutlined,
  TagOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import axios from "axios";

const Dashboard = () => {
  const [overviewData, setOverviewData] = useState(null);

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

  useEffect(() => {
    // Fetch data from the API endpoint
    axios
      .get("http://localhost:3030/admin/overview", {
        headers: {
          Authorization: getToken(),
        },
      })
      .then((response) => {
        setOverviewData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching overview data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Dashboard Overview</h1>
      {overviewData && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Card style={{ width: 300 }}>
            <h3>Total Products</h3>
            <p>{overviewData.totalProducts}</p>
            <ShoppingCartOutlined style={{ fontSize: 40 }} />
          </Card>
          <Card style={{ width: 300 }}>
            <h3>Total Categories</h3>
            <p>{overviewData.totalCategories}</p>
            <TagOutlined style={{ fontSize: 40 }} />
          </Card>
          <Card style={{ width: 300 }}>
            <h3>Total Orders</h3>
            <p>{overviewData.totalOrders}</p>
            <SolutionOutlined style={{ fontSize: 40 }} />
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
