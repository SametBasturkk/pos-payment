"use client";
import React, { useState, useEffect } from "react";
import { Card, Spin, Button, message, Col, Row } from "antd";
import { useParams } from "next/navigation";
import axios from "axios";

const MenuPage = () => {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/menu/${id}`);
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
    if (updatedBasket[item.id]) {
      updatedBasket[item.id].quantity += 1;
    } else {
      updatedBasket[item.id] = { ...item, quantity: 1 };
    }
    setBasket(updatedBasket);
    message.success("Item added to basket");
  };

  const removeItemFromBasket = (id) => {
    const updatedBasket = { ...basket };
    delete updatedBasket[id];
    setBasket(updatedBasket);
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(basket).forEach((item) => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

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

  const confirmOrder = async () => {
    try {
      const orderData = Object.values(basket).map((item) => ({
        productID: item.id,
        price: Number(item.price),
        quantity: item.quantity,
      }));

      const structure = {
        orderDetails: JSON.stringify(orderData),
        menu: { id: id },
        companyID: menuData.company,
        price: calculateTotal(),
      };

      await axios.post("http://localhost:3030/order/create", structure, {
        headers: {
          Authorization: getToken(),
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
                      <li key={item.id}>
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
                <li key={item.id}>
                  <p>
                    {item.name} - Quantity: {item.quantity}
                  </p>
                  <p>Price: {(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    type="danger"
                    onClick={() => removeItemFromBasket(item.id)}
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
