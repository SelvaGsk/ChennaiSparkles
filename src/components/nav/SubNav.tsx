//@ts-nocheck


import { Button } from "@/components/ui/button";
import { FiPhone, FiPhoneCall, FiSmartphone } from "react-icons/fi";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useFirebase } from "@/Services/context";
import { FaPhone } from "react-icons/fa6";
import { FcIphone, FcPhone, FcTouchscreenSmartphone } from "react-icons/fc";

const SubNav = () => {
  const navigate = useNavigate();
  const {setting}=useFirebase();
  // console.log(setting);
  if(!setting)
  {
    return;
  }

  const downloadPriceList = () => {
    const url = setting[0]?.pdfURL;
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = "CSC PriceList.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    } else {
      alert("Price list is not available at the moment.");
    }
  };

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center justify-center gap-15 p-4 bg-gray-50">
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/')}>Home</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/shop')}>Shop</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/track-order')}>Track Order</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/Wishlist')}>Wish List</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/Aboutus')}>About Us</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/Contactus')}>Contact Us</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/termsandconditions')}>T&C</p>
        <Button onClick={downloadPriceList} className="bg-gradient-to-r from-yellow-400 to-red-500 text-white">Download Price List</Button>


        <div className="flex items-center justify-end ml-4 gap-4 flex-wrap">
          <div className="flex items-center">
            <FiPhoneCall size={20} />
            <a href={`tel:${setting[0]?.CellNO}`} className="font-semibold ml-2 pr-2 text-blue-600 hover:underline">
              {setting[0]?.CellNO}
            </a>
          </div>

          <div className="flex items-center">
            <FiSmartphone size={20} />
            <a href={`tel:${setting[0]?.OfficeNo}`} className="font-semibold ml-2 text-blue-600 hover:underline">
              {setting[0]?.OfficeNo}
            </a>
          </div>
        </div>

      </div>

      {/* Mobile Nav */}
      {/* Mobile Nav */}
<div className="md:hidden bg-gray-50 flex items-center justify-between px-4 py-2">
  {/* Mobile Menu */}
  <div className="">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Menu className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-56 rounded-md bg-white shadow-lg border p-2 space-y-1"
      >
        <DropdownMenuItem onClick={() => navigate('/')}>Home</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/shop')}>Shop Now</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/Wishlist')}>Wish List</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/Cart')}>My Cart</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/track-order')}>Track Order</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/aboutus')}>About Us</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/contactus')}>Contact Us</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/termsandconditions')}>Terms & Conditions</DropdownMenuItem>
        <DropdownMenuItem onClick={downloadPriceList}>Download Price List</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  {/* Phone Number */}
  {/* <div className="flex items-center justify-end">
     <FiPhoneCall size={20} />
          <p className="font-semibold ml-2 pr-2">{setting[0]?.CellNO}</p>
          <FiSmartphone size={20} />
          <p className="font-semibold ml-2">{setting[0]?.OfficeNo}</p>
  </div> */}
  <div className="flex flex-col items-end space-y-1">
    <div className="flex items-center">
      <FiPhoneCall className="w-4 h-4 mr-1 text-green-600" />
      <a
        href={`tel:${setting[0]?.CellNO}`}
        className="text-blue-600 text-sm hover:underline"
      >
        {setting[0]?.CellNO}
      </a>
    </div>

    <div className="flex items-center">
      <FiSmartphone className="w-4 h-4 mr-1 text-green-600" />
      <a
        href={`tel:${setting[0]?.OfficeNo}`}
        className="text-blue-600 text-sm hover:underline"
      >
        {setting[0]?.OfficeNo}
      </a>
    </div>
</div>
  
</div>

    </>
  );
};

export default SubNav;
