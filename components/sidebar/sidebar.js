"use client";
import React from "react";
import { Layout, Menu } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { ToolOutlined } from "@ant-design/icons";

import "./sidebar.css";

export default function Sidebar() {
  return (
    <Layout width={200} className="site-layout-background sidebar">
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
              <p className="name">
                Profile <ToolOutlined />
              </p>
            </div>
            <p>Admin</p>
          </div>
        </div>

        <Menu.Item key="1" icon={<PieChartOutlined />}>
          Add Product
        </Menu.Item>
        <Menu.Item key="3" icon={<DesktopOutlined />}>
          Orders
        </Menu.Item>
      </Menu>
    </Layout>
  );
}
