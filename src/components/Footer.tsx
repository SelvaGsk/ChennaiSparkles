//@ts-nocheck

import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaDribbble,
} from "react-icons/fa6";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { useFirebase } from "@/Services/context";
import { FiPhoneCall } from "react-icons/fi";

export default function Footer() {
  const { setting } = useFirebase();
  if (!setting) {
    return;
  }
  return (
    <footer className="bg-gray-100 text-gray-800 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Logo and Description */}
        <div>
          <img src="/logo.png" alt="Logo" className="h-10 mb-4" />
          <p className="text-sm mb-4">
            Chennai Sparkle Crackers is your one-stop destination to buy quality fireworks at the cheapest prices in Chennai. We offer a wide range of original Sivakasi crackers, fancy fireworks, and sparklers for all occasions. Celebrate safely and joyfully with trusted products from Chennai's leading cracker store.
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-green-600 mt-1" />
              <span>{setting[0]?.Address}</span>
            </div>
            <div className="flex items-start gap-2">
              <FaEnvelope className="text-green-600 mt-1" />
              <span>{setting[0]?.EmailID}</span>
            </div>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-green-600" />
                <a
                  href={`tel:${setting[0]?.CellNO}`}
                  className="text-blue-600 hover:underline"
                >
                  {setting[0]?.CellNO}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <FiPhoneCall className="text-green-600" />
                <a
                  href={`tel:${setting[0]?.OfficeNo}`}
                  className="text-blue-600 hover:underline"
                >
                  {setting[0]?.OfficeNo}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Company Links */}
        <div className="sm:text-left text-center">
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/shop" className="hover:underline">
                Shop Now
              </a>
            </li>
            <li>
              <a href="/wishlist" className="hover:underline">
                Wish List
              </a>
            </li>
            <li>
              <a href="/track-order" className="hover:underline">
                Track Order
              </a>
            </li>
            <li>
              <a href="/aboutus" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="contactus" className="hover:underline">
                Contact Us
              </a>
            </li>
            <li>
              <a href="termsandconditions" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="flex sm:justify-start justify-center lg:justify-end gap-4">
          <p
            onClick={() => {
              window.open(`${setting[0]?.facebook}`, "_blank");
            }}
            className="p-2 h-fit bg-white rounded shadow hover:bg-gray-100"
          >
            <FaFacebookF />
          </p>
          <p
            onClick={() => {
              window.open(`${setting[0]?.instagram}`, "_blank");
            }}
            className="p-2 h-fit bg-white rounded shadow hover:bg-gray-100"
          >
            <FaXTwitter />
          </p>
          {/* <a href="#" className="p-2 h-fit bg-white rounded shadow hover:bg-gray-100"><FaDribbble /></a> */}
          <p
            onClick={() => {
              window.open(`${setting[0]?.instagram}`, "_blank");
            }}
            className="p-2 h-fit bg-white rounded shadow hover:bg-gray-100"
          >
            <FaInstagram />
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t pt-4 text-center text-sm text-gray-600">
        ©{" "}
        <span className="text-green-600 font-medium">
          Bulls InfoTech Solutions
        </span>
        , All rights reserved.
      </div>
    </footer>
  );
}
