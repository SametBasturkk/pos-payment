"use client";
import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  PieChartOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import "./sidebar.css";

export default function Sidebar() {
  // State to store user data
  const [user, setUser] = useState({ name: "Loading...", role: "Loading..." });

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
    const fetchUserData = async () => {
      try {
        const authToken =
          sessionStorage.getItem("authToken") ||
          localStorage.getItem("authToken");

        if (authToken) {
          const { data } = await axios.get(
            "http://localhost:3030/panel/user-details",
            {
              headers: {
                Authorization: getToken(),
              },
            }
          );

          setUser({ name: data.name, role: data.role });
        } else {
          console.error("Authentication token not found.");
          handleLogout();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);

        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      }
    };

    fetchUserData();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    window.location.href = "/employee/login";
  };

  return (
    <Layout className="site-layout-background sidebar" style={{ width: 200 }}>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <div className="profileInformation">
          <div className="logo">
            <img
              src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f8/f888150565fe1d82dd5f3b212bd726459859b519_full.jpg"
              alt="Avatar"
              className="avatar"
            />
          </div>
          <div className="profile">
            <div className="profileName">
              <p className="name">{user.name}</p>
            </div>
            <p className="title">{user.role}</p>
          </div>
        </div>

        <Menu.Item key="1" icon={<PieChartOutlined />}>
          <Link href="/employee/panel/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<ShoppingCartOutlined />}>
          <Link href="/employee/panel/orders">Orders</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<SettingOutlined />}>
          <Link href="/employee/panel/reset-password">Profile Options</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
    </Layout>
  );
}
