"use client";
import React, { useState, useEffect } from "react";
import { Card, Spin, Button, message, Col, Row } from "antd";
import axios from "axios";

const MenuPage = () => {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState({});
  const [uuid, setUuid] = useState(null);

  useEffect(() => {
    const url = window.location.href;
    const uuid = url.substring(url.lastIndexOf("/") + 1);
    setUuid(uuid);

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/menu/${uuid}`);
        setMenuData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToBasket = (item) => {
    const updatedBasket = { ...basket };
    if (updatedBasket[item.uuid]) {
      updatedBasket[item.uuid].quantity += 1;
    } else {
      updatedBasket[item.uuid] = { ...item, quantity: 1 };
    }
    setBasket(updatedBasket);
    message.success("Item added to basket");
  };

  const removeItemFromBasket = (uuid) => {
    const updatedBasket = { ...basket };
    delete updatedBasket[uuid];
    setBasket(updatedBasket);
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(basket).forEach((item) => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

  const confirmOrder = async () => {
    try {
      const orderData = Object.values(basket).map((item) => ({
        productID: item.uuid,
        price: Number(item.price),
        quantity: item.quantity,
      }));

      const structure = {
        orderDetails: JSON.stringify(orderData),
        menuID: uuid,
        companyID: menuData.company,
        price: calculateTotal(),
      };

      await axios.post("http://localhost:3030/order/create", structure, {
        headers: {
          Authorization: localStorage.getItem("authToken"),
        },
      });
      setBasket({});
      message.success("Order confirmed!");
    } catch (error) {
      console.error("Error confirming order:", error);
      message.error("Failed to confirm order. Please try again later.");
    }
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={18}>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Card
              title={menuData.menuName}
              extra={<p>{menuData.menuDescription}</p>}
            >
              {Object.keys(menuData.menuItems).map((category) => (
                <div key={category}>
                  <h2>{category}</h2>
                  <ul>
                    {menuData.menuItems[category].map((item) => (
                      <li key={item.uuid}>
                        <img
                          src={`http://localhost:3030/product/image/${item.imageUUID}`}
                          alt={item.name}
                          style={{ width: 100, height: 100 }}
                        />
                        <div>
                          <p>Name: {item.name}</p>
                          <p>Price: {item.price}</p>
                          <Button
                            type="primary"
                            onClick={() => addToBasket(item)}
                          >
                            Add to Basket
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card>
          )}
        </Col>
        <Col span={6}>
          <Card title="Basket">
            <ul>
              {Object.values(basket).map((item) => (
                <li key={item.uuid}>
                  <p>
                    {item.name} - Quantity: {item.quantity}
                  </p>
                  <p>Price: {(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    type="danger"
                    onClick={() => removeItemFromBasket(item.uuid)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <p>Total: {calculateTotal()}</p>
            <Button
              type="primary"
              onClick={confirmOrder}
              disabled={Object.keys(basket).length === 0}
            >
              Confirm Order
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MenuPage;
