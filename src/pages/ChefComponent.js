import React, { useEffect, useState, useCallback } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './ChefComponent.css'

const ChefComponent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const db = getFirestore();
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData = ordersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          items: data.items.map((item) => ({
            ...item,
            buttonLabel: getButtonLabel(item.status),
          })),
          timestamp: data.timestamp.toDate(), // Convert Firebase Timestamp to Date
        };
      });
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      setError('An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since there are no external dependencies

  const updateStatus = async (orderId, itemId, newStatus) => {
    const db = getFirestore();
    const orderDocRef = doc(db, 'orders', orderId);
    const updatedItems = orders
      .find((order) => order.id === orderId)
      .items.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item));

    await updateDoc(orderDocRef, {
      items: updatedItems,
    });

    fetchOrders(); // Fetch orders again to update the UI
  };

  const getButtonLabel = (status) => {
    switch (status) {
      case 'NotStarted':
        return 'Start';
      case 'Preparing':
        return 'Ready to Serve';
      default:
        return '';
    }
  };

  const handleButtonClick = async (orderId, itemId, status) => {
    switch (status) {
      case 'NotStarted':
        await updateStatus(orderId, itemId, 'Preparing');
        break;
      case 'Preparing':
        await updateStatus(orderId, itemId, 'Serving');
        break;
      // Add more cases as needed
      default:
        break;
    }
  };

  useEffect(() => {
    // Fetch orders when the component mounts
    fetchOrders();

    // Set up an interval to fetch orders every 5 seconds
    const intervalId = setInterval(fetchOrders, 1000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [fetchOrders]); // Dependency on fetchOrders to re-run the effect when fetchOrders changes

  return (
    <div className='ChefDashboard' style={{backgroundColor: '#e3f2fd'}}>
      <h1>Chef Dashboard</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <h3>Order ID: {order.id}</h3>
            <p>Table Number: {order.tableNumber}</p>
            <p>Timestamp: {order.timestamp.toLocaleString()}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.name} - Quantity: {item.quantity} - Status: {item.status}
                  </span>
                  {item.buttonLabel && (
                    <button className= "btn btn-outline-success" onClick={() => handleButtonClick(order.id, item.id, item.status)}>
                      {item.buttonLabel}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChefComponent;
