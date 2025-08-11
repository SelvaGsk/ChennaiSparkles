//@ts-nocheck
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth, provider, database, storage } from "./Firebase.config.ts";
import toast from "react-hot-toast";
import { get, onValue, ref, remove, set, push, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./Firebase.config.ts";
import OrderDetailPrint from "@/components/OrderDetailPrint";
import { renderToStaticMarkup } from "react-dom/server";
import { getDownloadURL, uploadBytes, uploadBytesResumable ,ref as storageRef,} from "firebase/storage";

// ---- Interface ----
interface FirebaseContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  gooleSignIn: () => Promise<void>;
  setting: any;
  signUp: (data: any) => Promise<void>;
  getMultiBrandProducts:() => Promise<any>;
  toggleWishList: (productId: string) => Promise<void>;
  toggleCart: (product: any) => Promise<void>;
  GsignUp: () => Promise<void>;
  updateCartQty: (
    productId: string,
    type: "inc" | "dec" | number
  ) => Promise<void>;
  placeOrder: (
    billProductList: any[],
    packingChargeAmount: number,
    useExistingAddress: boolean,
    formData: any,
    totalAmount: number
  ) => Promise<void>;
  getCustomerOrders: () => Promise<any>;
  getSingleCustomerOrder: () => Promise<any>;
  getBannerUrls: () => Promise<any>;
  getUser: () => Promise<any>;
  getOrders: () => Promise<any>;
  getupdateCustomerOrders: (uid: string, orderid: string) => Promise<void>;
  getSparklerProducts:()=>Promise<any>;
  getgiftProducts:()=>Promise<any>;
  getStandardGiftProducts:()=>Promise<any>;
  products: any;
  cartItems: any;
  wishlistIds: any[];
  searchTerm: string;
  TAGS: any;
  loading: boolean;
  multiBrandCategories:any;
  standardCategories:any;
  pdfLoading: boolean;
  dbuser: any;
  userloading: any;
  setdbUser: React.Dispatch<React.SetStateAction<any>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  Categories: any;
  orderloading:any, setorderLoading:any,
}

// ---- Create Context ----
const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

interface FirebaseProviderProps {
  children: ReactNode;
}

const functions = getFunctions(app);
const sendWhatsAppMessage = httpsCallable(functions, "sendWhatsApp");

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [wishlistIds, setWishlistIds] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [setting, setSetting] = useState();
  const [TAGS, setTags] = useState();
  const [Categories, setCategories] = useState();
  const [loading, setLoading] = useState(false);
  const [orderloading, setorderLoading] = useState(false);

  const [pdfLoading, setPdfLoading] = useState(false);
  const [dbuser, setdbUser] = useState(null);

  const [userloading, setuserLoading] = useState(true);
const [standardCategories, setStandardCategories] = useState<string[]>([]);
const [multiBrandCategories, setMultiBrandCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setuserLoading(false);
    getBannerUrls();
    });
    return () => unsubscribe();
  }, [user]);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    setUser(firebaseUser);
    setuserLoading(false);
    getBannerUrls();

    // ✅ If user just signed in, sync guestCart to Firebase
    if (firebaseUser) 
      {
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{}');

      if (Object.keys(guestCart).length > 0) 
        {
        const updates = {};
        for (const [productId, item] of Object.entries(guestCart))
           {
          updates[`CSC/tempCart/${firebaseUser.uid}/${productId}`] = item;
        }

        await update(ref(database), updates); // Push all to Firebase in one go
        localStorage.removeItem('guestCart'); // ✅ Clean up guest cart
        const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
        console.log(guestWishlist);
  if (guestWishlist.length > 0) {
    const wishlistRef = ref(database, `CSC/Wishlist/${firebaseUser.uid}`);
    const snapshot = await get(wishlistRef);
    const existing = snapshot.exists() ? snapshot.val() : [];

    // Merge (remove duplicates)
    const merged = Array.from(new Set([...existing, ...guestWishlist]));
    await set(wishlistRef, merged);
    localStorage.removeItem('guestWishlist');
  }
      }
    }
  });

  return () => unsubscribe();
}, []);


useEffect(() => {
  if (!user) {
    // ✅ For guest users: Load wishlist from localStorage
    const guestWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
    setWishlistIds(guestWishlist);
    return;
  }

  // ✅ For logged-in users: Sync from Firebase
  const idsRef = ref(database, `CSC/Wishlist/${user.uid}`);
  const unsubscribe = onValue(idsRef, (snapshot) => {
    const data = snapshot.val();
    setWishlistIds(data ?? []);
  });

  return () => unsubscribe();
}, [user]);


  useEffect(() => {
    if (user){
    const cartRef = ref(database, `CSC/tempCart/${user?.uid}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      setCartItems(snapshot.exists() ? snapshot.val() : {});
    });
    return () => unsubscribe();
  }else {
      // Load guest cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{}');
      setCartItems(guestCart);
    }
  }, [user]);
  

  
 useEffect(() => {
    const productsRef = ref(database, "CSC/Products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProducts = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setProducts(loadedProducts);
      } else {
        setProducts([]);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(()=>{
 const TagsRef = ref(database, "CSC/GeneralMaster/Tags");
    const unsubscribe = onValue(TagsRef, (snapshot) => {
      const data = snapshot.val();
     
        setTags(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  const CategoriesRef = ref(database, "CSC/GeneralMaster/Product Group");

  const unsubscribe = onValue(CategoriesRef, (snapshot) => {
    const data = snapshot.val();
    setCategories(data);
    if (data) {
      const standard: string[] = [];
      const multiBrand: string[] = [];

      Object.values(data).forEach((item: any) => {
        if (!item?.generalName) return;

        if (
          item.priceListName === "STANDARD CRACKERS" ||
          item.priceListName === ""
        ) {
          standard.push(item.generalName);
        }

        if (
          item.priceListName === "ONLINE PRICE LIST" ||
          item.priceListName === ""
        ) {
          multiBrand.push(item.generalName);
        }
      });

      // Remove duplicates if "" is causing overlaps
      setStandardCategories([...new Set(standard)]);
      setMultiBrandCategories([...new Set(multiBrand)]);
    } else {
      setStandardCategories([]);
      setMultiBrandCategories([]);
    }
  });

  return () => unsubscribe();
}, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: any) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      toast.success("Account created successfully!");

      if (userCredential) {
        const customerData = {
          accountMasterCode: 0,
          accounterId: "",
          accounterName: data.firstName,
          address: data.address,
          billingAddress: "",
          closingBal: 0,
          companyID: "",
          district: data.district,
          gstin: "",
          id: userCredential.user.uid,
          importStatus: false,
          mobileNo: data.phone,
          pinCode: data.pinCode,
          refer: data.referredBy,
          state: data.state,
        };

        await set(
          ref(database, `CSC/Customers/${userCredential.user.uid}`),
          customerData
        );
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Error creating user:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const GsignUp = async (data: any) => {
    try {
      if (!user) return;
        setLoading(true);
        const customerData = {
          accountMasterCode: 0,
          accounterId: "",
          accounterName: data.firstName,
          address: data.address,
          billingAddress: "",
          closingBal: 0,
          companyID: "",
          district: data.district,
          gstin: "",
          id: user.uid,
          importStatus: false,
          mobileNo: data.phone,
          pinCode: data.pinCode,
          refer: data.referredBy,
          state: data.state,
        };

      await set(ref(database, `CSC/Customers/${user.uid}`), customerData);
      toast.success("Account updated successfully!");
        setLoading(false);
    } catch (error: any) {
      console.error("Error creating user:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const gooleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      
      // console.log(user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Successfully logOut!");
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleWishList = async (productId: string) => {
     if (!user) {
    // Guest logic — update localStorage
    let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');

    if (guestWishlist.includes(productId)) {
      guestWishlist = guestWishlist.filter((id: string) => id !== productId);
    } else {
      guestWishlist.push(productId);
    }

    localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
    setWishlistIds(guestWishlist);
    return;
  }

    const idsRef = ref(database, `CSC/Wishlist/${user.uid}`);
    const snapshot = await get(idsRef);
    let currentIds = snapshot.exists() ? snapshot.val() : [];

    if (currentIds.includes(productId)) {
      const updatedIds = currentIds.filter((id: string) => id !== productId);
      await set(idsRef, updatedIds);
    } else {
      currentIds.push(productId);
      await set(idsRef, currentIds);
    }
  };

  const toggleCart = async (product: any) => {
     if (!user) {
    // Guest logic — update localStorage
    const cart = JSON.parse(localStorage.getItem("guestCart") || "{}");

    if (cart[product.productId]) {
      cart[product.productId].qty += 1;
    } else {
      cart[product.productId] = { ...product, qty: 1 };
    }

    localStorage.setItem("guestCart", JSON.stringify(cart));
    setCartItems(cart);
    return;
  }

    const productRef = ref(
      database,
      `CSC/tempCart/${user.uid}/${product.productId}`
    );
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
      const existing = snapshot.val();
      await set(productRef, { ...existing, qty: existing.qty + 1 });
    } else {
      await set(productRef, { ...product, qty: 1 });
    }
  };

// Allow both "inc" | "dec" or a number input
const updateCartQty = async (
  productId: string,
  action: "inc" | "dec" | number
) => {
  if (!user?.uid) {
    // Guest logic
    const cart = JSON.parse(localStorage.getItem("guestCart") || "{}");
    const item = cart[productId];
    if (!item) return;

    let newQty: number;

    if (typeof action === "number") {
      newQty = action;
    } else {
      newQty = action === "inc" ? item.qty + 1 : item.qty - 1;
    }

    if (newQty <= 0) {
      delete cart[productId];
    } else {
      cart[productId].qty = newQty;
    }

    localStorage.setItem("guestCart", JSON.stringify(cart));
    setCartItems(cart);
    return;
  }

    const productRef = ref(database, `CSC/tempCart/${user.uid}/${productId}`);
  const snapshot = await get(productRef);
  // if (!snapshot.exists()) return;

    // If product is not in cart, add it
    if (!snapshot.exists()) {
      const qty = typeof action === "number" ? action : 1;
      if (qty > 0) {
        await set(productRef, { productId, qty });
      }
      return;
    }

  const item = snapshot.val();
  let newQty: number;

  if (typeof action === "number") {
    if (isNaN(action)) return; // ⛔ Prevent setting NaN
    newQty = action;
  } else {
    newQty = action === "inc" ? item.qty + 1 : item.qty - 1;
  }

  if (newQty <= 0) {
    await remove(productRef);
  } else {
    await set(productRef, { ...item, qty: newQty });
  }
};

  const getUser = async () => {
    if (!user) return;
    const userRef = ref(database, `CSC/Customers/${user.uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  };

  // Sanitize phone numbers
  const sanitizePhone = (phone: string) => {
    if (!phone) return "";
    
    // Trim and remove internal spaces
    const trimmed = phone.trim().replace(/\s+/g, "");
  
    // If starts with + and followed by digits, keep as is
    if (/^\+\d+$/.test(trimmed)) {
      return trimmed;
    }
  
    // If starts with 91 and 10-digit number, add '+'
    const digits = trimmed.replace(/\D/g, ""); // remove all non-digits
    if (digits.length === 10) {
      return `+91${digits}`;
    }
  
    if (digits.startsWith("91") && digits.length === 12) {
      return `+${digits}`;


    }
  
    // Fallback: just add + before digits
    return `+${digits}`;
  };
async function uploadOrderImage(imageFile, orderId) {
  if (!imageFile || !orderId) throw new Error("Image file and orderId are required");

  const storagesRef = storageRef(storage, 'upi/' + orderId + '/' + imageFile.name);
  const uploadTask = uploadBytesResumable(storagesRef, imageFile);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("✅ File available at", downloadURL);
          resolve(downloadURL);
        } catch (err) {
          console.error("Error getting download URL:", err);
          reject(err);
        }
      }
    );
  });
}

  const placeOrder = async (
    billProductList: any[],
    packingChargeAmount: number,
    useExistingAddress: boolean,
    formData: any,
    totalAmount: number,
    isupi: boolean,
    upiimage: any
  ) => {
      setorderLoading(true);
    const now = new Date();
    const formattedDate =
      `${String(now.getDate()).padStart(2, "0")}/` +
      `${String(now.getMonth() + 1).padStart(2, "0")}/` +
                      `${now.getFullYear()} ` +
      `${String(now.getHours()).padStart(2, "0")}:` +
      `${String(now.getMinutes()).padStart(2, "0")}:` +
      `${String(now.getSeconds()).padStart(2, "0")}`;
  
    try {
       const dbUser = await getUser();
      const orderId = Date.now().toString();
       let orderurl;
    if(isupi)
    {
       orderurl=await uploadOrderImage(upiimage,orderId);
    }
      if (!user || !user.uid) {
        if(!formData.phone)
        {
          toast.error("Mobile number is must");
        }
        const guestorderRef = ref(
        database,
        `CSC/CustomerOrder/${formData.phone}/${orderId}`
      );
      
      const orderData = {
        billNo: orderId,
        orderNo: orderId,
        billProductList: billProductList || [],
        closed: false,
        collection: 0,
        custCode: dbUser?.custCode || formData.phone,
        custName:  formData.name,
        customer: {
  status: "Guest User",
  importStatus: false,
  mobileNo: formData.phone,
  pinCode: formData.pinCode,
  refer: formData.refer || "", // Optional
  state: formData.state,
  district: formData.district,
  city: formData.city,
  address: formData.addressLine1,
  accounterName: formData.name,
}
,
        date: formattedDate,
 upiimage:isupi?orderurl:"",
        deliveryAddress: useExistingAddress
          ? dbUser?.address
          : formData.addressLine1,
        deliveryRemarks: "",
        discountAmount: 0,
        discountPerc: 0,
        free: 0,
        import: false,
        lrNumber: "",
        netAmount: 0,
        packingCharge: packingChargeAmount,
        paymentMethodCode: 0,
        pending: 0,
        refer: "",
        statuses: {
          delivered: "false",
          orderPlaced: "false",
          payment: "false",
          packed: "false",
          shipped: "false",
        },
        totalAmount: totalAmount,
        transportName: "",
      };

      await set(guestorderRef, orderData);
     toast.success("✅ Order placed successfully!");
     localStorage.removeItem('guestCart');
     setCartItems({});
        return;
      }
     

    const orderRef = ref(
        database,
        `CSC/CustomerOrder/${user.uid}/${orderId}`
      );
      if (useExistingAddress && !dbUser?.accounterName) {
        toast.error("Please update address on profile");
        return;
      }
      if (useExistingAddress && !dbUser?.address) {
        toast.error("Please update address on profile");
        return;
      }
      if (useExistingAddress && !dbUser?.mobileNo) {
        toast.error("Please update Mobile number on profile");
        return;
      }
       
      setPdfLoading(true);

      const orderData = {
        billNo: orderId,
        orderNo: orderId,
        billProductList: billProductList || [],
        closed: false,
        collection: 0,
        custCode: dbUser?.custCode || "",
        custName: useExistingAddress ? dbUser?.accounterName : formData.name,
        customer: dbUser,
        date: formattedDate,
        deliveryAddress: useExistingAddress
          ? dbUser?.address
          : formData.addressLine1,
        deliveryRemarks: "",
        discountAmount: 0,
        discountPerc: 0,
        free: 0,
        import: false,
        lrNumber: "",
        upiimage:isupi?orderurl:"",
        netAmount: 0,
        packingCharge: packingChargeAmount,
        paymentMethodCode: 0,
        pending: 0,
        refer: "",
        statuses: {
          delivered: "false",
          orderPlaced: "false",
          payment: "false",
          packed: "false",
          shipped: "false",
        },
        totalAmount: totalAmount,
        transportName: "",
      };

      await set(orderRef, orderData);

      const selectedOrder = {
        ...orderData,
        orderId: orderData.billNo,
        totalProducts: orderData.billProductList?.length || 0,
      };

      const html = renderToStaticMarkup(
        <OrderDetailPrint order={selectedOrder} setting={setting} />
      );
  
      const functions = getFunctions();
      const generatePdf = httpsCallable(functions, "generatePdf");
  
      const result = await generatePdf({
        html,
        fileName: `Order-${selectedOrder.orderId}`,
      });
      
      const pdfUrl = result.data?.mediaUrl || "";
      const sendMessage = httpsCallable(
        functions,
        "sendWhatsAppMessageOrderPlace"
      );

      // Prepare values
      const totalItems = selectedOrder?.billProductList?.length || 0;
      const finalAmount = selectedOrder?.totalAmount || 0;
      const companyName = setting[0]?.CompanyName;
      const trackingLink = `https://chennaisparklecrackers.in/track-order`;

      // Get sanitized numbers
      const customerPhone = sanitizePhone(
        selectedOrder.customer?.mobileNo || ""
      );
      const officePhone = sanitizePhone(setting[0]?.CellNO || "");
      const ownerPhone = "+919952162941";
      const ContactNumber = `${officePhone} / ${setting[0]?.WhatsAppNumber || ""}`;

      // Array of phone numbers to send message to
      const phoneNumbers = [customerPhone, ownerPhone];

      // Send message to each number
      for (const phone of phoneNumbers) {
        try {
          const whatsappResult = await sendMessage({
            phone,
            templateId: "HXdc888fa18833403460fdee5e64d13ca1",
            templateParams: {
              1: selectedOrder.custName, // Customer name
              2: selectedOrder.orderId, // Order ID
              3: totalItems.toString(), // Total items
              4: finalAmount.toString(), // Total amount
              5: ContactNumber, // Contact number
              6: trackingLink, // Order tracking URL
              7: companyName, // Business name
              8: `Order-${selectedOrder.orderId}`,
              9: setting[0]?.WhatsAppNumber || ""
            },
            mediaUrl: `${pdfUrl}`,
          });

          console.log(`✅ WhatsApp sent to ${phone}:`, whatsappResult.data);
        } catch (err) {
          console.error(`❌ Failed to send WhatsApp to ${phone}:`, err);
        }
      }
 
    toast.success("✅ Order placed successfully! and WhatsApp message sent!");
    // toast.success("✅ Order placed successfully!");

      for (const item of billProductList) {
        const productRef = ref(
          database,
          `CSC/tempCart/${user.uid}/${item.productId}`
        );
        await remove(productRef);
      }

      
    } catch (error) {
      console.error("❌ Error placing order:", error);
      setPdfLoading(false);
    } finally {
      setPdfLoading(false);
      setorderLoading(false);

    }
  };

  const getOrders = async () => {
    if (!user) return;
    const orderRef = ref(database, `CSC/CustomerOrder/${user.uid}`);
    const snapshot = await get(orderRef);
    return snapshot.exists() ? snapshot.val() : null;
  };

  const getBannerUrls = async () => {
    const urlRef = ref(database, `CSC/Settings`);
    const snapshot = await get(urlRef);
    setSetting(snapshot.exists() ? snapshot.val() : null);
    // console.log(snapshot.exists() ? snapshot.val() : null)
    return snapshot.exists() ? snapshot.val() : null;
  };
   const getCustomerOrders = async () => {
    const coRef = ref(database, `CSC/CustomerOrder`);
    const snapshot = await get(coRef);
    setSetting(snapshot.exists() ? snapshot.val() : null);
    // console.log(snapshot.exists() ? snapshot.val() : null)
    return snapshot.exists() ? snapshot.val() : null;
  };
  const getSingleCustomerOrder = async (uid, orderid) => {
    const coRef = ref(database, `CSC/CustomerOrder/${uid}/${orderid}`);
    const snapshot = await get(coRef);
    setSetting(snapshot.exists() ? snapshot.val() : null);
    // console.log(snapshot.exists() ? snapshot.val() : null)
    return snapshot.exists() ? snapshot.val() : null;
  };
  const getupdateCustomerOrders = async (uid, orderid, data) => {
    const coRef = ref(database, `CSC/CustomerOrder/${uid}/${orderid}`);
    await set(coRef, data);
    toast.success("Order Updated Successfully");
    // console.log(uid)
    // console.log(orderid)

    // console.log(data)
  };
  async function getSparklerProducts() {
  const coRef = ref(database, `CSC/Products`);
  const snapshot = await get(coRef);

  if (snapshot.exists()) {
    const data = snapshot.val();

    const sparklerProducts = Object.entries(data)
      .filter(([_, product]) =>
       
        product.PriceListName === "STANDARD CRACKERS"
      )
      .map(([id, product]) => ({ id, ...product }));
     console.log(sparklerProducts);
    return sparklerProducts;
  } else {
    console.log("No data found.");
    return [];
  }
}

 async function getMultiBrandProducts() {
  const coRef = ref(database, `CSC/Products`);
  const snapshot = await get(coRef);

  if (snapshot.exists()) {
    const data = snapshot.val();

    const Products = Object.entries(data)
      .filter(([_, product]) =>
       
        product.PriceListName === "ONLINE PRICE LIST"
      )
      .map(([id, product]) => ({ id, ...product }));
    return Products;
  } else {
    console.log("No data found.");
    return [];
  }
}
async function getgiftProducts() {
  const coRef = ref(database, `CSC/Products`);
  const snapshot = await get(coRef);

  if (snapshot.exists()) {
    const data = snapshot.val();

    const sparklerProducts = Object.entries(data)
      .filter(([_, product]) =>
       
        product.CategoryName === "COMBO ITEMS ( Multi Brand )"
      )
      .map(([id, product]) => ({ id, ...product }));
    return sparklerProducts;
  } else {
    console.log("No data found.");
    return [];
  }
}
async function getStandardGiftProducts() {
  const coRef = ref(database, `CSC/Products`);
  const snapshot = await get(coRef);

  if (snapshot.exists()) {
    const data = snapshot.val();

    const sparklerProducts = Object.entries(data)
      .filter(([_, product]) =>
       
        product.CategoryName === "COMBO ITEMS ( Standard Crackers )"
      )
      .map(([id, product]) => ({ id, ...product }));
    return sparklerProducts;
  } else {
    console.log("No data found.");
    return [];
  }
}
  return (
    <FirebaseContext.Provider
      value={{
        user,
        signIn,
        signOut: logOut,
        gooleSignIn,
        signUp,
        toggleWishList,
        toggleCart,
        updateCartQty,
        getUser,
        placeOrder,
        getOrders,
        getBannerUrls,
        cartItems,
        wishlistIds,
        searchTerm,
        setSearchTerm,
        products,
        setting,
        TAGS,
        GsignUp,
        loading,
      dbuser, 
      setdbUser,
      userloading,
      pdfLoading,
      getCustomerOrders,
      getupdateCustomerOrders,
      getSingleCustomerOrder,
        Categories,
        getSparklerProducts,
        getMultiBrandProducts,
        standardCategories,
        multiBrandCategories,
        orderloading,
        setorderLoading,
        getgiftProducts,
        getStandardGiftProducts
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
