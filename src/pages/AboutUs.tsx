//@ts-nocheck

import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>About Chennai Sparkle Crackers | Sivakasi Crackers City</title>
        <meta
          name="description"
          content="Learn about Chennai Sparkle Crackers, your trusted cracker supplier from Sivakasi. Delivering safe and affordable fireworks across India."
        />
        <meta
          name="keywords"
          content="about Chennai Sparkle Crackers, sivakasi cracker company, trusted fireworks dealer, crackers city, fireworks brand"
        />

        <meta
          property="og:title"
          content="About Us - Chennai Sparkle Crackers Sivakasi"
        />
        <meta
          property="og:description"
          content="We are a leading cracker supplier based in Sivakasi, offering quality fireworks at unbeatable prices."
        />
        <meta property="og:image" content="/meta/about-us.jpg" />
        <meta property="og:url" content="https://ChennaiSparkleCrackers.com/aboutus" />
      </Helmet>
      <section className="bg-white py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Text Content */}
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">
              About The Chennai Sparkle Crackers
            </h2>

            <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
              <p>
                Chennai Sparkle Crackers the most trusted and reliable website
                for online fireworks shopping in India. We are happy to deliver
                the best quality crackers at lowest prices. We sell different
                varieties of conventional crackers and fancy novel crackers.
                Every year, new varieties of crackers are introduced for our
                online customers. We serve our clients faster and better every
                time with our 24/7 online support.
              </p>
              <p>
                Customer satisfaction is our priority and we don’t compromise on
                our quality. We follow all safety standards from packing to
                delivery. Celebrate every special occasion with our wide range
                of crackers and spread happiness around you.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 bg-gray-50 rounded-xl p-6 grid grid-cols-3 gap-4 text-center shadow-md">
              <div>
                <h3 className="text-4xl font-bold text-emerald-500">1.2k</h3>
                <p className="font-semibold mt-1">Vendors</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-emerald-500">410k</h3>
                <p className="font-semibold mt-1">Customers</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-emerald-500">34k</h3>
                <p className="font-semibold mt-1">Products</p>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="rounded-xl bg-gray-100 overflow-hidden shadow-md">
            <img
              src="/logo.png" // Adjust if needed
              alt="About Chennai Sparkle Crackers"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <FeatureCards />
      </section>
      <Footer />
    </>
  );
};

export default AboutUs;
