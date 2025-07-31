//@ts-nocheck

import Footer from "@/components/Footer";
import { Mail, MapPin, Phone } from "lucide-react";
import { useFirebase } from "@/Services/context";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import emailjs from "@emailjs/browser";

const Contactus = () => {
  const { setting } = useFirebase();
  if (!setting) {
    return;
  }
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await emailjs.send(
        "service_5t695g5", // Replace with your actual EmailJS Service ID
        "template_mw0d9ut", // Replace with your actual Template ID
        {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        },
        "6xen3VaryJzQFf-BW" // Replace with your actual Public Key
      );
      alert("Enquiry sent successfully!");

      // ✅ Reset the form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send enquiry. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Contact Chennai Sparkle Crackers | Sivakasi Crackers Supplier
        </title>
        <meta
          name="description"
          content="Reach out to Chennai Sparkle Crackers for orders, queries, or wholesale deals. We're happy to help with anything related to fireworks."
        />
        <meta
          name="keywords"
          content="contact sivakasi crackers, Chennai Sparkle Crackers contact, fireworks supplier phone, email crackers support"
        />
        <meta property="og:title" content="Contact Chennai Sparkle Crackers" />
        <meta
          property="og:description"
          content="Have questions or want to place a bulk order? Contact Chennai Sparkle Crackers, your fireworks expert from Sivakasi."
        />
        <meta property="og:image" content="/meta/contact-us.jpg" />
        <meta property="og:url" content="https://ChennaiSparkleCrackers.com/contactus" />
      </Helmet>
      <section className="bg-gray-50 min-h-screen pt-20 pb-16 px-4 md:px-10">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-600 text-lg mb-3">
            Whether you have a question, need support, or just want to share
            your thoughts, we're here to help. Our team is committed to
            providing you with the best service possible, and your feedback is
            always appreciated.
          </p>
          <p className="text-gray-600">
            Feel free to reach out to us using the form below or contact us via
            email or phone. We aim to respond to all inquiries within 24 hours
            during business days.
          </p>
        </div>

        {/* Info Cards */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Phone className="mx-auto mb-3 text-emerald-500" size={32} />
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <div className="text-gray-600">
              <a
                href={`tel:${setting[0]?.CellNO}`}
                className="block hover:underline"
              >
                {setting[0]?.CellNO}
              </a>
              <a
                href={`tel:${setting[0]?.OfficeNo}`}
                className="block hover:underline"
              >
                {setting[0]?.OfficeNo}
              </a>
            </div>
          </div>

          {/* Mail & Website Card */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Mail className="mx-auto mb-3 text-emerald-500" size={32} />
            <h3 className="text-xl font-semibold mb-2">Mail & Website</h3>
            <p className="text-gray-600">{setting[0]?.EmailID}</p>
            <p className="text-gray-600">www.ChennaiSparkleCrackers.com</p>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <MapPin className="mx-auto mb-3 text-emerald-500" size={32} />
            <h3 className="text-xl font-semibold mb-2">Address</h3>
            <p className="text-gray-600">{setting[0]?.Address}</p>
          </div>
        </div>
        {/* Map & Contact Form Section */}
        <div className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Google Map Embed */}
          <div className="w-full h-[400px]">
            <iframe
              src={`https://maps.google.com/maps?q=${setting[0]?.latitude},${setting[0]?.longitude}&z=15&output=embed`}
              // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2992.184120534329!2d-93.64845572498043!3d42.030381071206315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87ee726efad8798f%3A0xe622dd8ac1ddcb18!2sWorkiva!5e0!3m2!1sen!2sin!4v1718129386272!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <textarea
              name="message"
              rows={5}
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              required
            ></textarea>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition"
            >
              Send Enquiry
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contactus;
