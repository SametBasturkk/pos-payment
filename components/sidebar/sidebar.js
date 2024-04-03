"use client";
import React from "react";
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  ToolOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import Link from "next/link";

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
              <p className="name">Profile</p>
            </div>
            <p className="title">Admin</p>
          </div>
        </div>

        <Menu.Item key="1" icon={<PieChartOutlined />}>
          <Link href="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.SubMenu key="3" icon={<DesktopOutlined />} title="Menu">
          <Menu.Item key="3.1" icon={<MinusOutlined />}>
            <Link href="/admin/panel/menu/create-menu">Create New Menu</Link>
          </Menu.Item>
          <Menu.Item key="3.2" icon={<MinusOutlined />}>
            <Link href="/admin/panel/menu/delete-menu">Delete Menu</Link>
          </Menu.Item>
          <Menu.Item key="3.3" icon={<MinusOutlined />}>
            <Link href="/admin/panel/menu/update-menu">Update Menu</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="2" icon={<DesktopOutlined />} title="Products">
          <Menu.Item key="2.3" icon={<MinusOutlined />}>
            <Link href="/admin/panel/products/list-product">List Product</Link>
          </Menu.Item>
          <Menu.Item key="2.1" icon={<MinusOutlined />}>
            <Link href="/admin/panel/products/add-product">Add Product</Link>
          </Menu.Item>
          <Menu.Item key="2.2" icon={<MinusOutlined />}>
            <Link href="/admin/panel/products/remove-product">
              Remove Product
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
