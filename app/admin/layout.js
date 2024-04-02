import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Sidebar from "../../components/sidebar/sidebar";
import { Layout } from "antd";
import "../styles/adminPage.css";

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <AntdRegistry>
        <Layout style={{ minHeight: "100vh" }} className="adminPage">
          <Sidebar />
          {children}
        </Layout>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;
