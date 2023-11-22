import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './PastOrders.css';

const PastOrders = () => {
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        const db = getFirestore();
        const pastOrdersCollection = collection(db, 'pastOrders');
        const pastOrdersSnapshot = await getDocs(pastOrdersCollection);
        const pastOrdersData = pastOrdersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(), // Convert Firebase Timestamp to Date
        }));
        setPastOrders(pastOrdersData);
      } catch (error) {
        console.error('Error fetching past orders:', error.message);
        setError('An error occurred while fetching past orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchPastOrders();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='pastOrders'>
      <h1>Past Orders</h1>
      <ul>
        {pastOrders.map((pastOrder) => (
          <li key={pastOrder.id}>
            <h3>Order ID: {pastOrder.id}</h3>
            <p>Table Number: {pastOrder.tableNumber}</p>
            <p>Timestamp: {pastOrder.timestamp.toLocaleString()}</p>
            <ul>
              {pastOrder.items.map((item) => (
                <li key={item.id}>
                  {item.name} - Quantity: {item.quantity} - Price: Rs {item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PastOrders;
