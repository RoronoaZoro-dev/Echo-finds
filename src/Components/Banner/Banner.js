import React, { useState } from "react";
import DynamicPosts from "../DynamicPosts/DynamicPosts";

import "./Banner.css";

function Banner() {
  let [category, setCategory] = useState();
  
  return (
    <div className="bannerParentDiv">
      <div className="bannerChildDiv">
        <div className="menuBar">
          <div className="categoryMenu">
            <select
              name="Category"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              {" "}
              <option value="null">ALL ECO CATEGORIES</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing & Accessories">Clothing & Accessories</option>
              <option value="Electronics">Electronics</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Books & Media">Books & Media</option>
              <option value="Sports & Recreation">Sports & Recreation</option>
              <option value="Tools & Equipment">Tools & Equipment</option>
              <option value="Art & Collectibles">Art & Collectibles</option>
            </select>
          </div>
          <div className="otherQuickOptions">
            <span onClick={()=>setCategory("Furniture")} >Furniture</span>
            <span onClick={()=>setCategory("Clothing & Accessories")} >Clothing</span>
            <span onClick={()=>setCategory("Electronics")} >Electronics</span>
            <span onClick={()=>setCategory("Home Decor")} >Home Decor</span>
            <span onClick={()=>setCategory("Books & Media")} >Books</span>
            <span onClick={()=>setCategory("Sports & Recreation")} >Sports</span>
          </div>
        </div>
        <div className="banner">
          <img src="../../../Images/banner copy.png" alt="" />
        </div>
      </div>
     { category!=null && <DynamicPosts category={category}/>  }
    </div>
  );
}

export default Banner;
