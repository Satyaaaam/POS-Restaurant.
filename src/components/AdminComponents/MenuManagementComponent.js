import React, { useState, useEffect } from 'react';
import { firestore } from '../../firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import './MenuManagement.css'

const MenuManagementComponent = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: 0 });

  useEffect(() => {
    const fetchMenuItems = () => {
      const q = query(collection(firestore, 'menu'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const menuData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(menuData);
      });

      return unsubscribe;
    };

    fetchMenuItems();
  }, []);

  const handleAddItem = async () => {
    try {
      await addDoc(collection(firestore, 'menu'), newItem);
      setNewItem({ name: '', price: 0 });
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(firestore, 'menu', itemId));
      setMenuItems(menuItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  return (
    <div className='MenuManagement'>
      <div className='MenuSection1'>
      <h2>Menu Management</h2>
      <ul>
        {menuItems.map(item => (
          <li key={item.id}>
            {item.name} - Rs {item.price.toFixed(2)}
            <button  className =  'delete btn btn-danger' onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      </div>

      <div className='MenuSection2'>
      <h3>Add New Item</h3>
      <input className="form-control"
        type="text"
        placeholder="Item Name"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <input
      className="form-control priceInput"
        type="number"
        placeholder="Price"
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
      />
      <button className = 'addNewItem btn btn-success'onClick={handleAddItem}>Add Item</button>
      </div>
    </div>
  );
};

export default MenuManagementComponent;
