// OrderForm.js
import React, { useState } from 'react';

const OrderForm = ({ tableNumber, onPlaceOrder }) => {
  const [order, setOrder] = useState({
    itemName: '',
    quantity: 1, // Default quantity
    // Add more fields as needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onPlaceOrder function with the order details
    onPlaceOrder(order);
    // Optionally, reset the form or perform other actions
    setOrder({
      itemName: '',
      quantity: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Table {tableNumber} - Place Order</h3>
      <label>
        Item Name:
        <input
          type="text"
          name="itemName"
          value={order.itemName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Quantity:
        <input
          type="number"
          name="quantity"
          value={order.quantity}
          onChange={handleChange}
          min="1"
          required
        />
      </label>
      {/* Add more fields as needed */}
      <button type="submit">Place Order</button>
    </form>
  );
};

export default OrderForm;
