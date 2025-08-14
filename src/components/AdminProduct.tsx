//@ts-nocheck

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; // Assuming you have this component
import { useFirebase } from "@/Services/context";
import React,{ useEffect, useState } from "react";
import { storage } from "@/Services/Firebase.config";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { push, ref as dbRef, set, ref, get, remove, onValue  } from "firebase/database";
import { database } from "@/Services/Firebase.config";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";

const ProductCard = React.memo(({ product,handleAddProduct }) => {
 
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col" onClick={()=>{handleAddProduct(product)}}>
      <img src={product?.productImageURL} alt={product.productName} className="rounded-md h-[250px] w-full object-cover mb-3" />
      <div className="text-center mb-2">
        <p className="text-sm text-gray-500">{product.productName}</p>
      </div>
      <div className="text-center mb-2">
        <span className="text-emerald-600 font-bold mr-2">₹{product.salesPrice?.toFixed(2)}</span>
        <span className="text-red-500 line-through">₹{product.beforeDiscPrice?.toFixed(2)}</span>
      </div>
      {/* <div className="mt-auto flex justify-between items-center">
        {product.youtubeURL && <button><FaYoutube className="text-red-500 text-3xl cursor-pointer" /></button>}
        {qty > 0 ? (
          <div className="flex items-center mx-auto gap-2">
            <button onClick={() => updateCartQty(product.productId, "dec")} className="px-2 py-1 bg-red-500 text-white rounded">−</button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => updateCartQty(product.productId, parseInt(e.target.value))}
              className="w-16 text-center border rounded px-2 py-1"
            />
            <button onClick={() => updateCartQty(product.productId, "inc")} className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded">+</button>
          </div>
        ) : (
          <Button className="bg-gradient-to-r from-yellow-400 to-red-500 text-white px-6 py-2 rounded-full mx-auto" onClick={() => toggleCart(product)}>
            Add To Cart
          </Button>
        )}
        <button onClick={() => {
          toggleWishList(product.id);
          toast.success(isInWishlist ? 'Product is removed from wishlist' : 'Product is added to wishlist')
        }}>
          {isInWishlist ? <FaHeart className="text-2xl text-red-500" /> : <CiHeart className="text-3xl" />}
        </button>
      </div> */}
    </div>
  );
});

const AdminProduct = ({ handleAddProduct }) => {
  const { products} = useFirebase();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [Categories, setCategories] = useState();


  // const filteredProducts = products.filter((item) =>
  //   item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || item.CategoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });


   useEffect(() => {
  const CategoriesRef = ref(database, "CSC/GeneralMaster/Product Group");

  const unsubscribe = onValue(CategoriesRef, (snapshot) => {
    const data = snapshot.val();
    const formatted = data ? Object.values(data) : [];
    setCategories(formatted);
  });

  return () => unsubscribe();
}, []);

 
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-sm cursor-pointer">+ Add Product</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Choose Product</DialogTitle>

          {/* Search Bar */}
          <Input
            placeholder="Search by product namesds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
           <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="border rounded-md px-4 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
>
  <option value="">All Categories</option>
  {Categories?.map((category) => (
    <option key={category.id} value={category.generalName}>
      {category.generalName}
    </option>
  ))}
</select>

        </DialogHeader>

        {/* Scrollable filtered product list */}
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <div key={index} className="shadow-md rounded-md overflow-hidden">
                <ProductCard product={item} handleAddProduct={handleAddProduct} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProduct;

const handleDeleteProduct = async (product) => {
  if (!product?.id) return alert("Product ID not found");

  const productRef = dbRef(database, `CSC/Products/${product.id}`);
  try {
    await remove(productRef);
    alert("Product deleted successfully.");
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product.");
  }
};

export const AddProductToShop = () => {
  const [formData, setFormData] = useState({
    CategoryName: "",
    FlavourCode: 0,
    PriceListID: "",
    PriceListName: "",
    SubCategoryCode: 0,
    active: true,
    beforeDiscPrice: 0,
    cessPerc: 0,
    cgstperc: 0,
    companyID: "",
    contains: "",
    discAmt: 0,
    discPerc: 0,
    free: 0,
    gst: 0,
    hsnCode: "",
    id: "",
    importStatus: false,
    isMarginBased: false,
    margin: 0,
    per: 1,
    productCode: 0,
    productGroupCode: 0,
    productGroupId: "",
    productId: "",
    productImageURL: "",
    productImageURL2: "",
    productName: "",
    qty: 0,
    rate: 0,
    retailproduct: true,
    salesPrice: 0,
    sgstperc: 0,
    sortingorder: 1,
    stock: 0,
    stockValue: 0,
    uom: 0,
    uomid: "",
    youtubeURL: "",
    tag:""
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generalMaster,setGeneralMaster]=useState();
  useEffect(()=>{
           
         const getCatagory=async()=>{
                const orderRef = ref(database, `CSC/GeneralMaster`);
                    const snapshot = await get(orderRef);
                    setGeneralMaster(snapshot.val())
                    // return snapshot.exists() ?  : null;
         }
         getCatagory();
  },[])

  const handleChange = (field: string, value: string | number | boolean) => {

    const numberFields = [
      'discPerc', 'discAmt', 'salesPrice', 'rate',
      'qty', 'free', 'margin', 'per', 'beforeDiscPrice',
      'stock', 'stockValue', 'cgstperc', 'sgstperc', 'cessPerc', 'gst',
      'productCode', 'productGroupCode', 'uom'
    ];
    const booleanFields = ['active', 'importStatus', 'isMarginBased'];

    let parsedValue: string | number | boolean = value;

    if (numberFields.includes(field)) {
      parsedValue = Number(value);
    } else if (booleanFields.includes(field)) {
      parsedValue = value === 'true' || value === true;
    }

    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: parsedValue,
      };

      // Auto-calculate Discount Amount and Sales Price
      const beforeDisc = Number(updated.beforeDiscPrice);
      const discPerc = Number(updated.discPerc);

      if (!isNaN(beforeDisc) && !isNaN(discPerc)) {
        const discAmt = (beforeDisc * discPerc) / 100;
        const salesPrice = beforeDisc - discAmt;
        updated.discAmt = parseFloat(discAmt.toFixed(2)); // optional rounding
        updated.salesPrice = parseFloat(salesPrice.toFixed(2));
      }
      return updated;
    });
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const imgRef = storageRef(storage, `images/CSC/products/${Date.now()}-${imageFile.name}`);
    const snapshot = await uploadBytes(imgRef, imageFile);
    return await getDownloadURL(snapshot.ref);
  };

  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const imageUrl = await handleImageUpload();
     
      if(!formData.productName)
      {
        toast.error("Product Name is required");
        return;
      }
      if(!formData.CategoryName)
      {
        toast.error("Category Name required");
        return;
      }
      if(!formData.beforeDiscPrice)
      {
        toast.error("Before Discount Price is required");
        return;
      }
      if(!formData.uom)
      {
        toast.error("Unit is required");
        return;
      }
      const ProductdbId = Date.now().toString();

      const finalData = {
        ...formData,
        productImageURL: imageUrl,
        id: ProductdbId,
        uomid: String(formData.uom),
        productCode: Number(formData.productId),  
        productGroupId: String(formData.productGroupCode),
        PriceListID: formData.PriceListName,
        companyID: 'CSC',
      };

      const productRef = dbRef(database, `CSC/Products/${ProductdbId}`);
      await set(productRef, finalData);

      toast.success("Product added successfully!");

      // Reset
      setFormData({
        CategoryName: "",
        FlavourCode: 0,
        PriceListID: "",
        PriceListName: "",
        SubCategoryCode: 0,
        active: true,
        beforeDiscPrice: 0,
        cessPerc: 0,
        cgstperc: 0,
        companyID: "",
        contains: "",
        discAmt: 0,
        discPerc: 0,
        free: 0,
        gst: 0,
        hsnCode: "",
        id: "",
        importStatus: false,
        isMarginBased: false,
        margin: 0,
        per: 1,
        productCode: 0,
        productGroupCode: 0,
        productGroupId: "",
        productId: "",
        productImageURL: "",
        productImageURL2: "",
        productName: "",
        qty: 0,
        rate: 0,
        retailproduct: true,
        salesPrice: 0,
        sgstperc: 0,
        sortingorder: 1,
        stock: 0,
        stockValue: 0,
        uom: 0,
        uomid: "",
        youtubeURL: "",
        tag:""
      });

      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-sm mb-2 cursor-pointer">+ Add Product To Shop</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 w-full">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Create Product</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div>
            <label>Product Id</label>
            <Input
              type="text"
              placeholder="Product Id"
              value={formData.productId}
              onChange={(e) => handleChange("productId", e.target.value)}
            />
          </div>
          <div>
            <label>Product Name</label>
            <Input
              type="text"
              placeholder="Product Name"
              value={formData.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Category Name</label>
            <Input
              type="text"
              placeholder="Category Name"
              value={formData.CategoryName}
              onChange={(e) => handleChange("CategoryName", e.target.value)}
            />
          </div> */}
          <div>
            <label>Category Name</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={formData.CategoryName}
              onChange={(e) => {
                const selectedName = e.target.value;
                const selectedGroup = Object.values(generalMaster?.["Product Group"] || {}).find(
                  (group) => group.generalName === selectedName
                );

                if (selectedGroup) {
                  handleChange("CategoryName", selectedGroup.generalName);
                  handleChange("productGroupCode", selectedGroup.id); // or generalCode if you prefer
                }
              }}
            >
            <option value="">Select Category</option>
              {generalMaster?.["Product Group"] &&
                Object.values(generalMaster["Product Group"]).map((group) => (
                  <option key={group.id} value={group.generalName}>
                    {group.generalName}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label>Price List</label>
            <select className="w-full border px-2 py-1 rounded"
              value={formData.PriceListName}  // Bind selected value to formData
              onChange={(e) => setFormData({ ...formData, PriceListName: e.target.value })} // Update state on change
            >
              <option value="">Select Pricelist</option>  {/* Default empty option */}
              <option value="ONLINE PRICE LIST">ONLINE PRICE LIST</option>
              <option value="STANDARD CRACKERS">STANDARD CRACKERS</option>
            </select>
          </div>
          <div>
            <label>Before Discount Price</label>
            <Input
              type="number"
              placeholder="Before Discount Price"
              value={formData.beforeDiscPrice}
              onChange={(e) =>
                handleChange("beforeDiscPrice", e.target.value === "" ? "" : +e.target.value)
              }
            />
          </div>

          <div>
            <label>Discount %</label>
            <Input
              type="number"
              placeholder="Discount %"
              value={formData.discPerc}
              onChange={(e) => handleChange("discPerc", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Discount Amount</label>
            <Input
              type="number"
              placeholder="Discount Amount"
              value={formData.discAmt}
              readOnly
            />
          </div> */}

          <div>
            <label>Sales Price</label>
            <Input
              type="number"
              placeholder="Sales Price"
              value={formData.salesPrice}
              readOnly
            />
          </div>

          <div>
            <label>GST</label>
            <Input
              type="number"
              placeholder="GST"
              value={formData.gst}
              onChange={(e) => handleChange("gst", e.target.value)}
            />
          </div>

          {/* <div>
            <label>SGST</label>
            <Input
              type="number"
              placeholder="SGST"
              value={formData.sgstperc}
              onChange={(e) => handleChange("sgstperc", e.target.value)}
            />
          </div>

          <div>
            <label>CGST</label>
            <Input
              type="number"
              placeholder="CGST"
              value={formData.cgstperc}
              onChange={(e) => handleChange("cgstperc", e.target.value)}
            />
          </div> */}
  <div>
            <label>Per Unit</label>
            <Input
              type="number"
              placeholder="Per"
              value={formData.per}
              onChange={(e) => handleChange("per", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Unit</label>
            <Input
              type="text"
              placeholder="Unit"
              value={formData.uom}
              onChange={(e) => handleChange("uom", e.target.value)}
            />
          </div> */}
          <div>
  <label>Unit</label>
<select
  className="w-full border px-2 py-1 rounded"
  value={formData.uom}
  onChange={(e) => {
    const selectedId = e.target.value;
    const selectedGroup = generalMaster?.["UOM"]?.[selectedId];
    if (selectedGroup) {
      handleChange("uom", selectedGroup.id); // or use selectedGroup.generalCode if preferred
    }
  }}
>
  <option value="">Select Unit</option>
  {generalMaster?.["UOM"] &&
    Object.values(generalMaster["UOM"]).map((group) => (
      <option key={group.id} value={group.id}>
        {group.generalName}
      </option>
    ))}
</select>

</div>

          <div>
            <label>Contains</label>
            <Input
              type="text"
              placeholder="Contains"
              value={formData.contains}
              onChange={(e) => handleChange("contains", e.target.value)}
            />
          </div>

          <div>
            <label>Purchase Rate</label>
            <Input
              type="number"
              placeholder="Rate"
              value={formData.rate}
              onChange={(e) => handleChange("rate", e.target.value)}
            />
          </div>

        

          {/* <div>
            <label>Margin</label>
            <Input
              type="number"
              placeholder="Margin"
              value={formData.margin}
              onChange={(e) => handleChange("margin", e.target.value === "" ? "" : +e.target.value)}
            />
          </div> */}

          <div>
            <label>Sorting Order</label>
            <Input
              type="number"
              placeholder="Sorting Order"
              value={formData.sortingorder}
              onChange={(e) =>
                handleChange("sortingorder", e.target.value === "" ? "" : +e.target.value)
              }
            />
          </div>

          <div>
            <label>YouTube URL</label>
            <Input
              type="text"
              placeholder="YouTube URL"
              value={formData.youtubeURL}
              onChange={(e) => handleChange("youtubeURL", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tag Name</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={formData.tag || ""}
              onChange={(e) => {
                const selectedTag = e.target.value;
                handleChange("tag", selectedTag); // Just saving tagName as string
              }}
            >
              <option value="">Select Tag</option>
              {Array.isArray(generalMaster?.Tags) &&
                generalMaster.Tags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label>Upload Image File For Product</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {imageFile && (
              <div className="mt-2">
                <p className="font-semibold">New Image Preview:</p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="New Preview"
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}
          </div>
          {/* Active Checkbox */}
          <div>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Add Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EditProductCard = React.memo(({ product, setselectedProduct, handleDeleteProduct }) => {
  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering setselectedProduct

    const confirmed = window.confirm(`Are you sure you want to delete "${product.productName}"?`);
    if (confirmed) {
      handleDeleteProduct(product);
    }
  };

  return (
    <div
      className="relative bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col"
      onClick={() => setselectedProduct(product)}
    >
      {/* Delete Icon */}
      <MdDeleteForever
        className="absolute top-2 right-2 text-red-600 text-2xl hover:text-red-800 cursor-pointer z-10"
        onClick={onDeleteClick}
      />
      <img
        src={product?.productImageURL}
        alt={product.productName}
        className="rounded-md h-[250px] w-full object-contain mb-3 bg-white"
      />
      <div className="text-center mb-2">
        <p className="text-sm text-gray-500">{product.productName}</p>
      </div>
      <div className="text-center mb-2">
        <span className="text-emerald-600 font-bold mr-2">
          ₹{product.salesPrice?.toFixed(2)}
        </span>
        <span className="text-red-500 line-through">
          ₹{product.beforeDiscPrice?.toFixed(2)}
        </span>
      </div>
    </div>
  );
});


 
export const EditProduct=()=>{
  const { products, Categories } = useFirebase();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setselectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");


  const [loading, setLoading] = useState(false);
  const [generalMaster,setGeneralMaster]=useState();
  useEffect(()=>{
      const getCatagory=async()=>{
            const orderRef = ref(database, `CSC/GeneralMaster`);
                const snapshot = await get(orderRef);
                setGeneralMaster(snapshot.val())
                // return snapshot.exists() ?  : null;
      }
      getCatagory();
  },[selectedProduct])
  

  // const filteredProducts = products.filter((item) =>
  //   item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || item.CategoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [imageFile, setImageFile] = useState(null);

   const handleChange = (field: string, value: string | number | boolean) => {

    const numberFields = [
      'discPerc', 'discAmt', 'salesPrice', 'rate',
      'qty', 'free', 'margin', 'per', 'beforeDiscPrice',
      'stock', 'stockValue', 'cgstperc', 'sgstperc', 'cessPerc', 'gst',
      'productCode', 'productGroupCode', 'uom'
    ];
    const booleanFields = ['active', 'importStatus', 'isMarginBased'];

    let parsedValue: string | number | boolean = value;

    if (numberFields.includes(field)) {
      parsedValue = Number(value);
    } else if (booleanFields.includes(field)) {
      parsedValue = value === 'true' || value === true;
    }

    setselectedProduct((prev) => {
      const updated = {
        ...selectedProduct,
        [field]: parsedValue,
      };

      // Auto-calculate Discount Amount and Sales Price
      const beforeDisc = Number(updated.beforeDiscPrice);
      const discPerc = Number(updated.discPerc);
      
      if (!isNaN(beforeDisc) && !isNaN(discPerc)) {
        const discAmt = (beforeDisc * discPerc) / 100;
        const salesPrice = beforeDisc - discAmt;
        updated.discAmt = parseFloat(discAmt.toFixed(2)); // optional rounding
        updated.salesPrice = parseFloat(salesPrice.toFixed(2));
      }

      return updated;
    });
  };


  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const imgRef = storageRef(storage, `images/CSC/products/${Date.now()}-${imageFile.name}`);
    const snapshot = await uploadBytes(imgRef, imageFile);
    return await getDownloadURL(snapshot.ref);
  };
   const handleSubmit = async () => {
    try {
      setLoading(true);
      const imageUrl = await handleImageUpload();

      const finalData = {
        ...selectedProduct,
        productImageURL: imageUrl?imageUrl:selectedProduct.productImageURL,
        companyID: 'CSC',
        uomid: String(selectedProduct.uom),
        productCode: Number(selectedProduct.productId || ''), // assuming `productID` is a key in formData
        productGroupId: String(selectedProduct.productGroupCode),
        PriceListID: selectedProduct.PriceListName,
      };
     const productRef = dbRef(database, `CSC/Products/${selectedProduct.id}`);
     await set(productRef, finalData);

      toast.success("Product updated successfully!");
      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to Edit product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-sm mb-2 cursor-pointer">Edit / Delete Product</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Choose Product To Edit</DialogTitle>
          <p>Total Items:{filteredProducts.length}</p>
           
          {/* Search Bar */}
          {!selectedProduct&&<Input
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          }
          {!selectedProduct&&
          // <select
          //   value={selectedCategory}
          //   onChange={(e) => setSelectedCategory(e.target.value)}
          //   className="w-full max-w-xs p-2 border border-gray-300 rounded mb-4"
          // >
          //   <option value="">All Categories</option>
          //   {Array.isArray(Categories) &&
          //     Categories.map((category) => (
          //       <option key={category} value={category}>
          //         {category}
          //       </option>
          //     ))}
          // </select>
          <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="border rounded-md px-4 py-2 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
>
  <option value="">All Categories</option>
  {Categories?.map((category) => (
    <option key={category.id} value={category.generalName}>
      {category.generalName}
    </option>
  ))}
</select>

          }
        </DialogHeader>

        {/* Scrollable filtered product list */}
       {!selectedProduct&&<div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <div key={index} className="shadow-md rounded-md overflow-hidden cursor-pointer">
                <EditProductCard product={item} setselectedProduct={setselectedProduct} handleDeleteProduct={handleDeleteProduct}/>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>}
         <Button onClick={()=>setselectedProduct(null)} className="mb-4">
            ← Back 
          </Button>
        {selectedProduct?.productImageURL && (
          <div className="col-span-2">
           
            <p className="font-semibold">Current Image:</p>
            <img
              src={selectedProduct.productImageURL}
              alt="Current Product"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
          )}

       {selectedProduct && (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          
          <div>
            <label>Product Id</label>
            <Input
              type="text"
              placeholder="Product Id"
              value={selectedProduct.productId}
              onChange={(e) => handleChange("productId", e.target.value)}
            />
          </div>
          <div>
            <label>Product Name</label>
            <Input
              type="text"
              placeholder="Product Name"
              value={selectedProduct.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Category Name</label>
            <Input
              type="text"
              placeholder="Category Name"
              value={selectedProduct.CategoryName}
              onChange={(e) => handleChange("CategoryName", e.target.value)}
            />
          </div> */}
         <div>
            <label>Category Name</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={selectedProduct.CategoryName}
              onChange={(e) => {
                const selectedName = e.target.value;
                const selectedGroup = Object.values(generalMaster?.["Product Group"] || {}).find(
                  (group) => group.generalName === selectedName
                );

                if (selectedGroup) {
                  handleChange("CategoryName", selectedGroup.generalName);
                  handleChange("productGroupCode", selectedGroup.id); // or generalCode if you prefer
                }
              }}
            >
              <option value="">Select Category</option>
              {generalMaster?.["Product Group"] &&
                Object.values(generalMaster["Product Group"]).map((group) => (
                  <option key={group.id} value={group.generalName}>
                    {group.generalName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label>Before Discount Price</label>
            <Input
              type="number"
              placeholder="Before Discount Price"
              value={selectedProduct.beforeDiscPrice}
              onChange={(e) =>
                handleChange("beforeDiscPrice", e.target.value === "" ? "" : +e.target.value)
              }
            />
          </div>

          <div>
            <label>Discount %</label>
            <Input
              type="number"
              placeholder="Discount %"
              value={selectedProduct.discPerc}
              onChange={(e) => handleChange("discPerc", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Discount Amount</label>
            <Input
              type="number"
              placeholder="Discount Amount"
              value={formData.discAmt}
              readOnly
            />
          </div> */}

          <div>
            <label>Sales Price</label>
            <Input
              type="number"
              placeholder="Sales Price"
              value={selectedProduct.salesPrice}
              readOnly
            />
          </div>

          <div>
            <label>GST</label>
            <Input
              type="number"
              placeholder="GST"
              value={selectedProduct.gst}
              onChange={(e) => handleChange("gst", e.target.value)}
            />
          </div>

          {/* <div>
            <label>SGST</label>
            <Input
              type="number"
              placeholder="SGST"
              value={formData.sgstperc}
              onChange={(e) => handleChange("sgstperc", e.target.value)}
            />
          </div>

          <div>
            <label>CGST</label>
            <Input
              type="number"
              placeholder="CGST"
              value={formData.cgstperc}
              onChange={(e) => handleChange("cgstperc", e.target.value)}
            />
          </div> */}
  <div>
            <label>Per Unit</label>
            <Input
              type="number"
              placeholder="Per"
              value={selectedProduct.per}
              onChange={(e) => handleChange("per", e.target.value)}
            />
          </div>

          {/* <div>
            <label>Unit</label>
            <Input
              type="text"
              placeholder="Unit"
              value={selectedProduct.uom}
              onChange={(e) => handleChange("uom", e.target.value)}
            />
          </div> */}
                    <div>
  <label>Unit</label>
<select
  className="w-full border px-2 py-1 rounded"
  value={selectedProduct.uom}
  onChange={(e) => {
    const selectedId = e.target.value;
    const selectedGroup = generalMaster?.["UOM"]?.[selectedId];
    if (selectedGroup) {
      handleChange("uom", selectedGroup.id); // or use selectedGroup.generalCode if preferred
    }
  }}
>
  <option value="">Select Unit</option>
  {generalMaster?.["UOM"] &&
    Object.values(generalMaster["UOM"]).map((group) => (
      <option key={group.id} value={group.id}>
        {group.generalName}
      </option>
    ))}
</select>

</div>
          <div>
            <label>Contains</label>
            <Input
              type="text"
              placeholder="Contains"
              value={selectedProduct.contains}
              onChange={(e) => handleChange("contains", e.target.value)}
            />
          </div>

          <div>
            <label>Purchase Rate</label>
            <Input
              type="number"
              placeholder="Rate"
              value={selectedProduct.rate}
              onChange={(e) => handleChange("rate", e.target.value)}
            />
          </div>

        

          {/* <div>
            <label>Margin</label>
            <Input
              type="number"
              placeholder="Margin"
              value={formData.margin}
              onChange={(e) => handleChange("margin", e.target.value === "" ? "" : +e.target.value)}
            />
          </div> */}

          <div>
            <label>Sorting Order</label>
            <Input
              type="number"
              placeholder="Sorting Order"
              value={selectedProduct.sortingorder}
              onChange={(e) =>
                handleChange("sortingorder", e.target.value === "" ? "" : +e.target.value)
              }
            />
          </div>

          <div>
            <label>YouTube URL</label>
            <Input
              type="text"
              placeholder="YouTube URL"
              value={selectedProduct.youtubeURL}
              onChange={(e) => handleChange("youtubeURL", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tag Name</label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={selectedProduct.tag || ""}
              onChange={(e) => {
                const selectedTag = e.target.value;
                handleChange("tag", selectedTag); // Just saving tagName as string
              }}
            >
              <option value="">Select Tag</option>
              {Array.isArray(generalMaster?.Tags) &&
                generalMaster.Tags.map((tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                ))}
            </select>
          </div>
          
          <div className="sm:col-span-2 space-y-4">
            {/* Label and File Input */}
            <div>
              <label className="block font-medium mb-1">Upload Image File For Product</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            {/* Image Preview */}
            {imageFile && (
              <div>
                <p className="font-semibold mb-1">New Image Preview:</p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="New Preview"
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}

            {/* Active Checkbox */}
            <div>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedProduct.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-2">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Uploading..." : "Update Product"}
              </Button>
            </div>
          </div>
        </div>
)}

      </DialogContent>
    </Dialog>
  );

}
