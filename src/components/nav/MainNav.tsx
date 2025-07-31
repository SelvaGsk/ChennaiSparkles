//@ts-nocheck

import { FaUser, FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/Services/context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaShop } from 'react-icons/fa6';

const MainNav = ({onProfileClick}) => {
  const { searchTerm, setSearchTerm, cartItems ,user,signOut} = useFirebase();
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/shop');
  };

  return (
    <header className="bg-white shadow-md px-4 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-12 object-contain cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        {/* Search */}
        <div className="flex w-full md:w-1/2 border border-amber-500 rounded overflow-hidden">
          <input
            type="text"
            placeholder="Search for items..."
            className="flex-1 px-4 py-2 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-amber-600 text-white"
          >
            <FaSearch />
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6">
          
          {/* Account */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <FaUser />
                <span>Account</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              {!user&&
              <div>
                <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/register')}
              >
                Register
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Login
              </div>
              </div>}
              {user&&<div>
                <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onProfileClick()}
              >
                Profile
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/admin')}
              >
                Customer Orders
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/product-admin')}
              >
                Product Master
              </div>

              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => signOut()}
              >
                LogOut
              </div>
                </div>}
            </PopoverContent>
          </Popover>

          {/* Wishlist */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/shop')}
          >
            <FaShop/>
            <span>Shop Now</span>
          </div>

          {/* Cart */}
          <div
            className="relative flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/cart')}
          >
            <FaShoppingCart />
            <span>Cart</span>
            <span className="absolute -top-2 -right-3 bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">
              {Object.keys(cartItems).length}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNav;
