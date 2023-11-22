import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MenuManagementComponent from '../components/AdminComponents/MenuManagementComponent';
import PastOrders from '../components/AdminComponents/PastOrders'
import AdminNavbar from '../components/AdminComponents/AdminNavbar';
import TableBillingComponent from '../components/AdminComponents/TableBillingComponent'
import 'bootstrap/dist/css/bootstrap.css';
// import EmployeeManagement from '../components/AdminComponents/EmployeeManagement'

const AdminComponent = () => {
  return (
    <div>
      <AdminNavbar />
      <Routes>
        <Route path="/" element={<TableBillingComponent/>} />
        <Route path="menu-management" element={<MenuManagementComponent />} />
        <Route path="past-orders" element={<PastOrders />} />
      </Routes>
    </div>
  );
};

export default AdminComponent;