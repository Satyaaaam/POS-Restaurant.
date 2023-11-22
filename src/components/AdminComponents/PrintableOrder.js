import React, { forwardRef } from 'react';

const PrintableOrder = forwardRef(({ orders }, ref) => {
  if (!orders || orders.length === 0) {
    return <p>No orders available for printing.</p>;
  }

  const total = orders.reduce((acc, singleOrder) => {
    return (
      acc +
      singleOrder.items.reduce((orderTotal, item) => {
        return orderTotal + item.price * item.quantity;
      }, 0)
    );
  }, 0);

  return (
    <div className='tableGrid'> 
    <div className='orders' ref={ref}>
      {orders.map((singleOrder) => (
        <div key={singleOrder.id}>
          <h3>Table Number: {singleOrder.tableNumber}</h3>
          <h4>Order ID: {singleOrder.id}</h4>
          <p>Timestamp: {renderTimestamp(singleOrder.timestamp)}</p>
          <ul>
            {singleOrder.items.map((item) => (
              <li key={item.id}>
                {item.name} - Quantity: {item.quantity} - Price: Rs {item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p style={{fontWeight: bold}}>Total Price: Rs {total.toFixed(2)}</p>
    </div>
    </div>
  );
});

const renderTimestamp = (timestamp) => {
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString();
  } else if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleString();
  }
  return '';
};

export default PrintableOrder;
