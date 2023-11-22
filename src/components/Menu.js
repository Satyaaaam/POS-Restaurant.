import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { selectedTable } from './WaiterComponents/WaiterTables';
import './Menu.css'

const Menu = ({ tableNumber }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemCounters, setItemCounters] = useState({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const db = getFirestore();
        const menuCollection = collection(db, 'menu');
        const menuSnapshot = await getDocs(menuCollection);
        const menuData = menuSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), status: 'NotStarted' }));
        setMenuItems(menuData);
      } catch (error) {
        console.error('Error fetching menu:', error.message);
      }
    };

    fetchMenu();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddItem = (itemId) => {
    setItemCounters((prevCounters) => ({ ...prevCounters, [itemId]: 1 }));
  };

  const handleIncrement = (itemId) => {
    setItemCounters((prevCounters) => ({
      ...prevCounters,
      [itemId]: (prevCounters[itemId] || 0) + 1,
    }));
  };

  const handleDecrement = (itemId) => {
    setItemCounters((prevCounters) => ({
      ...prevCounters,
      [itemId]: Math.max((prevCounters[itemId] || 0) - 1, 0),
    }));
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlaceOrder = async () => {
    try {
      
      const selectedItems = Object.keys(itemCounters).map((itemId) => ({
        id: itemId,
        name: menuItems.find((item) => item.id === itemId).name,
        price: menuItems.find((item) => item.id === itemId).price,
        quantity: itemCounters[itemId],
        status: 'NotStarted', // Set the status for each item in the order
      }));

      // Create a new order document in the "orders" collection
      const db = getFirestore();
      const ordersCollection = collection(db, 'orders');
      const orderDocRef = await addDoc(ordersCollection, {
        items: selectedItems,
        tableNumber: selectedTable,
        timestamp: serverTimestamp(),
        // Add any other relevant order details here
      });

      // Update the menu items to set their status as 'NotStarted'
      const menuRef = collection(db, 'menu');
      await Promise.all(
        Object.keys(itemCounters).map(async (itemId) => {
          const itemDocRef = doc(db, 'menu', itemId);
          await updateDoc(itemDocRef, { status: 'NotStarted' });
        })
      );

      // Clear the item counters after placing the order
      setItemCounters({});
      console.log('Order placed successfully with status "NotStarted"');

      // Retrieve the order ID from the added document reference
      console.log('Order ID:', orderDocRef.id);
    } catch (error) {
      console.error('Error placing order:', error.message);
    }
  };

  return (
    <div className='PlaceMenu'>
      <h1>Table No. {selectedTable}</h1>
      <input type="text" placeholder="Search menu"  className ="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" value={searchQuery} onChange={handleSearch} />
      <ul>
        {filteredMenuItems.map((item) => (
          <li key={item.id}>
            {item.name} - Rs {item.price}
            <span>
              {itemCounters[item.id] ? (
                <div>
                  <button className= "btn btn-outline-success" onClick={() => handleDecrement(item.id)}>-</button>
                  <span>{itemCounters[item.id]}</span>
                  <button className= "btn btn-outline-success"onClick={() => handleIncrement(item.id)}>+</button>
                </div>
              ) : (
                <button className = "btn btn-primary add" onClick={() => handleAddItem(item.id)}>Add</button>
              )}
            </span>
          </li>
        ))}
      </ul>
      <button className = "btn btn-success" onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default Menu;