import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/AdminNavbar.css'

const AdminNavbar = () => {
  return (
    <nav id = "adminNav" className ="navbar navbar-light" style={{backgroundColor: '#e3f2fd'}}>
      <ul>
        <li>
          <Link to="/admin">Table Billing</Link>
        </li>
        <li>
          <Link to="/admin/menu-management">Menu Management</Link>
        </li>
        <li>
          <Link to="/admin/past-orders">Past Orders</Link>
        </li>
        {/* Add other links as needed */}
      </ul>
    </nav>
  );
};

export default AdminNavbar;
