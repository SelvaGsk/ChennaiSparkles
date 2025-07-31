//@ts-nocheck


const features = [
    {
      title: "Quality Products",
      description:
        "At our store, we are dedicated to providing you with top-notch crackers, ensuring a memorable and safe fireworks experience for all.",
      icon: "/icons/quality.svg",
    },
    {
      title: "24x7 Support",
      description:
        "Count on our dedicated customer support team to assist you with any questions or concerns you may have, ensuring a smooth and pleasant experience.",
      icon: "/icons/support.svg",
    },
    {
      title: "Same day Shipping",
      description:
        "Experience the convenience of same-day shipping, ensuring your orders are swiftly dispatched for prompt delivery right to your doorstep.",
      icon: "/icons/shipping.svg",
    },
    {
      title: "Best Price in Market",
      description:
        "Experience the advantage of our competitive pricing, giving you great affordability without sacrificing excellence.",
      icon: "/icons/price.svg",
    },
  ]
  
  export default function FeatureCards() {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">
                <img src={feature.icon} alt="" className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-semibold text-center">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  