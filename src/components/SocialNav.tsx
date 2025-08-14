// @ts-nocheck
// SocialNavBar.tsx
import { FaYoutube, FaFacebookF, FaInstagram, FaGooglePlay, FaChevronDown } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { useFirebase } from '@/Services/context';
import { useState, useEffect, useRef } from 'react';

const SocialNavBar = () => {  
  const { setting } = useFirebase();
  if (!setting) return null;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Optional: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-purple-100 py-4 px-6 flex flex-wrap justify-center gap-4">
      
      {/* Social Buttons */}
      <SocialButton
        icon={<BsWhatsapp className="text-green-500" />}
        label="+91 72001 94643"
        href="https://wa.me/917200194643"
      />
      <SocialButton
        icon={<FaYoutube className="text-red-600" />}
        label="YouTube"
        href={setting[0]?.YouTube || "#"}
      />
      <SocialButton
        icon={<FaFacebookF className="text-blue-600" />}
        label="Facebook"
        href={setting[0]?.facebook || "#"}
      />
      <SocialButton
        icon={<FaInstagram className="text-pink-600" />}
        label="Instagram"
        href={setting[0]?.instagram || "#"}
      />
      <SocialButton
        icon={<FaGooglePlay className="text-sky-500" />}
        label="Google Play Store"
        href="https://play.google.com/store/apps/details?id=com.BullsInfoTech.ChennaiSparkleCrackers"
      />

      {/* Store Locator Button with Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <span className="mr-2">Chennai Store Locations</span>
          <FaChevronDown />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white border rounded-md shadow-lg z-50">
            {[
              "Adayar Signal",
              "ECR Kottivakkam (Near University Colony)",
              "ECR Neelangarai (Near Police Station)",
              "Navalur (Near Vivira Mall)",
              "Thalambur (Near Greenwood City)",
              "Padur (Near Hindustan College)",
              "Kelambakkam (Near SHELL PETROL BUNK)",
              "Sholinganallur (Near Naturals Saloon ELCOT Avenue)",
            ].map((location, index) => (
              <a
                key={index}
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                {location}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SocialButton = ({ icon, label, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-white rounded-full shadow px-4 py-2 hover:scale-105 transition-transform"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
};

export default SocialNavBar;
