import React, { Fragment, useState, useContext } from "react";
import "./Create.css";
import Header from "../Header/Header";
import { storage, db } from "../../firebase/config";
import { AuthContext } from "../../contextStore/AuthContext";
import { useHistory } from "react-router";
import GoLoading from "../Loading/GoLoading";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
const Create = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  let [name, setName] = useState("");
  let [category, setCategory] = useState("");
  let [price, setPrice] = useState("");
  let [description, setDescription] = useState("");
  let [image, setImage] = useState();
  let [loading,setLoading]=useState(false);
  
  // Eco-friendly product fields
  let [ecoRating, setEcoRating] = useState("");
  let [condition, setCondition] = useState("");
  let [materials, setMaterials] = useState("");
  let [sustainability, setSustainability] = useState("");
  const handleSubmit = async () => {
    setLoading(true);
    let date = new Date().toDateString();
    
    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `images/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      const url = await getDownloadURL(snapshot.ref);
      
      // Add product to Firestore
      await addDoc(collection(db, "products"), {
        name,
        category,
        price,
        description,
        url,
        userId: user.uid,
        createdAt: date,
        ecoRating: ecoRating || null,
        condition: condition || null,
        materials: materials || null,
        sustainability: sustainability || null,
      });
      
      history.push("/");
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Error uploading product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <Header />
    { loading && <GoLoading/> }
      <div className="centerDiv">
        <label>Name</label>
        <br />
        <input
          className="input"
          type="text"
          name="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <br />
        <label>Category:</label>
        <select
          name="Category"
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          className="input"
        > <option >Select Eco Category</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing & Accessories">Clothing & Accessories</option>
          <option value="Electronics">Electronics</option>
          <option value="Home Decor">Home Decor</option>
          <option value="Home & Garden">Home & Garden</option>
          <option value="Books & Media">Books & Media</option>
          <option value="Sports & Recreation">Sports & Recreation</option>
          <option value="Beauty & Personal Care">Beauty & Personal Care</option>
          <option value="Kitchen & Dining">Kitchen & Dining</option>
          <option value="Kids & Baby">Kids & Baby</option>
          <option value="Pet Supplies">Pet Supplies</option>
        </select>
        <br />
        <label>Price</label>
        <br />
        <input
          className="input"
          type="number"
          name="Price"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />
        <br />
        <label>Description</label>
        <br />
        <input
          className="input"
          type="text"
          name="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <br />
        
        {/* Eco-friendly product fields */}
        <div className="eco-section">
          <h3>🌱 Eco-Friendly Details (Optional)</h3>
          
          <label>Eco Rating (1-5):</label>
          <select
            name="EcoRating"
            onChange={(e) => {
              setEcoRating(e.target.value);
            }}
            className="input"
          >
            <option value="">Select Rating</option>
            <option value="1">1 - Not Eco-Friendly</option>
            <option value="2">2 - Somewhat Eco-Friendly</option>
            <option value="3">3 - Moderately Eco-Friendly</option>
            <option value="4">4 - Very Eco-Friendly</option>
            <option value="5">5 - Extremely Eco-Friendly</option>
          </select>
          <br />
          
          <label>Condition:</label>
          <select
            name="Condition"
            onChange={(e) => {
              setCondition(e.target.value);
            }}
            className="input"
          >
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Excellent">Excellent</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
          <br />
          
          <label>Materials:</label>
          <input
            className="input"
            type="text"
            name="Materials"
            placeholder="e.g., Organic Cotton, Bamboo, Recycled Plastic"
            value={materials}
            onChange={(e) => {
              setMaterials(e.target.value);
            }}
          />
          <br />
          
          <label>Sustainability Notes:</label>
          <input
            className="input"
            type="text"
            name="Sustainability"
            placeholder="e.g., Upcycled, Biodegradable, Solar Powered"
            value={sustainability}
            onChange={(e) => {
              setSustainability(e.target.value);
            }}
          />
          <br />
        </div>

        <br />
        <img
          alt="Posts"
          width="200px"
          height="200px"
          src={image ? URL.createObjectURL(image) : ""}
        ></img>

        <br />
        <input
          type="file"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        <br />
        <button className="uploadBtn" onClick={handleSubmit}>
          upload and Submit
        </button>
      </div> 
    </Fragment>
  );
};

export default Create;
