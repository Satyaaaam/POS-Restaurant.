import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import './OrderCollection.css'

const OrderCollection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async () => {
    try {
      const db = getFirestore();
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      setError('An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelItem = async (orderId, itemId) => {
    try {
      // Update the local state to mark the item as 'Cancelled' and remove it
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items
            .map((item) =>
              item.id === itemId ? { ...item, status: 'Cancelled' } : item
            )
            .filter((item) => item.status !== 'Cancelled');
          return { ...order, items: updatedItems };
        }
        return order;
      });

      setOrders(updatedOrders);

      // Get a reference to the order document in Firestore
      const db = getFirestore();
      const orderRef = doc(db, 'orders', orderId);

      // Update the order document in Firestore with the modified items array
      await updateDoc(orderRef, {
        items: updatedOrders.find((order) => order.id === orderId)?.items || [],
        timestamp: Timestamp.now(),
      });

      console.log(`Item ID ${itemId} in Order ID ${orderId} cancelled.`);
    } catch (error) {
      console.error(`Error cancelling item:`, error.message);
      console.error('Error details:', error);
    }
  };

  const handleFinishItem = async (orderId, itemId) => {
    try {
      // Update the local state to mark the item as 'Finished'
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) =>
            item.id === itemId ? { ...item, status: 'Finished' } : item
          );
          return { ...order, items: updatedItems };
        }
        return order;
      });

      setOrders(updatedOrders);

      // Get a reference to the order document in Firestore
      const db = getFirestore();
      const orderRef = doc(db, 'orders', orderId);

      // Update the order document in Firestore with the modified items array
      await updateDoc(orderRef, {
        items: updatedOrders.find((order) => order.id === orderId)?.items || [],
        timestamp: Timestamp.now(),
      });

      console.log(`Item ID ${itemId} in Order ID ${orderId} marked as finished.`);
    } catch (error) {
      console.error(`Error marking item as finished:`, error.message);
      console.error('Error details:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <p className='tableNumber'>Table Number: {order.tableNumber}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} - Quantity: {item.quantity} - Status: {item.status}
                  {item.status !== 'Cancelled' && (
                    <div>
                      <button className="btn btn-danger cancelItem"
                        onClick={() => handleCancelItem(order.id, item.id)}
                        disabled={item.status !== 'NotStarted'}
                      >
                        Cancel Item
                      </button>
                      {item.status === 'Serving' && (
                        <button className='btn btn-success cancelItem' onClick={() => handleFinishItem(order.id, item.id)}>
                          Mark as Finished
                        </button>
                      )}
                      {item.status === 'Finished'}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {order.status !== 'Served' && (
              <div>
                {/* Additional content if needed */}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderCollection;
