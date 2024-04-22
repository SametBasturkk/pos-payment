"use client";
import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";

import "./sidebar.css";

export default function Sidebar() {
  // State to store user data
  const [user, setUser] = useState({ name: "Loading...", role: "Loading..." });

  useEffect(() => {
    // Function to fetch user details
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3030/admin/user-details",
          {
            headers: {
              Authorization: `${localStorage.getItem("authToken")}`,
            },
          }
        );
        setUser({ name: data.name, role: data.role });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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
          <Link href="/admin/panel">Dashboard</Link>
        </Menu.Item>
        <Menu.SubMenu key="3" icon={<DesktopOutlined />} title="Menu">
          <Menu.Item key="3.1" icon={<MinusOutlined />}>
            <Link href="/admin/panel/menu/create-menu">Manage Menu</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="2" icon={<DesktopOutlined />} title="Products">
          <Menu.Item key="2.1" icon={<MinusOutlined />}>
            <Link href="/admin/panel/products/list-product">
              Manage Products
            </Link>
          </Menu.Item>
          <Menu.Item key="2.2" icon={<MinusOutlined />}>
            <Link href="/admin/panel/products/add-product">Add Product</Link>
          </Menu.Item>
          <Menu.Item key="2.3" icon={<MinusOutlined />}>
            <Link href="/admin/panel/products/manage-categories">
              Manage Categories
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="4" icon={<DesktopOutlined />}>
          <Link href="/admin/panel/orders">Orders</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<DesktopOutlined />}>
          <Link href="/admin/panel/reset-password">Profile Options</Link>
        </Menu.Item>
      </Menu>
    </Layout>
  );
}
