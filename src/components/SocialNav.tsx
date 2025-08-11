//@ts-nocheck
// SocialNavBar.tsx
import { FaYoutube, FaFacebookF, FaInstagram, FaGooglePlay, FaChevronDown } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { useFirebase } from '@/Services/context';

const SocialNavBar = () => {

  const { setting } = useFirebase();
  if (!setting) {
    return;
  }

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
      <div className="relative group">
        <button className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <span className="mr-2">Store Locator</span>
          <FaChevronDown />
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-50">
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Adayar Signal</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">ECR Kottivakkam (Near University Colony)</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">ECR Neelangarai (Near Police Station)</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Navalur (Near Vivira Mall)</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Thalambur (Near Greenwood City)</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Padur (Near Hindustan College)</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Kelambakkam (Near SHELL PETROL BUNK)</a>
          <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sholinganallur (Near Naturals Saloon ELCOT Avenue)</a>
        </div>
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
