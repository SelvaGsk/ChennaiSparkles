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
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useFirebase } from "@/Services/context";
import { FaPhone } from "react-icons/fa6";
import { FcIphone, FcPhone, FcTouchscreenSmartphone } from "react-icons/fc";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaShop } from 'react-icons/fa6';
import { FaDownload, FaShoppingBag  } from "react-icons/fa";

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
      link.download = "Multi Brand PriceList.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    } else {
      alert("Price list is not available at the moment.");
    }
  };
  const downloadStandardPriceList  = () => {
    const url = setting[0]?.pdfURL2;
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = "Standard PriceList.pdf";
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
       
          <div className="flex items-center gap-6 whitespace-nowrap">

          {/* Account */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer group transition-transform duration-300">
                <p className="flex items-center gap-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white px-5 py-2 rounded-full shadow-md font-semibold group-hover:scale-105 transition-all duration-300 animate-bounce">
                  <FaShoppingBag className="text-white text-sm group-hover:rotate-6 transition-transform duration-300" />
                  Shop Now
                </p>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate('/shop/multibrand')}
                >
                  MULTI BRAND CRACKERS
                </div>
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate('/shop/standard')}
                >
                  STANDARD CRACKERS
                </div>
              </div>
            </PopoverContent>
          </Popover>

        </div>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/track-order')}>Track Order</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/Wishlist')}>Wish List</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/Aboutus')}>About Us</p>
        <p className="font-semibold cursor-pointer" onClick={() => navigate('/Contactus')}>Contact Us</p>
        {/* <p className="font-semibold cursor-pointer" onClick={() => navigate('/termsandconditions')}>T&C</p> */}
        {/* <Button onClick={downloadPriceList} className="bg-gradient-to-r from-yellow-400 to-red-500 text-white">Download Price List</Button> */}

        <Popover>
          <PopoverTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer group transition-transform duration-300">
            <p className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-5 py-2 rounded-full shadow-md group-hover:scale-105 transition-all duration-300">
              <FaDownload className="text-white text-sm group-hover:animate-bounce" />
              Download Price List
            </p>
          </div>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-0">
            <div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={downloadPriceList}
              >
                MULTI BRAND CRACKERS
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={downloadStandardPriceList}
              >
                STANDARD CRACKERS
              </div>
            </div>
          </PopoverContent>
        </Popover>

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

    {/* Submenu for Shop Now */}
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Shop</DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-48 rounded-md bg-white shadow-lg border p-2 space-y-1">
        <DropdownMenuItem onClick={() => navigate('/shop/multibrand')}>MULTI BRAND CRACKERS</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/shop/standard')}>STANDARD CRACKERS</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>

    <DropdownMenuItem onClick={() => navigate('/Wishlist')}>Wish List</DropdownMenuItem>
    <DropdownMenuItem onClick={() => navigate('/Cart')}>My Cart</DropdownMenuItem>
    <DropdownMenuItem onClick={() => navigate('/track-order')}>Track Order</DropdownMenuItem>
    <DropdownMenuItem onClick={() => navigate('/aboutus')}>About Us</DropdownMenuItem>
    <DropdownMenuItem onClick={() => navigate('/contactus')}>Contact Us</DropdownMenuItem>
    <DropdownMenuItem onClick={() => navigate('/termsandconditions')}>Terms & Conditions</DropdownMenuItem>
    {/* <DropdownMenuItem onClick={downloadPriceList}>Download Price List</DropdownMenuItem> */}
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Download Price List</DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-48 rounded-md bg-white shadow-lg border p-2 space-y-1">
          <DropdownMenuItem onClick={downloadPriceList}>MULTI BRAND CRACKERS</DropdownMenuItem>
          <DropdownMenuItem onClick={downloadStandardPriceList}>STANDARD CRACKERS</DropdownMenuItem>
        </DropdownMenuSubContent>
    </DropdownMenuSub>
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
