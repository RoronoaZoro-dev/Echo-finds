import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import "./Post.css";
import { db } from "../../firebase/config";
import BarLoading from "../Loading/BarLoading";
import PostCards from "../PostCards/PostCards";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { AllPostContext } from "../../contextStore/AllPostContext";

function Posts() {
  const { setAllPost } = useContext(AllPostContext);
  let [posts, setPosts] = useState([]); //for showing all posts in Descending order of date
  let [posts2, setPosts2] = useState([]); //for showing all posts in Ascending order of date
  let [loading, setLoading] = useState(false);
  let [loading2,setLoading2] = useState(false)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setLoading2(true);
      
      try {
        // Fetch posts in descending order
        const descQuery = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const descSnapshot = await getDocs(descQuery);
        
        let allPostsDescendingOrder = descSnapshot.docs.map((product) => {
          return {
            ...product.data(),
            id: product.id,
          };
        });
        setPosts2(allPostsDescendingOrder);
        setAllPost(allPostsDescendingOrder);
        setLoading(false);

        // Fetch posts in ascending order
        const ascQuery = query(collection(db, "products"), orderBy("createdAt", "asc"));
        const ascSnapshot = await getDocs(ascQuery);
        
        let allPostsAscendingOrder = ascSnapshot.docs.map((product) => {
          return {
            ...product.data(),
            id: product.id,
          };
        });
        setPosts(allPostsAscendingOrder);
        setLoading2(false);
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        setLoading(false);
        setLoading2(false);
      }
    };

    fetchPosts();
  }, [setAllPost]);
  // quickMenuCards assign all cards of post item later it will be displayed
  let quickMenuCards = posts.map((product, index) => {
    return(<div className="quick-menu-cards" key={index}> <PostCards product={product} index={index} /> </div>);
  });

  let freshRecomendationCards = posts2.map((product, index) => { if(index<4) {
    return (<div className="fresh-recomendation-card" key={index}> <PostCards product={product} index={index} /> </div>);}
    return null 
});

  return (
    <div className="postParentDiv">
      {posts && posts.length > 0 ? (
        <div className="moreView">
          <div className="heading">
            <span>Eco-Friendly Products</span>
            <Link to="./viewmore">
              {" "}
              <span>View more</span>{" "}
            </Link>
          </div>
          <div className="cards">
            {" "}
            {loading ? <BarLoading /> : quickMenuCards}
          </div>
        </div>
      ) : (
        <div className="moreView">
          <div className="heading">
            <span>Eco-Friendly Products</span>
          </div>
          <div className="cards">
            {loading ? <BarLoading /> : <p>No products found. <a href="/add-samples">Add sample products</a> to get started!</p>}
          </div>
        </div>
      )}
     <div className="recommendations">
        <div className="heading">
          <span>Sustainable Recommendations</span>
        </div>
        <div className="fresh-recomendation-cards cards">{loading2 ? <BarLoading/> : freshRecomendationCards}</div> 
      </div> 
    </div>
  );
}

export default Posts;
