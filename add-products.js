// Script to add sample products to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCggZCcBun0cwNfOWGC2K8pZcgIRWMfqwY",
  authDomain: "ecofinds-marketplace.firebaseapp.com",
  projectId: "ecofinds-marketplace",
  storageBucket: "ecofinds-marketplace.appspot.com",
  messagingSenderId: "767411886432",
  appId: "1:767411886432:web:2ef6862afc88f2c423a605",
  measurementId: "G-4ELNR9DJHL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sampleProducts = [
  {
    name: "Vintage Wooden Chair",
    category: "Furniture",
    price: 45,
    description: "Beautiful vintage wooden chair in excellent condition. Perfect for eco-conscious home decor.",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    userId: "sample-user-1",
    createdAt: new Date().toISOString(),
    ecoRating: 5,
    condition: "Excellent",
    materials: "Solid Wood",
    sustainability: "Upcycled vintage piece"
  },
  {
    name: "Organic Cotton T-Shirt",
    category: "Clothing & Accessories",
    price: 15,
    description: "Soft organic cotton t-shirt, gently used. Sustainable fashion choice.",
    url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    userId: "sample-user-2",
    createdAt: new Date().toISOString(),
    ecoRating: 4,
    condition: "Good",
    materials: "100% Organic Cotton",
    sustainability: "Eco-friendly materials"
  },
  {
    name: "Bamboo Bookshelf",
    category: "Furniture",
    price: 85,
    description: "Sustainable bamboo bookshelf with modern design. Fast-growing, renewable material.",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    userId: "sample-user-3",
    createdAt: new Date().toISOString(),
    ecoRating: 5,
    condition: "Excellent",
    materials: "Bamboo",
    sustainability: "Renewable resource, carbon negative"
  },
  {
    name: "Solar Phone Charger",
    category: "Electronics",
    price: 55,
    description: "Portable solar phone charger with built-in battery. Harness the power of the sun!",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    userId: "sample-user-4",
    createdAt: new Date().toISOString(),
    ecoRating: 5,
    condition: "Excellent",
    materials: "Recycled Plastic",
    sustainability: "Solar powered, renewable energy"
  },
  {
    name: "Beeswax Food Wraps Set",
    category: "Kitchen & Dining",
    price: 25,
    description: "Set of 3 beeswax food wraps to replace plastic wrap. Reusable and sustainable.",
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    userId: "sample-user-5",
    createdAt: new Date().toISOString(),
    ecoRating: 5,
    condition: "New",
    materials: "Beeswax, Cotton",
    sustainability: "Reusable, reduces plastic waste"
  },
  {
    name: "Bamboo Yoga Mat",
    category: "Sports & Recreation",
    price: 35,
    description: "Eco-friendly bamboo yoga mat, perfect for sustainable fitness.",
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    userId: "sample-user-6",
    createdAt: new Date().toISOString(),
    ecoRating: 5,
    condition: "Excellent",
    materials: "Bamboo Fiber",
    sustainability: "Biodegradable materials"
  }
];

async function addProducts() {
  try {
    console.log("🌱 Adding sample products to Firestore...");
    
    for (const product of sampleProducts) {
      await addDoc(collection(db, "products"), product);
      console.log(`✅ Added: ${product.name}`);
    }
    
    console.log("🎉 All products added successfully!");
  } catch (error) {
    console.error("❌ Error adding products:", error);
  }
}

addProducts();
