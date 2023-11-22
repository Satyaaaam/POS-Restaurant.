import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/AdminNavbar.css'
import './WaiterNavbar.css'

const WaiterNavbar = () => {
  return (
    <nav className='navbar navbar-light WaiterNav' style={{backgroundColor: '#e3f2fd'}}>
      <ul>
        <li className='link1'>
          <Link to="/waiter">Place Order</Link>
        </li><br />
        <li className='link1'>
          <Link to="/waiter/collect">Collect Order</Link>
        </li>
      </ul>
    </nav>
  );
};

export default WaiterNavbar;