"use client";
import React from "react";
import { Layout } from "antd";

const { Sider, Content } = Layout;

const App = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ margin: "16px" }}>
          {/* Your main content goes here */}
          <div style={{ padding: 24, minHeight: 360, background: "#fff" }}>
            {/* Content for Add Product */}
            {/* Content for Account */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
