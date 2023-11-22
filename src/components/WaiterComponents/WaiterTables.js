// WaiterTables.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WaiterTables.css'

let selectedTable;

const WaiterTables = () => {
  const navigate = useNavigate();

  const handleTableClick = (tableNumber) => {
    console.log(`Table ${tableNumber} clicked!`);
    selectedTable = tableNumber;
    navigate(`/waiter/order-placement`);
  };

  return (
    <div className='tables'>
      <h1>Tables</h1>
      <div className='tableButtons'>
        <Table tableNumber={1} onTableClick={handleTableClick} />
        <Table tableNumber={2} onTableClick={handleTableClick} />
        <Table tableNumber={3} onTableClick={handleTableClick} />
        <Table tableNumber={4} onTableClick={handleTableClick} />
        <Table tableNumber={5} onTableClick={handleTableClick} />
        <Table tableNumber={6} onTableClick={handleTableClick} />
        <Table tableNumber={7} onTableClick={handleTableClick} />
        <Table tableNumber={8} onTableClick={handleTableClick} />
        <Table tableNumber={9} onTableClick={handleTableClick} />
        <Table tableNumber={10} onTableClick={handleTableClick} />
      </div>
    </div>
  );
};

const Table = ({ tableNumber, onTableClick }) => {
  const handleClick = () => {
    onTableClick(tableNumber);
  };

  return (
    <div>
      <button className = "btn btn-outline-primary tableClick" onClick={handleClick}>Table {tableNumber}</button>
    </div>
  );
};

export { selectedTable };
export default WaiterTables;
