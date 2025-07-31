//@ts-nocheck

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const products = [
  {
    title: "Twinkling Chakras",
    offer: "90% offer",
    image: "/products/1.jpg",
    bgColor: "bg-purple-500",
  },
  {
    title: "Amazing Flower Pots",
    offer: "90% offer",
    image: "/products/2.jpg",
    bgColor: "bg-gradient-to-r from-yellow-400 to-red-500",
  },
  {
    title: "Blasting Bombs",
    offer: "90% offer",
    image: "/products/3.jpg",
    bgColor: "bg-blue-400",
  },
  {
    title: "Crackling Sparklers",
    offer: "90% offer",
    image: "/products/4.jpg",
    bgColor: "bg-gradient-to-br from-pink-500 to-blue-400",
  },
  {
    title: "Colorful Rockets",
    offer: "90% offer",
    image: "/products/5.jpg",
    bgColor: "bg-yellow-400",
  },
  
  {
    title: "Diwali Combo Pack",
    offer: "90% offer",
    image: "/products/6.jpg",
    bgColor: "bg-gradient-to-r from-green-400 to-blue-500",
  },
]

export default function ProductCarousel() {
  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        loop={true}
        autoplay={{ delay: 4000 }} // 4 seconds
        pagination={{ clickable: true }}
      >
        {products.map((product, idx) => (
          <SwiperSlide key={idx}>
            <div
              className={`rounded-lg p-6 h-72 relative overflow-hidden ${product.bgColor} text-white`}
            >
               <img
                src={product.image}
                alt={product.title}
                // className="absolute bottom-0 right-0 h-36 object-contain"
                className="absolute inset-0 w-full h-full object-cover"
              />

               {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Content Overlay */}
              <div className="relative z-10">
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-green-300 text-lg mt-2">{product.offer}</p>
                <a href="/shop">
                  <button className="mt-4 cursor-pointer bg-gradient-to-r from-yellow-400 to-red-500 text-white px-4 py-2 rounded font-semibold shadow">
                    Shop Now
                  </button>
                </a>
              </div>
             
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
