import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <>
    
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Booking Terms & Conditions
        </h1>

        {/* Booking Terms & Conditions */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Shipping/Transportation</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>With In Chennai Only Door Delivery Available.</li>
            <li>Out Of Chennai Districts No Door Delivery Available.</li>
            <li>Chennai Customer’s Goods Delivery On Depends On The Customer Request Date.</li>
            <li>Transportation Charges Extra</li>
            <li>Goods Cannot Be Sent Through Courier</li>
            <li>Shipping Of Goods Solely Depends On The Transporter</li>
          </ul>

          <h3 className="text-lg font-semibold mb-1">Delivery Time</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Tamilnadu - 3 Days</li>
            <li>Kerala, Andhra, Karnataka - 6 Days</li>
            <li>Rest Of India - 2 Weeks</li>
          </ul>

          <p className="text-red-600 font-bold text-lg mb-4">
            Minimum Booking Value Rs.3500
          </p>

          <h3 className="text-lg font-semibold mb-1">Modification Terms</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>
              Due To The Nature Of Fireworks Industry, The Products Are Subject To Modification
            </li>
            <li>
              If The Items You Ordered Are Not Available At The Time Of Billing/Packing, Some
              Other Product Of The Same Or More Value Will Be Sent Instead Of The Unavailable Item.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-1">Other Terms</h3>
          <ul className="list-disc list-inside text-gray-700">
            <li>E.&O.E.</li>
            <li>Agree You Are 18 Years & Above</li>
            <li>Prices Are Inclusive Of 18% GST</li>
            <li>Subject To Sivakasi Jurisdiction</li>
          </ul>
        </section>
      </div>
    </div>
    <Footer />
    </>
  );
}
