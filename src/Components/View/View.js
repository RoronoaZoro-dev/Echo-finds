import React, { useContext, useEffect, useState } from "react";
import { PostContext } from "../../contextStore/PostContext";
import { db } from "../../firebase/config";
import { useHistory } from "react-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./View.css";
function View() {
  let { postContent } = useContext(PostContext);//from the global store PostContext we can get information about desired product post that we want to show (the user is clicked item on the card)

  const [userDetails, setUserDetails] = useState();//we want show the details of who is posted the add and we dont know,so we want retreive user data from firebase who is posted this add
  const history = useHistory();//if user click the refresh of the page then PostContext data will be erased so it will throws an error so that time we want redirect this page to home page
  useEffect(() => {
    const fetchUserDetails = async () => {
      let { userId } = postContent;
      if (userId === undefined) {
        history.push("/");
      } else {
        try {
          const q = query(collection(db, "users"), where("id", "==", userId));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUserDetails(doc.data());
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [history, postContent]);
  return (
    <div className="viewParentDiv">
      <div className="imageShowDiv">
        <img src={postContent.url} alt="" />
      </div>{" "}
      <div className="rightSection">
        <div className="productDetails">
          <p>&#x20B9; {postContent.price} </p>
          <span>{postContent.name}</span>
          <p>{postContent.category}</p>
          <span>{postContent.createdAt}</span>
        </div>
        <div className="productDescription">
            <p className="p-bold">Product Description</p>
            <p>{postContent.description}</p>
            
            {postContent.ecoRating && (
              <div className="eco-details">
                <p className="p-bold">🌱 Eco-Friendly Details</p>
                <div className="eco-grid">
                  <div className="eco-item">
                    <span className="eco-label">Eco Rating:</span>
                    <span className="eco-value">🌱 {postContent.ecoRating}/5</span>
                  </div>
                  {postContent.condition && (
                    <div className="eco-item">
                      <span className="eco-label">Condition:</span>
                      <span className="eco-value">{postContent.condition}</span>
                    </div>
                  )}
                  {postContent.materials && (
                    <div className="eco-item">
                      <span className="eco-label">Materials:</span>
                      <span className="eco-value">{postContent.materials}</span>
                    </div>
                  )}
                  {postContent.sustainability && (
                    <div className="eco-item full-width">
                      <span className="eco-label">Sustainability:</span>
                      <span className="eco-value">{postContent.sustainability}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        {userDetails &&
          <div className="contactDetails">
            <p className="p-bold">Seller details</p>
            <p>Name : {userDetails.name}</p>
            <p>Phone : {userDetails.phone}</p>
          </div>
        }
       
      </div>
    </div>
  );
}
export default View;
