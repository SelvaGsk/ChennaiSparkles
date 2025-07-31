import React from "react";

interface OrderDetailPrintProps {
  order: any;
  setting: any;
}

const OrderDetailPrint: React.FC<OrderDetailPrintProps> = ({
  order,
  setting,
}) => {
  const totalAmount = (order.totalAmount || 0) + (order.packingCharge || 0);
  const totalQty =
    order.billProductList?.reduce(
      (acc: number, item: any) => acc + Number(item.qty || 0),
      0
    ) || 0;
  const totalProductAmount =
    order.billProductList?.reduce(
      (acc: number, item: any) =>
        acc + Number(item.qty || 0) * Number(item.salesPrice || 0),
      0
    ) || 0;

  if (!setting) return null;

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "20px",
        color: "#000",
        fontSize: "14px",
      }}
    >
      {/* ✅ Store Header */}
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <img
          src="/CompanyLogo.png"
          alt="Chennai Sparkle Crackers Logo"
          style={{ width: "80px", marginRight: "20px" }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>
            Chennai Sparkle Crackers
          </h1>
          <p style={{ margin: 0, color: "#555", lineHeight: "1.5" }}>
            {setting[0]?.Address}
            <br />
            <strong>Contact:</strong> {setting[0]?.CellNO} /{" "}
            {setting[0]?.OfficeNo}
          </p>
        </div>
      </div>

      <h2 style={{ textAlign: "center", margin: "20px 0" }}>Estimation</h2>

      {/* ✅ Order Info Table */}
      <table style={infoTable}>
        <tbody>
          <tr>
            <td>
              <strong>Customer Name:</strong> {order.custName}
            </td>
            <td>
              <strong>Mobile No:</strong> {order.customer?.mobileNo}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Order ID:</strong> {order.orderId}
            </td>
            <td>
              <strong>Date:</strong> {order.date}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Total Products:</strong> {order.totalProducts}
            </td>
            <td>
              <strong>Product Amount:</strong> ₹{order.totalAmount}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Packing Charge:</strong> ₹{order.packingCharge}
            </td>
            <td>
              <strong>Total Amount:</strong> ₹{totalAmount}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <strong>Billing Address:</strong> {order.deliveryAddress}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Transport Name:</strong> {order.transportName}
            </td>
            <td>
              <strong>LR Number:</strong> {order.lrNumber}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ✅ Product List */}
      <h3 style={{ marginTop: "30px", marginBottom: "10px" }}>Product List</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>S.No</th>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Qty</th>
            <th style={thStyle}>Rate (₹)</th>
            <th style={thStyle}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {order.billProductList?.map((product: any, index: number) => {
            const qty = Number(product.qty || 0);
            const rate = Number(product.salesPrice || 0);
            const amount = qty * rate;
            return (
              <tr key={index}>
                <td style={tdStyleCenter}>{index + 1}</td>
                <td style={tdStyleLeft}>{product.productName}</td>
                <td style={tdStyleRight}>{qty}</td>
                <td style={tdStyleRight}>{rate.toFixed(2)}</td>
                <td style={tdStyleRight}>{amount.toFixed(2)}</td>
              </tr>
            );
          })}
          <tr style={{ fontWeight: "bold", backgroundColor: "#fafafa" }}>
            <td colSpan={2} style={tdStyleRight}>
              Total
            </td>
            <td style={tdStyleRight}>{totalQty}</td>
            <td style={tdStyleRight}>—</td>
            <td style={tdStyleRight}>{totalProductAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* ✅ Footer */}
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Thank you for your purchase! – <strong>Chennai Sparkle Crackers</strong>
      </p>
    </div>
  );
};

const infoTable = {
  width: "100%",
  borderCollapse: "collapse" as const,
  marginBottom: "20px",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  fontSize: "14px",
  textAlign: "center" as const,
};

const tdStyleLeft = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left" as const,
};

const tdStyleRight = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "right" as const,
};

const tdStyleCenter = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center" as const,
};

export default OrderDetailPrint;
