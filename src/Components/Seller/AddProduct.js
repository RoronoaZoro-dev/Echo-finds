import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { SellerContext } from "../../contextStore/SellerContext";
import { storage, db } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import GoLoading from "../Loading/GoLoading";
import "./AddProduct.css";

export default function AddProduct() {
  const history = useHistory();
  const { seller, sellerProfile } = useContext(SellerContext);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    condition: "",
    ecoRating: 3,
    price: "",
    category: "",
    materials: "",
    sustainability: "",
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: previewUrls
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload images to Firebase Storage
      const uploadedImages = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const imageRef = ref(storage, `products/${seller.uid}/${Date.now()}_${i}`);
        const snapshot = await uploadBytes(imageRef, imageFiles[i]);
        const url = await getDownloadURL(snapshot.ref);
        uploadedImages.push(url);
      }

      // Add product to Firestore
      const productData = {
        ...formData,
        images: uploadedImages,
        sellerId: seller.uid,
        sellerName: sellerProfile?.businessName || seller.displayName,
        createdAt: new Date().toISOString(),
        status: 'active',
        views: 0,
        likes: 0
      };

      await addDoc(collection(db, "products"), productData);
      
      // Update seller's product count
      // This would typically be done with a cloud function, but for now we'll skip it
      
      history.push("/seller/dashboard");
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ecoRatingOptions = [
    { value: 1, label: "1 - Not Eco-Friendly", description: "No environmental consideration" },
    { value: 2, label: "2 - Slightly Eco-Friendly", description: "Minimal environmental benefit" },
    { value: 3, label: "3 - Moderately Eco-Friendly", description: "Some environmental benefits" },
    { value: 4, label: "4 - Very Eco-Friendly", description: "Strong environmental benefits" },
    { value: 5, label: "5 - Extremely Eco-Friendly", description: "Maximum environmental benefit" }
  ];

  if (!seller) {
    history.push("/seller/login");
    return null;
  }

  return (
    <>
      {loading && <GoLoading />}
      <div className="add-product-container">
        <div className="add-product-form">
          <div className="form-header">
            <h1>🌱 Add New Product</h1>
            <p>List your eco-friendly product for the sustainable marketplace</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Vintage Wooden Chair"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="furniture">Furniture</option>
                    <option value="clothing">Clothing & Accessories</option>
                    <option value="electronics">Electronics</option>
                    <option value="home-decor">Home Decor</option>
                    <option value="books">Books & Media</option>
                    <option value="sports">Sports & Recreation</option>
                    <option value="tools">Tools & Equipment</option>
                    <option value="art">Art & Collectibles</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe your product in detail..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Condition *</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Condition</option>
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Eco-Friendly Information</h3>
              <div className="form-group">
                <label>Eco Rating *</label>
                <div className="eco-rating-selector">
                  {ecoRatingOptions.map(option => (
                    <label key={option.value} className="eco-rating-option">
                      <input
                        type="radio"
                        name="ecoRating"
                        value={option.value}
                        checked={formData.ecoRating == option.value}
                        onChange={handleChange}
                      />
                      <div className="rating-content">
                        <span className="rating-value">{option.label}</span>
                        <span className="rating-description">{option.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Materials Used</label>
                <input
                  type="text"
                  name="materials"
                  value={formData.materials}
                  onChange={handleChange}
                  placeholder="e.g., Recycled wood, Organic cotton, Bamboo"
                />
              </div>

              <div className="form-group">
                <label>Sustainability Notes</label>
                <textarea
                  name="sustainability"
                  value={formData.sustainability}
                  onChange={handleChange}
                  placeholder="Explain the environmental benefits of this product..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Product Images</h3>
              <div className="form-group">
                <label>Upload Images *</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <p className="help-text">Upload up to 5 images. First image will be the main display image.</p>
              </div>

              {formData.images.length > 0 && (
                <div className="image-preview">
                  {formData.images.map((url, index) => (
                    <img key={index} src={url} alt={`Preview ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => history.push("/seller/dashboard")}
              >
                Cancel
              </button>
              <button type="submit" className="eco-button">
                List Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
