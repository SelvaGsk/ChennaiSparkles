import React from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "@/Services/context";
import { Button } from "@/components/ui/button";
import { ProductCardComponent } from "@/components/ProductCard";

interface TagProductSectionProps {
  tag: string;
  title: string;
}

type Product = {
  id: string;
  productId: string;
  productName: string;
  beforeDiscPrice: number;
  salesPrice: number;
  productImageURL: string;
  productImageURL2?: string;
  youtubeURL?: string;
  tag: string;
};

export const TagProductSection: React.FC<TagProductSectionProps> = React.memo(({ tag, title }) => {
  const { products } = useFirebase();
  const navigate = useNavigate();

  const handleShowAll = (tag: string) => {
    navigate(`/shop?tag=${encodeURIComponent(tag)}`);
  };
  
  const filteredProducts = products
    .filter((p: Product) => p?.tag?.toLowerCase() === tag.toLowerCase())
    .slice(0, 4);

  if (filteredProducts.length === 0) return null;

  return (
    <div className="my-6 px-2 sm:px-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">
          {title}
        </h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-4 py-1.5 rounded shadow-sm transition duration-200"
          onClick={() => handleShowAll(tag)}
        >
          Show All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product: Product) => (
          <div key={product.id} className="h-full">
            <ProductCardComponent product={product} />
          </div>
        ))}
      </div>
    </div>

  );
});
