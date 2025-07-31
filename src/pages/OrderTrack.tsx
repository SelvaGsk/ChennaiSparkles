// @ts-nocheck
import Footer from "@/components/Footer";
import { useFirebase } from "@/Services/context";
import { database } from "@/Services/Firebase.config.js";

import { onValue, ref } from "firebase/database";
import {
  Truck,
  CalendarCheck2,
  PackageCheck,
  AlertCircle,
  CheckCircle2,
  Box,
  Package,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const statusSteps = [
  { key: "orderPlaced", label: "Order Confirmed", icon: <Box /> },
  { key: "payment", label: "Payment", icon: <Package /> },
  { key: "shipped", label: "Shipped", icon: <Truck /> },
  { key: "delivered", label: "Delivered", icon: <CheckCircle2 /> },
];

const OrderTrack = () => {
  const [orders, setOrders] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useFirebase();

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     const fetched = await getOrders();
  //     setOrders(fetched || {});
  //   };
  //   if (user) fetchOrders();
  // }, [user,getOrders]);

  useEffect(() => {
    if (!user) return;
    const cartRef = ref(database, `CSC/CustomerOrder/${user.uid}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      // setOrders(snapshot.exists() ? snapshot.val() : {});

      const rawData = snapshot.exists() ? snapshot.val() : {};
      // Filter out deleted orders
      const filteredData = Object.fromEntries(
        Object.entries(rawData).filter(([_, order]) => !order.delete)
      );
      setOrders(filteredData);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Track Your Order | Chennai Sparkle Crackers Online</title>
        <meta
          name="description"
          content="Track your Chennai Sparkle Crackers order in real-time. Get shipping status and delivery updates instantly."
        />
        <meta
          name="keywords"
          content="track crackers order, fireworks delivery status, order tracking sivakasi, Chennai Sparkle Crackers shipping"
        />
        <meta
          property="og:title"
          content="Track Your Chennai Sparkle Crackers Order"
        />
        <meta
          property="og:description"
          content="Easily track your fireworks order placed at Chennai Sparkle Crackers. Quick delivery from Sivakasi."
        />
        <meta property="og:image" content="/meta/track-order.jpg" />
        <meta property="og:url" content="https://ChennaiSparkleCrackers.com/track-order" />
      </Helmet>
      <section className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10 space-y-10">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Track Your Order
          </h2>

          {/* Order List */}
          {orders && Object.keys(orders).length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
              <h3 className="text-2xl font-semibold text-gray-700">
                No orders found
              </h3>
              <p className="text-gray-500 mt-2">
                You haven’t placed any orders yet. Start shopping now!
              </p>
              <img
                src="/empty-box.png"
                alt="No Orders"
                className="w-52 mx-auto mt-6 opacity-80"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(orders).map(([key, order]) => (
                <div
                  key={key}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white border border-blue-100 hover:border-blue-400 p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
                >
                  <h4 className="text-lg font-bold text-blue-800">
                    Order #{order.billNo}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.customer?.accounterName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.deliveryAddress}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.billProductList.length} items
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">
                      Placed: {order.date}
                    </p>
                    <p className="text-sm font-semibold text-green-700">
                      ₹
                      {(order.totalAmount + (order.packingCharge ?? 0)).toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Order Summary */}
          {selectedOrder && (
            <div className="mt-10 border-t pt-6 space-y-10">
              <h3 className="text-2xl font-bold text-gray-800">
                Order Summary
              </h3>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-blue-100 p-6 rounded-xl shadow-md">
                  <PackageCheck
                    className="mx-auto mb-2 text-blue-600"
                    size={32}
                  />
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-xl font-semibold text-blue-700">
                    #{selectedOrder.billNo}
                  </p>
                </div>
                <div className="bg-green-100 p-6 rounded-xl shadow-md">
                  <Truck className="mx-auto mb-2 text-green-600" size={32} />
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="text-base font-medium text-green-700">
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-xl shadow-md">
                  <CalendarCheck2
                    className="mx-auto mb-2 text-yellow-600"
                    size={32}
                  />
                  <p className="text-sm text-gray-500">Placed On</p>
                  <p className="text-base font-medium text-yellow-700">
                    {selectedOrder.date}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  Order Status
                </h4>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {statusSteps.map((step, index) => {
                    const completed =
                      selectedOrder.statuses?.[step.key] === true ||
                      selectedOrder.statuses?.[step.key] === "true";
                    const isShippedStep = step.key === "shipped";
                    const isOrderPlacedStep = step.key === "orderPlaced";
                    // console.log(completed)
                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center gap-1 relative text-center"
                      >
                        {/* Step */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`rounded-full p-2 ${
                              completed
                                ? "bg-gradient-to-r from-yellow-400 to-red-500 text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {step.icon}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              completed ? "text-green-700" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </span>
                          {index < statusSteps.length - 1 && (
                            <ArrowRight className="text-gray-300 mx-2 hidden md:block" />
                          )}
                        </div>

                        {/* Additional Info */}
                        {isOrderPlacedStep && !completed && (
                          <span className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            Pending verification
                          </span>
                        )}
                        {isShippedStep && selectedOrder.transportName && (
                          <span className="text-xs text-orange-500 mt-1">
                            Transport Name: {selectedOrder.transportName}
                          </span>
                        )}
                        {isShippedStep && selectedOrder.lrNumber && (
                          <span className="text-xs text-orange-500 mt-1">
                            LR: {selectedOrder.lrNumber}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  Items
                </h4>
                <div className="overflow-x-auto rounded-xl">
                  <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="p-4 text-left">Product</th>
                        <th className="p-4 text-center">Before Discount</th>
                        <th className="p-4 text-center">Offer Price</th>
                        <th className="p-4 text-center">Quantity</th>
                        <th className="p-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-gray-700">
                      {selectedOrder.billProductList?.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="p-4">{item.productName}</td>
                          <td className="p-4 text-center text-red-500 line-through">
                            ₹{item.beforeDiscPrice?.toFixed(2)}
                          </td>
                          <td className="p-4 text-center text-green-600 font-semibold">
                            ₹{item.salesPrice?.toFixed(2)}
                          </td>
                          <td className="p-4 text-center">{item.qty}</td>
                          <td className="p-4 text-right font-semibold">
                            ₹{(item.qty * item.salesPrice)?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-right text-xl font-bold text-gray-800 mt-4">
                  PackingCharge: ₹
                  {(selectedOrder.packingCharge ?? 0)?.toFixed(2)}
                </div>
                <div className="text-right text-xl font-bold text-gray-800 mt-4">
                  Total: ₹
                  {(
                    selectedOrder.totalAmount +
                    (selectedOrder.packingCharge ?? 0)
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default OrderTrack;
