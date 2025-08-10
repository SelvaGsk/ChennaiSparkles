//@ts-nocheck
// SocialNavBar.tsx
import { FaYoutube, FaFacebookF, FaInstagram, FaTwitter, FaGooglePlay } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { useFirebase } from '@/Services/context';

const SocialNavBar = () => {

  const {setting}=useFirebase();
  if(!setting)
  {
    return;
  }

  return (
    <div className="w-full bg-purple-100 py-4 px-6 flex flex-wrap justify-center gap-4">
      
      <SocialButton
        icon={<BsWhatsapp className="text-green-500" />}
        label="+91 72001 94643"
        href="https://wa.me/917200194643"
      />
      <SocialButton
        icon={<FaYoutube className="text-red-600" />}
        label="YouTube"
        href= {setting[0]?.YouTube || "#"}
      />
      <SocialButton
        icon={<FaFacebookF className="text-blue-600" />}
        label="Facebook"
        href={setting[0]?.facebook || "#"}
      />
      <SocialButton
        icon={<FaInstagram className="text-pink-600" />}
        label="Instagram"
        href= {setting[0]?.instagram || "#"}
      />
      <SocialButton
        icon={<FaGooglePlay className="text-sky-500" />}
        label="Google Play Store"
        href="https://play.google.com/store/apps/details?id=com.BullsInfoTech.ChennaiSparkleCrackers"
      />
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
