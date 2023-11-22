import React from 'react';
import { Routes, Route } from 'react-router-dom';

import OrderPlacement from '../components/WaiterComponents/OrderPlacement';
import WaiterTables from '../components/WaiterComponents/WaiterTables'
import OrderCollection from '../components/WaiterComponents/OrderCollection.js';
import WaiterNavbar from '../components/WaiterComponents/WaiterNavbar';

const WaiterComponent = () => {
  return (
    <div>
      <WaiterNavbar />
      <Routes>
        {/* Use /waiter as the base path */}
        <Route path="/" element={<WaiterTables />} />
        <Route path="collect" element={<OrderCollection />} />
        <Route path="order-placement" element={<OrderPlacement />} />
      </Routes>
    </div>
  );
};

export default WaiterComponent;