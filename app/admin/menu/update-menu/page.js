"use client";
import React, { useEffect, useState } from "react";
import { Button, Input, Upload, message, Form, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const updateMenu = () => {
  const [menuName, setMenuName] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = () => {
    const menuNameFromUrl = window.location.href.split("/")[4];
    fetch("http://localhost:3001/getMenu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        menuName: menuNameFromUrl,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMenuName(data.menuName);
        const items = data.menuJSON.map((item, index) => {
          switch (Object.keys(item)[0]) {
            case "foodCategory":
              return (
                <Input
                  key={index}
                  type="text"
                  placeholder="Food Category"
                  defaultValue={item.foodCategory}
                />
              );
            case "foodName":
              return (
                <Input
                  key={index}
                  type="text"
                  placeholder="Food Name"
                  defaultValue={item.foodName}
                />
              );
            case "foodPrice":
              return (
                <Input
                  key={index}
                  type="text"
                  placeholder="Food Price"
                  defaultValue={item.foodPrice}
                />
              );
            case "foodUploadImage":
              const uploadProps = {
                name: "file",
                accept: "image/*",
                action: "http://localhost:3001/fileUpload",
                headers: {
                  user_id: localStorage.getItem("userid"),
                },
                onChange(info) {
                  if (info.file.status !== "uploading") {
                    console.log(info.file, info.fileList);
                  }
                  if (info.file.status === "done") {
                    message.success(
                      `${info.file.name} file uploaded successfully`
                    );
                  } else if (info.file.status === "error") {
                    message.error(`${info.file.name} file upload failed.`);
                  }
                },
              };
              return (
                <>
                  <Upload key={index} {...uploadProps}>
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                  </Upload>
                  <br />
                  <img
                    src={`http://localhost:3001/uploads/${data.menuDIR}/${item.foodUploadImage}`}
                    alt="Food"
                    width="100"
                    height="100"
                  />
                </>
              );
            default:
              return <br key={index} />;
          }
        });
        setMenuItems(items);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const saveMenu = () => {
    const formData = new FormData();
    menuItems.forEach((item, index) => {
      if (item.props.placeholder === "Food Category") {
        formData.append(`foodCategory${index}`, item.props.defaultValue);
      } else if (item.props.placeholder === "Food Name") {
        formData.append(`foodName${index}`, item.props.defaultValue);
      } else if (item.props.placeholder === "Food Price") {
        formData.append(`foodPrice${index}`, item.props.defaultValue);
      } else if (item.props.accept === "image/*") {
        formData.append(`file${index}`, item.props.children[0].props.file);
      }
    });

    fetch("http://localhost:3001/updateMenu", {
      method: "POST",
      headers: {
        Accept: "application/json",
        user_id: localStorage.getItem("userid"),
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h1>Update Menu</h1>
      <Input id="menuName" defaultValue={menuName} />
      {menuItems}
      <Button onClick={saveMenu}>Save Menu</Button>
    </div>
  );
};

export default updateMenu;
