// OrderListPrint.tsx
import React from "react";

interface Order {
  orderId: string;
  custName: string;
  mobileNo: string;
  billNo: string;
  date: string;
  totalAmount: number;
  totalProducts: number;
}

interface Props {
  orders: Order[];
}

const OrderListPrint: React.FC<Props> = ({ orders }) => {
  return (
    <div style={{ padding: 20, fontFamily: "Arial", color: "#000" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Customer Order Report</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Mobile</th>
            <th style={thStyle}>Bill No</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Products</th>
            <th style={thStyle}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td style={tdStyle}>{order.custName}</td>
              <td style={tdStyle}>{order.mobileNo}</td>
              <td style={tdStyle}>{order.billNo}</td>
              <td style={tdStyle}>{order.date}</td>
              <td style={tdStyle}>{order.totalProducts}</td>
              <td style={tdStyle}>₹{order.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#eee",
  fontWeight: "bold",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default OrderListPrint;
