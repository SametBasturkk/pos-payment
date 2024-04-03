"use client";
import { useState } from "react";
import { Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const NewMenu = () => {
  const [menuName, setMenuName] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  const handleAddFoodCategory = () => {
    setMenuItems([...menuItems, { type: "category" }]);
  };

  const handleAddFoodItem = () => {
    setMenuItems([...menuItems, { type: "item" }]);
  };

  const handleMenuNameChange = (e) => {
    setMenuName(e.target.value);
  };

  const handleFileUpload = (file) => {
    console.log(file);
  };

  const handleSaveMenu = () => {
    const menuTemplate = menuItems.map((item) => {
      if (item.type === "category") {
        return { foodCategory: item.value };
      } else if (item.type === "item") {
        return {
          foodName: item.foodName,
          foodPrice: item.foodPrice,
          foodUploadImage: item.foodUploadImage,
        };
      }
      return null;
    });

    fetch("http://localhost:3001/saveMenu", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        menuJSON: menuTemplate,
        menuName: menuName,
        userid: localStorage.getItem("userid"),
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      });

    menuItems.forEach((item) => {
      if (item.type === "item") {
        handleFileUpload(item.file);
      }
    });
  };

  return (
    <div>
      <h1>Create New Menu</h1>
      <Input
        type="text"
        placeholder="Menu Name"
        value={menuName}
        onChange={handleMenuNameChange}
      />
      <br />
      <Button onClick={handleAddFoodCategory}>Add Food Category</Button>
      <Button onClick={handleAddFoodItem}>Add Food Name</Button>
      <div>
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.type === "category" && (
              <Input type="text" placeholder="Food Category" />
            )}
            {item.type === "item" && (
              <>
                <Input type="text" placeholder="Food Name" />
                <Input type="text" placeholder="Food Price" />
                <Upload
                  accept="image/*"
                  customRequest={({ file }) => handleFileUpload(file)}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </>
            )}
            <br />
          </div>
        ))}
      </div>
      <Button onClick={handleSaveMenu}>Save Menu</Button>
    </div>
  );
};

export default NewMenu;
