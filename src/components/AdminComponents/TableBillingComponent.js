import React, { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  query,
  where,
  deleteDoc,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import '../../css/TableBilling.css'

const getButtonLabel = (status) => {
  switch (status) {
    case 'NotStarted':
      return 'Start';
    case 'Preparing':
      return 'Ready to Serve';
    default:
      return '';
  }
};

const renderTimestamp = (timestamp) => {
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString();
  } else if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleString();
  }
  return '';
};

const PrintableOrder = forwardRef(({ orders }, ref) => {
  const contentRef = React.createRef();

  useImperativeHandle(ref, () => ({
    print: () => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write('<div style="margin: 20px;">');
      printWindow.document.write('<h1>Printable Order</h1>');
      printWindow.document.write('<hr/>');
      printWindow.document.write('<div>');
      printWindow.document.write(contentRef.current.innerHTML);
      printWindow.document.write('</div>');
      printWindow.document.write('</div>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    },
  }));

  if (!orders || orders.length === 0) {
    return <p>No orders available for printing.</p>;
  }

  const total = orders.reduce((acc, singleOrder) => {
    return (
      acc +
      singleOrder.items.reduce((orderTotal, item) => {
        return orderTotal + item.price * item.quantity;
      }, 0)
    );
  }, 0);

  return (
    <div ref={contentRef}>
      {orders.map((singleOrder) => (
        <div key={singleOrder.id}>
          <h3>Table Number: {singleOrder.tableNumber}</h3>
          <h4>Order ID: {singleOrder.id}</h4>
          <p>Timestamp: {renderTimestamp(singleOrder.timestamp)}</p>
          <ul>
            {singleOrder.items.map((item) => (
              <li key={item.id}>
                {item.name} - Quantity: {item.quantity} - Price: Rs {item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p>Total Price: Rs {total.toFixed(2)}</p>
    </div>
  );
});


const TableBillingComponent = () => {
  const [mergedOrders, setMergedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const db = getFirestore();
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData = ordersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          items: data.items.map((item) => ({
            ...item,
            buttonLabel: getButtonLabel(item.status),
          })),
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : data.timestamp,
        };
      });
      mergeOrdersByTable(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      setError('An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 1000);
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  const mergeOrdersByTable = (orders) => {
    const mergedOrdersMap = new Map();
    orders.forEach((order) => {
      const tableNumber = order.tableNumber;
      if (!mergedOrdersMap.has(tableNumber)) {
        mergedOrdersMap.set(tableNumber, { orders: [order], ref: React.createRef() });
      } else {
        const existingOrders = mergedOrdersMap.get(tableNumber);
        mergedOrdersMap.set(tableNumber, {
          orders: [...existingOrders.orders, order],
          ref: existingOrders.ref,
        });
      }
    });
    const mergedOrdersArray = Array.from(mergedOrdersMap, ([tableNumber, data]) => ({
      tableNumber,
      orders: data.orders,
      ref: data.ref,
    }));
    setMergedOrders(mergedOrdersArray);
  };

  const handlePrintOrder = (tableNumber) => {
    const tableToPrint = mergedOrders.find((order) => order.tableNumber === tableNumber);
    if (tableToPrint) {
      tableToPrint.ref.current.print();
    } else {
      console.error(`Table with number ${tableNumber} not found for printing.`);
    }
  };

  const handleDeleteOrders = async (tableNumber) => {
    try {
      const db = getFirestore();

      // Get orders for the specified table
      const ordersQuery = query(collection(db, 'orders'), where('tableNumber', '==', tableNumber));
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Add the data to the pastOrders collection
      const pastOrdersCollection = collection(db, 'pastOrders');
      const addPastOrdersPromises = ordersData.map((order) =>
        addDoc(pastOrdersCollection, { ...order, timestamp: Timestamp.now() })
      );
      await Promise.all(addPastOrdersPromises);

      // Delete orders from the orders collection
      const deleteOrderPromises = ordersSnapshot.docs.map((orderDoc) =>
        deleteDoc(doc(db, 'orders', orderDoc.id))
      );
      await Promise.all(deleteOrderPromises);

      console.log(`Orders for Table ${tableNumber} moved to pastOrders successfully.`);
      fetchOrders(); // Update the state with the latest data
    } catch (error) {
      console.error(`Error moving orders to pastOrders for table ${tableNumber}:`, error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='tableBilling'>
      <h1>Table Billing Dashboard</h1>
      <div>
      <div>
      <ul>
        {mergedOrders.map((mergedOrder) => (
          <li key={mergedOrder.tableNumber}>
            <PrintableOrder ref={mergedOrder.ref} orders={mergedOrder.orders} />
            <button className="btn btn-primary printButton, printButton" onClick={() => handlePrintOrder(mergedOrder.tableNumber)}>
              Print Receipt
            </button> <br />
            <button className="btn btn-danger clearButton" onClick={() => handleDeleteOrders(mergedOrder.tableNumber)}>
              Clear Table
            </button>
          </li>
        ))}
      </ul>
      </div>
      </div>
    </div>
  );
};

export default TableBillingComponent;
