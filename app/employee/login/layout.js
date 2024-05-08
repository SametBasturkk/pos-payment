import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Layout } from "antd";

const RootLayout = ({ children }) => (
  <html lang="en">
    <body>
      <AntdRegistry>
        <Layout style={{ minHeight: "100vh" }} className="adminPage">
          {children}
        </Layout>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;
