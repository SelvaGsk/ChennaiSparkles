//@ts-nocheck
import AdminProduct, { AddProductToShop, EditProduct } from "@/components/AdminProduct";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/Services/context";
import { ArrowRight, Box, CheckCircle2, Package, Truck } from "lucide-react";
import { useEffect, useState, React, useRef } from "react";
import {
  FaPrint,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { MdDeleteForever, MdPending } from "react-icons/md";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import OrderDetailPrint  from "@/components/OrderDetailPrint";
import { printElement } from "@/components/utility/PrintUtility";
import { renderToStaticMarkup } from "react-dom/server";
import { FaShare } from "react-icons/fa6";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import html2pdf from "html2pdf.js";
import { getFunctions, httpsCallable } from "firebase/functions";
import toast from "react-hot-toast";
import { generateOrderPdf } from "@/components/utility/generateOrderPDF";
import { storage } from "@/Services/Firebase.config";
dayjs.extend(customParseFormat);

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilters, setStatusFilters] = useState({
    orderPlaced: false,
    payment: false,
    shipped: false,
    delivered: false,
    pending: false,
  });
  const { getCustomerOrders,setting,getupdateCustomerOrders,getBannerUrls, getSingleCustomerOrder } = useFirebase();
  const [toggle,setToggle] =useState(false);
  const [localSetting, setLocalSetting] = useState(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    const CustomerOrders = async () => {
      const data = await getCustomerOrders();
      const s=await getBannerUrls();
      setLocalSetting(s);
      if (!data) return;

      const flatOrders = [];
      for (const userId in data) {
        for (const orderId in data[userId]) {
          const order = data[userId][orderId];

           // Skip deleted orders
        if (order.delete) continue;

          flatOrders.push({
            ...order,
            userId,
            orderId,
            totalProducts: order.billProductList?.length || 0,
          });
        }
      }

      setOrders(flatOrders);
      setFilteredOrders(flatOrders);
    };

    CustomerOrders();
  }, [toggle]);

  useEffect(() => {
    const CustomerOrders = async () => {
      const data = await getCustomerOrders();
      const s=await getBannerUrls();
      setLocalSetting(s);
      if (!data) return;

      const flatOrders = [];
      for (const userId in data) {
        for (const orderId in data[userId]) {
          const order = data[userId][orderId];

           // Skip deleted orders
        if (order.delete) continue;

          flatOrders.push({
            ...order,
            userId,
            orderId,
            totalProducts: order.billProductList?.length || 0,
          });
        }
      }

      console.log(flatOrders);
      const format = "DD/MM/YYYY HH:mm:ss";

const sortOrderindb = flatOrders.sort((a, b) => {
  const dateA = dayjs(a.date, format, true);
  const dateB = dayjs(b.date, format, true);

  if (!dateA.isValid() && !dateB.isValid()) return 0;
  if (!dateA.isValid()) return 1;
  if (!dateB.isValid()) return -1;

  // Newest first
  return dateB.valueOf() - dateA.valueOf();
});

      setOrders(sortOrderindb);
      setFilteredOrders(sortOrderindb);
    };

    CustomerOrders();
  }, [toggle]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = orders
      .filter(
        (order) =>
          order.custName?.toLowerCase().includes(term) ||
          order.customer?.mobileNo?.toLowerCase().includes(term) ||
          order.billNo?.toLowerCase().includes(term)
      )
      .filter((item) => {
        const { orderPlaced, payment, shipped, delivered, pending } = statusFilters;
        const s = item.statuses || {};
        const isAnyFilterActive = orderPlaced || payment || shipped || delivered;

        if (pending) return s.orderPlaced === "false";

        if (!isAnyFilterActive) return true;

        return (
          (orderPlaced && s.orderPlaced === "true") ||
          (payment && s.payment === "true") ||
          (shipped && s.shipped === "true") ||
          (delivered && s.delivered === "true")
        );
      })
      
      // const sort=filtered
    setFilteredOrders(filtered);
  }, [searchTerm, orders, statusFilters]);


  const renderStatusIcon = (value) => {
    if (value === "true") return <FaCheckCircle className="text-green-500" />;
    if (value === "false") return <FaTimesCircle className="text-red-500" />;
    return <FaHourglassHalf className="text-yellow-500" />;
  };

  const handleOrderClick = (order) => {
    setImageFiles({});
    setSelectedOrder(order);
  };

  const handleBack = () => {
    setSelectedOrder(null);
  };

  const toggleStatus = (status) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...selectedOrder.billProductList];

  // Parse numbers safely
  const parsedValue = (field === "qty" || field === "salesPrice") ? parseFloat(value) || 0 : value;

  updated[index][field] = parsedValue;

  // Recalculate totals
  const totalAmount = updated.reduce(
    (acc, cur) => acc + (parseFloat(cur.qty) || 0) * (parseFloat(cur.salesPrice) || 0),
    0
  );
   
  const packingCharge = (totalAmount * (localSetting[0]?.packageCharge || 0)) / 100;

    console.log(totalAmount)
    console.log(packingCharge)


    setSelectedOrder((prev) => ({
      ...prev,
      billProductList: updated,
      totalAmount,
      packingCharge
    }));
  };

  const handleAddressChange = (field, value) => {
    setSelectedOrder((prev) => ({
      ...prev,
      deliveryAddress:value,
      
    }));
  };
  const handleImageChange = (field: "image" | "packedItemsPhoto", file?: File) => {
    if (file) {
      setImageFiles((prev) => ({ ...prev, [field]: file }));
      setPreviewImages((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const handleImageUpload = async (
    file: File,
    fileNamePrefix: string,
    orderId: string
  ): Promise<string> => {
    const path = `images/CSC/orderLrImage/${orderId}_${fileNamePrefix}.jpg`; // consistent path
    const imgRef = storageRef(storage, path);
    const snapshot = await uploadBytes(imgRef, file);
    return await getDownloadURL(snapshot.ref);
  };
  
  const [imageFiles, setImageFiles] = useState<{
    image?: File;
    packedItemsPhoto?: File;
  }>({});

  const [previewImages, setPreviewImages] = useState<{
    image?: string;
    packedItemsPhoto?: string;
  }>({});

  const lrnumberChange = (field, value) => {
    // console.log(value);
    setSelectedOrder((prev) => ({
      ...prev,
      lrNumber:value,
      
    }));
  };

  const transportNameChange = (field, value) => {
    // console.log(value);
    setSelectedOrder((prev) => ({
      ...prev,
      transportName:value,
      
    }));
  };


  const handlePrintOrderDetails = () => {
    if (!selectedOrder || !setting) return;
  
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;
  
    const htmlContent = renderToStaticMarkup(
      <OrderDetailPrint order={selectedOrder} setting={setting} />
    );
  
    const fullHtml = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Order ${selectedOrder.orderId}</title>
          <script>
            window.onload = function() {
              window.print();
            };
           
          </script>
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #000;
            }
            h1, h2, h3, h4 {
              margin: 0;
              padding: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
            .text-right {
              text-align: right;
            }
            .text-left {
              text-align: left;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;
  
    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  };
  
  const handleGenerateAndSharePDF = async () => {
    try {
      const html = renderToStaticMarkup(
        <OrderDetailPrint order={selectedOrder} setting={setting} />
      );
  
      const functions = getFunctions();
      const generatePdf = httpsCallable(functions, "generatePdf");
  
      const result = await generatePdf({
        html,
        fileName: `Order-${selectedOrder.orderId}`,
      });

      const pdfUrl = result.data?.mediaUrl || '';

      console.log(pdfUrl);

      // const sendMessage = httpsCallable(functions, "sendWhatsAppMessageOrderPlace");

      // const whatsappResult = await sendMessage({
      //   phone: `+91${selectedOrder.customer?.mobileNo}`,
      //   templateId: 'HX185e28f40f2e20c013e24d33fe5aa50f',
      //   templateParams: {
      //     1: `${selectedOrder.custName}`,
      //     2: `${selectedOrder.orderId}`,
      //     3: `Order-${selectedOrder.orderId}`,
      //   },
      //   mediaUrl: `${pdfUrl}`
      // });

      // console.log("WhatsApp Response:", whatsappResult.data);
  
      // toast.success("✅ Order copy sent via WhatsApp");
    } catch (error) {
      console.error("Error sending PDF:", error);
      toast.error("❌ Failed to send PDF");
    }
  };

  const handleGenerateAndSharePDFOld = async () => {
    const html = renderToStaticMarkup(
      <OrderDetailPrint order={selectedOrder} setting={setting} />
    );
  
    const response = await fetch(
      "https://us-central1-CSC-crackers.cloudfunctions.net/generatePdf",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html,
          fileName: `Order-${selectedOrder.orderId}`,
        }),
      }
    );
  
    if (!response.ok) {
      toast.error("Failed to generate PDF");
      return;
    }
  
    const blob = await response.blob();
    const pdfFile = new File([blob], `Order-${selectedOrder.orderId}.pdf`, {
      type: "application/pdf",
    });
  
    // if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    //   try {
    //     await navigator.share({
    //       title: "Order Copy",
    //       text: `Order ID: ${selectedOrder.orderId}`,
    //       files: [pdfFile],
    //     });
    //   } catch (err) {
    //     console.error("Sharing failed", err);
    //     toast.error("Sharing cancelled or failed");
    //   }
    // } else {
    //   // fallback for unsupported devices
    //   const link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.download = pdfFile.name;
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();
    //   toast.info("File downloaded. Sharing not supported on this device.");
    // }
  };
  
    // const newWindow = window.open("", "_blank", "width=900,height=650");
    // if (!newWindow) return;
  
    // newWindow.document.write(`
    //   <html>
    //     <head>
    //       <title>Estimation</title>
    //       <style>
    //         body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
    //         table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    //         th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
    //         th { background-color: #f2f2f2; }
    //       </style>
    //     </head>
    //     <body>
    //       ${printContent.innerHTML}
    //     </body>
    //   </html>
    // `);
  
    // newWindow.document.close();
    // newWindow.onload = () => {
    //   newWindow.focus();
    //   setTimeout(() => {
    //     newWindow.print();
    //   }, 500);
    // };
  // };

  const handlePrint = () => {
    const printContent = document.getElementById("print-section");
    if (!printContent) return;
  
    const newWindow = window.open("", "_blank", "width=900,height=650");
    if (!newWindow) return;
  
    newWindow.document.write(`
      <html>
        <head>
          <title>Order List Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2 style="text-align: center;">Customer Orders Report</h2>
          ${printContent.innerHTML}
          <p style="text-align:center; margin-top: 20px;">If print dialog does not appear, use your browser's menu to print manually.</p>
        </body>
      </html>
    `);
  
    newWindow.document.close();
  
    // Wait for newWindow to load content before calling print
    newWindow.onload = () => {
      newWindow.focus();
  
      // Try to print after slight delay for better mobile compatibility
      setTimeout(() => {
        newWindow.print();
      }, 1000); // Can increase to 1000ms if needed
    };
  };
   
  
const statusSteps = [
  { key: "orderPlaced", label: "Order Confirmed", icon: <Box /> },
  { key: "payment", label: "Payment", icon: <Package /> },
  { key: "shipped", label: "Shipped", icon: <Truck /> },
  { key: "delivered", label: "Delivered", icon: <CheckCircle2 /> },
  { key: "pending", label: "Pending", icon: <MdPending /> },
  
];
  const handleAddProduct = (newProduct) => {
    
    const updated = [...(selectedOrder.billProductList || []), newProduct];
    const totalAmount = updated.reduce((acc, cur) => acc + cur.qty * cur.salesPrice, 0);

    setSelectedOrder((prev) => ({
      ...prev,
      billProductList: updated,
      totalAmount,
    }));
  };
const handelRemoveProduct = (productToRemove) => {
  const updatedList = selectedOrder.billProductList.filter(
    (item) => item.productId !== productToRemove.productId
  );

  // Recalculate totalAmount and packingCharge
  const totalAmount = updatedList.reduce(
    (acc, cur) => acc + cur.qty * cur.salesPrice,
    0
  );
  const packingCharge = totalAmount * (localSetting[0]?.packageCharge || 0) / 100;

  setSelectedOrder((prev) => ({
    ...prev,
    billProductList: updatedList,
    totalAmount,
    packingCharge,
  }));
};

// Sanitize phone numbers
const sanitizePhone = (phone: string) => {
  if (!phone) return '';
  
  // Trim and remove internal spaces
  const trimmed = phone.trim().replace(/\s+/g, '');

  // If starts with + and followed by digits, keep as is
  if (/^\+\d+$/.test(trimmed)) {
    return trimmed;
  }

  // If starts with 91 and 10-digit number, add '+'
  const digits = trimmed.replace(/\D/g, ''); // remove all non-digits
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.startsWith('91') && digits.length === 12) {
    return `+${digits}`;
  }

  // Fallback: just add + before digits
  return `+${digits}`;
};

const updateOrder=async()=>{

    const updatedOrder = { ...selectedOrder };

    const originalOrderSnap = await getSingleCustomerOrder(selectedOrder.customer.id, selectedOrder.billNo);
    const originalOrder = originalOrderSnap;
    // console.log(originalOrder);

    if (imageFiles.image) {
        updatedOrder.image = await handleImageUpload(
        imageFiles.image,
        "transportCopy",
        selectedOrder.orderId
      );

      // updatedOrder.image = await handleImageUpload(imageFiles.image, "transportCopy");
    }

    if (imageFiles.packedItemsPhoto) {
      updatedOrder.packedItemsPhoto = await handleImageUpload(
        imageFiles.packedItemsPhoto,
        "packedItems",
        selectedOrder.orderId
      );
      // updatedOrder.packedItemsPhoto = await handleImageUpload(imageFiles.packedItemsPhoto, "packedItems");
    }

    await getupdateCustomerOrders(updatedOrder.customer.id,updatedOrder.billNo,updatedOrder);

    if (!originalOrder) {
      console.error("Original order not found.");
      setToggle(!toggle);
      return; // Or handle the error as needed
    }
    // Compare statuses and send message
    const { statuses } = updatedOrder;

    const functions = getFunctions();
    // const sendStatusMessage = httpsCallable(functions, 'sendWhatsAppMessageOrderStatus');
    const sendPackedShippedMessage = httpsCallable(functions, 'sendWhatsAppMessagePackedShipped');

    const customerPhone = sanitizePhone(updatedOrder.customer?.mobileNo || "");


    if (statuses.shipped === 'true' && originalOrder.statuses?.shipped !== 'true') {
      await sendPackedShippedMessage({
        phone: customerPhone,
        templateId: 'HXd3763b69402c5a2bb6340bc2fd5b17f1',
        templateParams: {
          1: updatedOrder.custName,
          2: updatedOrder.billNo,
          3: 'Shipped',
          4: 'Your order is on its way. Wish you a very wonderful diwali to your family. We expect more orders from your side...',
          5: `Transport Name: ${updatedOrder.transportName}, LR No: ${updatedOrder.lrNumber}`,
          6: `${updatedOrder.billNo}_transportCopy`, 
        },
        mediaUrl: updatedOrder.image,
      });
    }
  
    setToggle(!toggle);
  }
  if(!setting)
{
  return
}

  return (
    <>
    <div className="p-6 max-w-7xl mx-auto">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Customers Orders</h1>
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FaPrint className="text-white" />
            Print Orders List
          </button>
        </div>
      {!selectedOrder ? (
        <>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by Name, Mobile No, or Bill No"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-wrap gap-2">
              {statusSteps.map(({ key, label }) => (
                <Button
                  key={key}
                  variant={statusFilters[key] ? "default" : "outline"}
                  onClick={() => toggleStatus(key)}
                  className="capitalize"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          {/* <div className="flex gap-3 items-center justify-center">

           <AddProductToShop/>
           <EditProduct/>
          </div> */}
          <div className="overflow-x-auto shadow-md border rounded-lg">
           <div id="print-section">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Mobile Number</th>
                    <th className="p-3">Order Id</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Total Products</th>
                    <th className="p-3">Amount (₹)</th>
                    <th className="p-3">Confirmed</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Shipped</th>
                    <th className="p-3">Delivered</th>
                    <th className="p-3 print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50 border-t">
                      <td className="p-3">{order.custName}</td>
                      <td className="p-3">{order.customer?.mobileNo}</td>
                      <td className="p-3">{order.billNo}</td>
                      <td className="p-3">{order.date}</td>
                      <td className="p-3">{order.totalProducts}</td>
                      <td className="p-3">₹{order.totalAmount || 0}</td>
                      <td className="p-3">{renderStatusIcon(order.statuses?.orderPlaced)}</td>
                      <td className="p-3">{renderStatusIcon(order.statuses?.payment)}</td>
                      <td className="p-3">{renderStatusIcon(order.statuses?.shipped)}</td>
                      <td className="p-3">{renderStatusIcon(order.statuses?.delivered)}</td>
                      <td className="p-3 print:hidden">
                        <button
                          onClick={() => handleOrderClick(order)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="12" className="text-center p-4 text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 shadow rounded border">
            <Button onClick={handleBack} className="mb-4">
              ← Back to Orders
            </Button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Order Details</h2>
            
              
              <div className="flex justify-between items-center mb-4">
                <Button onClick={()=>updateOrder()}>Save</Button>
                <div className="print:hidden flex gap-2 justify-end mb-2">
                  <button
                    onClick={handlePrintOrderDetails}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 cursor-pointer"
                  >
                    <FaPrint />
                    Print
                  </button>
                  <button
                   onClick={handleGenerateAndSharePDF}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
                  >
                    <FaShare />
                    Share
                  </button>
                </div>
              </div> 
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
              <div>
                <p><strong>Customer Name:</strong> {selectedOrder.custName}</p>
                <p><strong>Mobile No:</strong> {selectedOrder.customer?.mobileNo}</p>
                <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                <p><strong>Bill No:</strong> {selectedOrder.billNo}</p>
              </div>
            
              <div>
                <p><strong>Date:</strong> {selectedOrder.date}</p>
                <p><strong>Total Products:</strong> {selectedOrder.totalProducts}</p>
                <p><strong>Product Amount:</strong> ₹{selectedOrder.totalAmount || 0}</p>
                <p><strong>PackingCharge:</strong> ₹{selectedOrder.packingCharge || 0}</p>
                <p><strong>Total Amount:</strong> ₹{selectedOrder.packingCharge 
                + selectedOrder.totalAmount || 0}</p>
                <p className="mt-2">
                  <strong>Billing Address:</strong>
                  <input
                    type="text"
                    className="w-full border mt-1 p-2 rounded"
                    value={selectedOrder.deliveryAddress || ""}
                    onChange={(e) => handleAddressChange("deliveryAddress", e.target.value)}
                  />
                </p>
                {selectedOrder.upiimage&& <><p><strong>UPI Image</strong></p>
                 <img src={selectedOrder.upiimage} alt="image" /></>}
                <div className="mt-4">
                  <label className="block font-semibold mb-1">Transport Copy Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange("image", e.target.files?.[0])}
                    className="border p-2 rounded w-full"
                  />

                  {/* Preview newly selected image */}
                  {imageFiles.image && (
                    <img
                      src={URL.createObjectURL(imageFiles.image)}
                      alt="Transport Copy Preview"
                      className="mt-2 w-32 h-32 object-cover border rounded"
                    />
                  )}

                  {/* Preview existing uploaded image if no new image selected */}
                  {!imageFiles.image && selectedOrder.image && (
                    <img
                      src={selectedOrder.image}
                      alt="Transport Copy"
                      className="mt-2 w-32 h-32 object-cover border rounded"
                    />
                  )}
                </div>

                <div className="mt-4">
                  <label className="block font-semibold mb-1">Packed Items Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange("packedItemsPhoto", e.target.files?.[0])}
                    className="border p-2 rounded w-full"
                  />

                  {/* Preview newly selected image */}
                  {imageFiles.packedItemsPhoto && (
                    <img
                      src={URL.createObjectURL(imageFiles.packedItemsPhoto)}
                      alt="Packed Items Preview"
                      className="mt-2 w-32 h-32 object-cover border rounded"
                    />
                  )}

                  {/* Preview existing uploaded image if no new image selected */}
                  {!imageFiles.packedItemsPhoto && selectedOrder.packedItemsPhoto && (
                    <img
                      src={selectedOrder.packedItemsPhoto}
                      alt="Packed Items"
                      className="mt-2 w-32 h-32 object-cover border rounded"
                    />
                  )}
                </div>
                <p className="mt-2">
                  <strong>Transport Name</strong>
                  <input
                    type="text"
                    className="w-full border mt-1 p-2 rounded"
                    value={selectedOrder.transportName || ""}
                    onChange={(e) => transportNameChange("transportName", e.target.value)}
                  />
                </p>
                <p className="mt-2">
                  <strong>LR Number</strong>
                  <input
                    type="text"
                    className="w-full border mt-1 p-2 rounded"
                    value={selectedOrder.lrNumber || ""}
                    onChange={(e) => lrnumberChange("lrNumber", e.target.value)}
                  />
                </p>
              </div>
            </div>
              {/* <div>
                {["orderPlaced", "payment", "shipped", "delivered"].map((statusKey) => (
                          <div key={statusKey}>
                            <label className="text-xs capitalize mr-1">{statusKey}:</label>
                            <select
                              className="border rounded px-1 py-0.5 text-xs"
                              value={selectedOrder.statuses?.[statusKey] || "false"}
                              onChange={(e) =>
                                handleProductStatusChange(index, statusKey, e.target.value)
                              }
                            >
                              <option value="true">✅</option>
                              <option value="false">❌</option>
                            </select>
                          </div>
                        ))}
              </div> */}
          <div className="w-full mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 relative">
              {statusSteps
                .filter((step) => step.key !== "pending") // Exclude "pending" from the update view
                .map((step, index) => {
                const completed = selectedOrder.statuses?.[step.key] === "true";
                const isLast = index === statusSteps.length - 2;

              return (
                <div key={step.key} className="flex flex-col items-center flex-1 relative">
                  {/* Connecting line */}
                  {!isLast && (
                    <div className="absolute top-5 left-1/2 w-full h-1 bg-gray-300 z-0 hidden md:block">
                      <div
                        className={`h-1 ${
                          selectedOrder.statuses?.[statusSteps[index + 1].key] === "true"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : "bg-gray-300"
                        }`}
                        style={{ width: "100%" }}
                      />
                    </div>
                  )}

                  {/* Step icon */}
                  <div
                    className={`z-10 w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                      completed
                        ? "bg-gradient-to-r from-yellow-400 to-red-500 text-white border-green-500"
                        : "bg-white text-gray-400 border-gray-300"
                    }`}
                    onClick={() =>
                    setSelectedOrder((prev) => ({
                      ...prev,
                      statuses: {
                        ...prev.statuses,
                        [step.key]: completed ? "false" : "true",
                      },
                    }))
                  }
                  >
                    {step.icon}
                  </div>

                  {/* Label */}
                  <span
                    className={`mt-2 text-sm text-center font-medium ${
                      completed ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          </div>

          <div className="overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Product List</h3>
                {/* <Button onClick={handleAddProduct} className="text-sm">+ Add Product</Button> */}
                <AdminProduct handleAddProduct={handleAddProduct}/>
              </div>
              <table className="w-full table-auto text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Price (₹)</th>
                    <th className="p-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.billProductList?.map((product, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {product.productImageURL && (
                            <img
                              src={product.productImageURL}
                              alt=""
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <span className="text-sm">{product.productName}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="w-16 border rounded p-1"
                          value={product.qty}
                          onChange={(e) =>
                            handleProductChange(index, "qty", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          className="w-20 border rounded p-1"
                          value={product.salesPrice}
                          onChange={(e) =>
                            handleProductChange(index, "salesPrice", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-2">
                        <button onClick={() => handelRemoveProduct(product)}>
                          <MdDeleteForever className="text-xl text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>          
          </div>
        </div>
      </div>
        )}
      </div>  
      </>
  );
};

export default Admin;
