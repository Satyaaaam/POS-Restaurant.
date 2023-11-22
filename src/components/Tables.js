import React from 'react';
import { useHistory } from 'react-router-dom';

const Table = ({ tableNumber }) => {
  const history = useHistory();

  const handleTableClick = () => {
    // Redirect to the OrderPlacement component with the table number
    history.push(`/order-placement/`);
  };

  return (
    <div
      onClick={handleTableClick}
    >
      Table {tableNumber}
    </div>
  );
};

export default Table;
