import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getDetailSpot, getSpotReviews } from '../../store/spots';
import { useEffect} from "react";
import "./DetailedSpot.css";
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal";
import DeleteReviewModal from "../DeleteReviewModal";

const Spot = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();

    const currentSpot = useSelector((state) => state.spots[spotId]);
    console.log('.......currentSpot........',currentSpot);
    console.log('.....spotId......', spotId);
    const rev = useSelector((state) => state.spots.Reviews);
    console.log('.......reviews.......', rev);
    const sessionUser = useSelector((state) => state.session.user);
    console.log('....current logged in user....', sessionUser)
    
    useEffect(() => {
        dispatch(getDetailSpot(spotId));
        dispatch(getSpotReviews(spotId));
    }, [dispatch, spotId]);

    if (!currentSpot) { 
        return <h1>Loading...</h1>
    }

    if (!rev) { 
        return <h1>Loading...</h1>
    }

    const {
        name,
        ownerId,
        description,
        city,
        state,
        country,
        SpotImages,
        avgStarRating,
        numReviews,
        price,
        Owner,
        Reviews,
      } = currentSpot;

      console.log('.......Owner....', Owner)
      if (!SpotImages) { 
        return <h1>Loading...</h1>
      }

      console.log('........Reviews.....', Reviews)
      console.log('........rev.....', rev)

      const previewImage = SpotImages.find((img) => img.preview === true);
      if (!previewImage) { 
        return <h1>Loading...</h1>
      }

      const loggedInUserReview = rev && sessionUser 
            ? rev.find((review) => review.userId === sessionUser.id) : undefined;

      return (
      
        <div className="spot-detail-div">
            <h2> {name}</h2>
            <div>
                <h3>{city}, {state}, {country}</h3>
            </div>
            <div className="spot-detail-image-div">
                <img className="spot-detail-preview-image" src={previewImage ? previewImage.url : ""} alt="previewImage" />
            </div>
            <div className="spot-detail-info">
                <div style={{ marginRight: "50px", fontFamily: "calibiri" }}>
                    <h3>Hosted by {Owner.firstName} {Owner.lastName}</h3>
                    <p>{description}</p>
                </div>
                <div className="spot-detail-price-review-box">
                    <div className="spot-detail-price-review-content">
                        <div className="spot-detail-price">
                            <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                                ${price} 
                            </span>&nbsp;night
                        </div>
                        <div >
                            <i className="fa-solid fa-star"></i>&nbsp;
                            <span style={{ fontWeight: "bold" }}>{avgStarRating > 0 ? avgStarRating.toFixed(1) : "New"}
                            </span>  
                            {numReviews ? (
                            <>
                                {numReviews > 0 ? " . "  : "  "}
                                {numReviews}{numReviews > 1 ?  " reviews" :  " review"}
                            </>
                                ): (" ")}
                        </div>    
                    </div>
                <div >
                    <button className="reserve-button" onClick={() => alert("Feature Coming Soon...")}>
                            Reserve
                    </button>
                </div>
            </div>
        </div>
      

        <div className="reviews">
            <div className="spot-detail-price-review">
            <div>
                <i className="fa-solid fa-star"></i>&nbsp;
                <span style={{ fontWeight: "bold" }}>{avgStarRating > 0 ? avgStarRating.toFixed(1) : "New"}
                </span>  
                {numReviews ? (
                <>
                    {numReviews > 0 ? " . "  : "  "}
                    {numReviews}{numReviews > 1 ?  " reviews" :  " review"}
                </>
                    ): (" ")}
            </div>    
        </div>
            
              
        <div>
            {sessionUser && sessionUser.id !== ownerId && !loggedInUserReview && (
                <>
                    <div style={{paddingTop:"10px"}}>
                        <OpenModalButton 
                            buttonText="Post your Review"
                            style={{color: "red"}}
                            modalComponent={
                                <ReviewFormModal spotId={spotId} />
                            }
                        />
                    </div>
                    { !rev.length && (
                        <p>Be the first to post a review!</p>
                    )}
                </>
            )}
        </div>

            <div >
                    {rev &&
                    rev.sort((rev1, rev2) => new Date(rev2.createdAt) - new Date(rev1.createdAt))           
                     .map((review) => (
                        <div key={review.id} className="spot-detail-review">
                            <div className="spot-detail-review-firstName">
                                {review.User.firstName}
                            </div>
                            <div className="spot-detail-review-month-year">
                                {new Date(review.createdAt).toLocaleString("default", {month: "long",
                                })}&nbsp;
                                {new Date(review.createdAt).getFullYear()}
                            </div>
                            <p>{review.review}</p>
                            {sessionUser && review.User.id === sessionUser.id && (
                                <OpenModalButton
                                buttonText="Delete"
                                modalComponent={
                                    <DeleteReviewModal spotId={spotId} reviewId={review.id} />
                                }
                                />
                            )}
                        </div>
                    ))}
            </div>
        </div>
      </div>
    )
}

export default Spot;