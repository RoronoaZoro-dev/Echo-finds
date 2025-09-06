import React,{useContext} from 'react'
import Heart from '../../assets/Heart'
import {useHistory} from "react-router-dom";
import {PostContext} from "../../contextStore/PostContext";
import "./postcards.css"

function PostCards({product,index}) {
    let {setPostContent} = useContext(PostContext)//at the time of onClick on post ,the specified post item assigned to postContent by setPostContent function and it will be stored in a global context PostContext
 
    const history=useHistory()//at the time of onClick on post , we want redirect to the view post page

    return (
      <div className="card" key={index} onClick={()=>{
        setPostContent(product)
        history.push("/view")
      }}>
        <div className="favorite">
          <Heart></Heart>
        </div>
        <div className="image">
          <img src={product.url} alt="" />
        </div>
        <div className="content">
          <p className="rate">&#x20B9; {product.price}</p>
          <span className="category"> {product.category} </span>
          <p className="name"> {product.name}</p>
          {product.ecoRating && (
            <div className="eco-info">
              <span className="eco-rating">🌱 {product.ecoRating}/5</span>
              {product.condition && <span className="condition">{product.condition}</span>}
            </div>
          )}
        </div>
        <div className="date">
          <span>{product.createdAt}</span>
        </div>
      </div>
       
    )
}

export default PostCards
