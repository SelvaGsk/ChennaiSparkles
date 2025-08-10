// @ts-nocheck
import { motion } from "framer-motion";

const logos =[
  '/brandlogos/BHEEMA.png',
  '/brandlogos/damo.png',
  '/brandlogos/kalis.png',
  '/brandlogos/mothers.png',
  '/brandlogos/RAMESH SPARKLERS.png',
  '/brandlogos/sparkle logo.png',
  '/brandlogos/sparkle.jpg',
  '/brandlogos/standered logo 2  copy.png',
  '/brandlogos/starvell.png'


]

const duplicatedLogos = [...logos, ...logos]; // for infinite scroll

const LogoCarousel = () => {
  return (
    <div className="overflow-hidden py-6 bg-white">
      <motion.div
        className="flex gap-12 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        {duplicatedLogos.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`logo-${index}`}
            className="h-16 w-auto object-contain"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LogoCarousel;
