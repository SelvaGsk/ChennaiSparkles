//@ts-nocheck
import { Route, Routes } from "react-router-dom"
import Hero from "./pages/Hero"
import MainNav from "./components/nav/MainNav"
import SubNav from "./components/nav/SubNav"
import Login from "./pages/Login"
import OrderTrack from "./pages/OrderTrack"
import AboutUs from "./pages/AboutUs"
import ContactUsPage  from "./pages/Contactus"
import Shop from "./pages/Shop"
import Cart from "./pages/Cart"
import WishList from "./pages/WishList"
import CheckOut from "./pages/CheckOut"
import { useFirebase } from "./Services/context"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useEffect, useRef, useState } from "react"
import Register from "./pages/Register"
import RegisterDialog from "./components/RegisterDialog"
import { FaWhatsapp } from "react-icons/fa6"
import Admin from "./pages/Admin"
import ProductAdministration from "./pages/ProductAdministration"
import CategoryAdministration from "./pages/CategoriesAdmin"
import Termsandconditions from "./pages/TermsAndConditions"
import { useNavigate } from "react-router-dom";
import { FaShoppingBag, FaShoppingCart } from 'react-icons/fa';
import { ShoppingBag, ShoppingBasket, ShoppingBasketIcon, ShoppingCart } from "lucide-react"
import { CiShoppingCart } from "react-icons/ci"
import { FiShoppingCart } from "react-icons/fi"
import { useLocation } from "react-router-dom";
import Unauthorized from "./pages/Unauthorized"; 
import RequireAdmin from './components/RequireAdmin';
import SocialNavBar from "./components/SocialNav";
// import Modal from './components/Modal'
import Modal from "./components/modal";

const App = () => {
  const { setting, products, cartItems, TAGS, user, getUser, setdbUser, userloading } = useFirebase();
  const [openDialog, setOpenDialog] = useState(false);
  const [isNewUser, setNewUser] = useState(false);
  const [toggle, settoggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('modal-shown');
    if (!alreadyShown) {
      setShowModal(true);
      sessionStorage.setItem('modal-shown', 'true');
    }
  }, []);

  const whatsappRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const navigate = useNavigate(); // for redirection

  // In your layout or App.tsx where floating icons are rendered
  const location = useLocation();
  const hideFloatingButtons = location.pathname === "/shop" || location.pathname === "/cart" || location.pathname === "/admin" ||
                              location.pathname === "/shop/multibrand" || location.pathname === "/shop/standard";
  
                              
  // 👇 Set initial position to bottom-right
  useEffect(() => {
    setPosition({
      x: window.innerWidth - 80,
      y: window.innerHeight - 100
    });
  }, []);

  // 👇 Handle dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setPosition({
          x: Math.max(0, Math.min(e.clientX - offset.x, window.innerWidth - 60)),
          y: Math.max(0, Math.min(e.clientY - offset.y, window.innerHeight - 60)),
        });
      }
    };

    const handleMouseUp = () => setDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  useEffect(() => {
    const userChk = async () => {
      const dbUser = await getUser();
      if (!dbUser && user) {
        setNewUser(true);
        setOpenDialog(true);
      }
      if (dbUser) {
        setNewUser(false);
        setdbUser(dbUser);
      }
    };
    userChk();
  }, [user, toggle]);

  const onProfileClick = () => {
    setOpenDialog(!openDialog);
    setNewUser(true);
  };

  if (!setting && !(products.length > 0) && !TAGS && userloading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src="/loader.svg" className="w-[200px] h-[100px] text-4xl" />
      </div>
    );
  }

  const handleMouseDown = (e) => {
    const rect = whatsappRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDragging(true);
  };

  const openShopListView = () => {
    navigate("/shop/multibrand?view=list");
  };

  const openWhatsApp = () => {
    const phoneRaw = setting[0]?.CellNO || '';
    const phone = phoneRaw.replace(/\s+/g, ''); // Removes all spaces
    const message = encodeURIComponent("Hi! I want to inquire about your products.");
    // console.log( `https://wa.me/${phone}?text=${message}`);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  

  return (
    <>
      <Modal isOpen={showModal} onClose={handleCloseModal} />
      <MainNav onProfileClick={onProfileClick} />
      <SubNav />
      <SocialNavBar/>
      <Routes>
        <Route path='/' element={<Hero />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/track-order' element={<OrderTrack />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='/Contactus' element={<ContactUsPage  />} />
        <Route path='/shop/standard' element={<Shop isStandardCrackers={true}/>} />
        <Route path='/shop/multibrand' element={<Shop isStandardCrackers={false}/>} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<WishList />} />
        <Route path='/checkout' element={<CheckOut />} />
        <Route path='/termsandconditions' element={<Termsandconditions />} />
        <Route path='/admin' element={<RequireAdmin><Admin /></RequireAdmin>} />
        <Route path='/product-admin' element={<RequireAdmin><ProductAdministration /> </RequireAdmin>} />
        <Route path='/category-admin' element={<RequireAdmin> <CategoryAdministration /> </RequireAdmin>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>

      {isNewUser && user?.email && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-3xl">
            <RegisterDialog settoggle={settoggle} toggle={toggle} />
          </DialogContent>
        </Dialog>
      )}

    {!hideFloatingButtons && (
      <div className="fixed z-50 bottom-6 right-6 flex flex-col items-center gap-4">
        {/* 🔵 Quick Shop Button */}
        {/* <div
          onClick={openShopListView}
          className="flex flex-col items-center text-center cursor-pointer"
        >
          <div className="bg-white hover:bg-blue-100 border border-blue-500 shadow-lg p-3 rounded-full transition-colors duration-200">
            <FiShoppingCart size={22} className="text-blue-600" />
          </div>
          <span className="text-sm text-blue-600 font-semibold mt-1">Quick Shop</span>
        </div> */}

        {/* 🟢 WhatsApp Floating Button */}
        <div
          ref={whatsappRef}
          onMouseDown={handleMouseDown}
          onClick={openWhatsApp}
          className="bg-gradient-to-r from-yellow-400 to-red-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg cursor-move"
        >
          <FaWhatsapp size={28} />
        </div>
      </div>
    )}
    
        
    </>
  );
};

export default App;
