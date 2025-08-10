//@ts-nocheck

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useFirebase } from "@/Services/context";
import { useEffect, useState } from "react";
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Button } from "@/components/ui/button"; // Replace with your button if custom

const HeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const { setting, getBannerUrls } = useFirebase();

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    getBannerUrls();
  }, []);

  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return isMobile;
  }

  const isMobileView = useIsMobile();
  if(!setting)
  {
    return <div className="flex items-center justify-center" >
      <img src="/loader.svg" className="w-[200px] h-[100px] text-4xl"/>
    </div>
  }
  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className="w-full relative">
      <CarouselContent className="flex">
        {(isMobileView ? setting[0]?.bannerImages2 : setting[0]?.bannerImages)?.map((url, index) => (
          <CarouselItem key={index}>
            <div
               className={` relative w-full overflow-hidden rounded-md group
               ${isMobileView ? "aspect-[3/1]" : "aspect-[3/1]"}
             `} >
              <img
                src={url}
                alt={`banner-${index}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102 group-hover:translate-y-[-2px]"
              />
              {/* Overlay Content */}
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-4 md:p-6">
  
                {/* Social Icons - Top Right */}
                {/* <div className="flex justify-end">
                  <div className="flex gap-4 items-center">
                    {setting[0]?.YouTube && (
                      <a href={setting[0].YouTube} target="_blank" rel="noopener noreferrer">
                        <FaYoutube className="text-red-600 text-xl md:text-2xl hover:scale-110 transition-transform" />
                      </a>
                    )}
                    {setting[0]?.facebook && (
                      <a href={setting[0].facebook} target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="text-blue-600 text-xl md:text-2xl hover:scale-110 transition-transform" />
                      </a>
                    )}
                    {setting[0]?.instagram && (
                      <a href={setting[0].instagram} target="_blank" rel="noopener noreferrer">
                        <FaInstagram className="text-pink-600 text-xl md:text-2xl hover:scale-110 transition-transform" />
                      </a>
                    )}
                    {setting[0]?.twitter && (
                      <a href={setting[0].twitter} target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="text-sky-500 text-xl md:text-2xl hover:scale-110 transition-transform" />
                      </a>
                    )}
                  </div>
                </div> */}

                {/* Shop Now Button - Bottom Right */}
                {/* <div className="flex justify-end">
                  <a href="/shop/multibrand">
                    <Button className="bg-gradient-to-r from-yellow-400 to-red-500 text-white hover:bg-amber-400 shadow-lg text-sm md:text-base px-4 py-2 rounded-full">
                      Shop Now
                    </Button>
                  </a>
                </div> */}
              </div>

            </div>
 
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );

  
};



export default HeroCarousel;
