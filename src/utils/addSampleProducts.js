// Utility to add sample products to Firestore for testing
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const addSampleProducts = async () => {
  const sampleProducts = [
    // Furniture & Home
    {
      name: "Vintage Wooden Chair",
      category: "Furniture",
      price: 45,
      description: "Beautiful vintage wooden chair in excellent condition. Perfect for eco-conscious home decor.",
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      userId: "sample-user-1",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Excellent",
      materials: "Solid Wood",
      sustainability: "Upcycled vintage piece"
    },
    {
      name: "Reclaimed Wood Coffee Table",
      category: "Furniture",
      price: 120,
      description: "Stunning coffee table made from reclaimed barn wood. Unique character and sustainable materials.",
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      userId: "sample-user-2",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Very Good",
      materials: "Reclaimed Wood",
      sustainability: "Repurposed materials, zero waste"
    },
    {
      name: "Bamboo Bookshelf",
      category: "Furniture",
      price: 85,
      description: "Sustainable bamboo bookshelf with modern design. Fast-growing, renewable material.",
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      userId: "sample-user-3",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Excellent",
      materials: "Bamboo",
      sustainability: "Renewable resource, carbon negative"
    },

    // Clothing & Fashion
    {
      name: "Organic Cotton T-Shirt",
      category: "Clothing & Accessories",
      price: 15,
      description: "Soft organic cotton t-shirt, gently used. Sustainable fashion choice.",
      url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      userId: "sample-user-4",
      createdAt: new Date().toDateString(),
      ecoRating: 4,
      condition: "Good",
      materials: "100% Organic Cotton",
      sustainability: "Eco-friendly materials"
    },
    {
      name: "Vintage Denim Jacket",
      category: "Clothing & Accessories",
      price: 35,
      description: "Classic vintage denim jacket, perfect for sustainable fashion. Timeless style.",
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      userId: "sample-user-5",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Good",
      materials: "Denim",
      sustainability: "Vintage, extends clothing lifecycle"
    },
    {
      name: "Hemp Backpack",
      category: "Clothing & Accessories",
      price: 45,
      description: "Durable hemp backpack, perfect for eco-conscious travelers. Natural fiber construction.",
      url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
      userId: "sample-user-6",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Excellent",
      materials: "Hemp Fiber",
      sustainability: "Biodegradable, low water usage"
    },
    {
      name: "Upcycled Sweater",
      category: "Clothing & Accessories",
      price: 25,
      description: "Beautiful upcycled sweater made from recycled wool. Unique design, sustainable materials.",
      url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
      userId: "sample-user-7",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Very Good",
      materials: "Recycled Wool",
      sustainability: "Upcycled, reduces textile waste"
    },

    // Electronics & Tech
    {
      name: "Refurbished Laptop",
      category: "Electronics",
      price: 299,
      description: "Fully refurbished laptop with warranty. Great for reducing e-waste.",
      url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      userId: "sample-user-8",
      createdAt: new Date().toDateString(),
      ecoRating: 4,
      condition: "Very Good",
      materials: "Recycled Components",
      sustainability: "Refurbished to extend life"
    },
    {
      name: "Solar Phone Charger",
      category: "Electronics",
      price: 55,
      description: "Portable solar phone charger with built-in battery. Harness the power of the sun!",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      userId: "sample-user-9",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Excellent",
      materials: "Recycled Plastic",
      sustainability: "Solar powered, renewable energy"
    },
    {
      name: "Refurbished Smartphone",
      category: "Electronics",
      price: 180,
      description: "Certified refurbished smartphone with warranty. Reduce electronic waste.",
      url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      userId: "sample-user-10",
      createdAt: new Date().toDateString(),
      ecoRating: 4,
      condition: "Good",
      materials: "Recycled Components",
      sustainability: "Refurbished, extends device life"
    },

    // Home Decor & Garden
    {
      name: "Handmade Ceramic Vase",
      category: "Home Decor",
      price: 25,
      description: "Beautiful handmade ceramic vase, perfect for sustainable home styling.",
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      userId: "sample-user-11",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Excellent",
      materials: "Natural Clay",
      sustainability: "Handmade, locally sourced"
    },
    {
      name: "Indoor Herb Garden Kit",
      category: "Home & Garden",
      price: 30,
      description: "Complete indoor herb garden kit with organic seeds and biodegradable pots.",
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      userId: "sample-user-12",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "New",
      materials: "Biodegradable Pots",
      sustainability: "Promotes home gardening, reduces food miles"
    },
    {
      name: "Cork Bulletin Board",
      category: "Home Decor",
      price: 20,
      description: "Sustainable cork bulletin board made from recycled wine corks. Functional and eco-friendly.",
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      userId: "sample-user-13",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Excellent",
      materials: "Recycled Cork",
      sustainability: "Upcycled materials, renewable resource"
    },
    {
      name: "Bamboo Plant Pots Set",
      category: "Home & Garden",
      price: 35,
      description: "Set of 3 bamboo plant pots with drainage. Perfect for indoor plants and herbs.",
      url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      userId: "sample-user-14",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "New",
      materials: "Bamboo",
      sustainability: "Biodegradable, renewable material"
    },

    // Books & Media
    {
      name: "Educational Books Set",
      category: "Books & Media",
      price: 20,
      description: "Collection of educational books on sustainability and environmental science.",
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      userId: "sample-user-15",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Good",
      materials: "Recycled Paper",
      sustainability: "Knowledge sharing"
    },
    {
      name: "Zero Waste Living Guide",
      category: "Books & Media",
      price: 12,
      description: "Comprehensive guide to zero waste living. Paperback edition on recycled paper.",
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      userId: "sample-user-16",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Very Good",
      materials: "Recycled Paper",
      sustainability: "Educational, promotes sustainable living"
    },

    // Sports & Recreation
    {
      name: "Bamboo Yoga Mat",
      category: "Sports & Recreation",
      price: 35,
      description: "Eco-friendly bamboo yoga mat, perfect for sustainable fitness.",
      url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      userId: "sample-user-17",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Excellent",
      materials: "Bamboo Fiber",
      sustainability: "Biodegradable materials"
    },
    {
      name: "Recycled Plastic Water Bottle",
      category: "Sports & Recreation",
      price: 18,
      description: "Durable water bottle made from recycled plastic. BPA-free and dishwasher safe.",
      url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
      userId: "sample-user-18",
      createdAt: new Date().toDateString(),
      ecoRating: 4,
      condition: "Excellent",
      materials: "Recycled Plastic",
      sustainability: "Reduces single-use plastic"
    },
    {
      name: "Organic Cotton Gym Towel",
      category: "Sports & Recreation",
      price: 22,
      description: "Soft organic cotton gym towel, perfect for eco-conscious athletes.",
      url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
      userId: "sample-user-19",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Good",
      materials: "Organic Cotton",
      sustainability: "Chemical-free, sustainable farming"
    },

    // Beauty & Personal Care
    {
      name: "Natural Soap Set",
      category: "Beauty & Personal Care",
      price: 28,
      description: "Handmade natural soap set with organic ingredients. Plastic-free packaging.",
      url: "https://images.unsplash.com/photo-1556228720-195a67e7c9b2?w=400",
      userId: "sample-user-20",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "New",
      materials: "Natural Ingredients",
      sustainability: "Biodegradable, plastic-free packaging"
    },
    {
      name: "Bamboo Toothbrush Set",
      category: "Beauty & Personal Care",
      price: 15,
      description: "Set of 4 bamboo toothbrushes with biodegradable bristles. Sustainable oral care.",
      url: "https://images.unsplash.com/photo-1556228720-195a67e7c9b2?w=400",
      userId: "sample-user-21",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "New",
      materials: "Bamboo",
      sustainability: "Biodegradable, replaces plastic toothbrushes"
    },

    // Kitchen & Dining
    {
      name: "Beeswax Food Wraps Set",
      category: "Kitchen & Dining",
      price: 25,
      description: "Set of 3 beeswax food wraps to replace plastic wrap. Reusable and sustainable.",
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      userId: "sample-user-22",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "New",
      materials: "Beeswax, Cotton",
      sustainability: "Reusable, reduces plastic waste"
    },
    {
      name: "Stainless Steel Straws Set",
      category: "Kitchen & Dining",
      price: 12,
      description: "Set of 4 stainless steel straws with cleaning brush. Perfect alternative to plastic straws.",
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      userId: "sample-user-23",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "New",
      materials: "Stainless Steel",
      sustainability: "Reusable, eliminates single-use plastic"
    },
    {
      name: "Bamboo Cutlery Set",
      category: "Kitchen & Dining",
      price: 18,
      description: "Portable bamboo cutlery set with carrying case. Perfect for on-the-go dining.",
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      userId: "sample-user-24",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "New",
      materials: "Bamboo",
      sustainability: "Biodegradable, replaces disposable cutlery"
    },

    // Kids & Baby
    {
      name: "Organic Cotton Baby Onesies",
      category: "Kids & Baby",
      price: 22,
      description: "Set of 3 organic cotton baby onesies, gentle on sensitive skin.",
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      userId: "sample-user-25",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Very Good",
      materials: "Organic Cotton",
      sustainability: "Chemical-free, safe for babies"
    },
    {
      name: "Wooden Building Blocks",
      category: "Kids & Baby",
      price: 35,
      description: "Set of wooden building blocks made from sustainable wood. Safe, non-toxic finish.",
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      userId: "sample-user-26",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Good",
      materials: "Sustainable Wood",
      sustainability: "Durable, non-toxic, promotes creativity"
    },

    // Pet Supplies
    {
      name: "Hemp Dog Collar",
      category: "Pet Supplies",
      price: 20,
      description: "Durable hemp dog collar with metal buckle. Sustainable pet accessory.",
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      userId: "sample-user-27",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "Excellent",
      materials: "Hemp",
      sustainability: "Biodegradable, strong and durable"
    },
    {
      name: "Bamboo Pet Bowl Set",
      category: "Pet Supplies",
      price: 25,
      description: "Set of 2 bamboo pet bowls, perfect for food and water. Easy to clean and sustainable.",
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      userId: "sample-user-28",
      createdAt: new Date().toDateString(),
      ecoRating: 5,
      condition: "New",
      materials: "Bamboo",
      sustainability: "Biodegradable, antimicrobial properties"
    }
  ];

  try {
    console.log("Adding sample products to Firestore...");
    
    for (const product of sampleProducts) {
      await addDoc(collection(db, "products"), product);
      console.log(`Added product: ${product.name}`);
    }
    
    console.log("✅ All sample products added successfully!");
    return { success: true, message: "Sample products added successfully!" };
  } catch (error) {
    console.error("Error adding sample products:", error);
    return { success: false, error: error.message };
  }
};
