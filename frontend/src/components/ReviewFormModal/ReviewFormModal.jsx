import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReviewToSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./ReviewFormModal.css";

const ReviewFormModal = ({ spotId }) => {
    //const sessionUser = useSelector((state) => state.session.user);
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(0);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const currentSpot = useSelector((state) => state.spots[spotId]);
    console.log('......spotname......', currentSpot);

    const handleSubmit = () => {
        setError();
        dispatch(addReviewToSpot(spotId, review, stars))
          .then(() => {
            closeModal();
          })
          .catch(async (res) => {
            const data = await res.json();
            if (data && data.message) {
              setError(data.message);
            }
          });
      };
      /*
      return (
        <div className="review-modal">
          <h2 style={{paddingLeft:"40px", alignItems:"center", justifyContent:"center"}}>How was your stay at {currentSpot.name}?</h2>
          <p className="error">{error}</p>
          <textarea
            style={{ width: "100%", border: "solid 2px black" }}
            value={review}
            onChange={(e) => {
              setError("");
              setReview(e.target.value);
            }}
            placeholder="Leave your review here..."
            rows={10}
          ></textarea>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="starcss">
              <input
                type="radio"
                id="star1"
                name="rate"
                value={stars}
                onChange={(e) => setStars(1)}
              />
              <label htmlFor="star1" title="text">
                1 star
              </label>
              <input
                type="radio"
                id="star2"
                name="rate"
                value={stars}
                onChange={(e) => setStars(2)}
              />
              <label htmlFor="star2" title="text">
                2 stars
              </label>
              <input
                type="radio"
                id="star3"
                name="rate"
                value={stars}
                onChange={(e) => setStars(3)}
              />
              <label htmlFor="star3" title="text">
                3 stars
              </label>
              <input
                type="radio"
                id="star4"
                name="rate"
                value={stars}
                onChange={(e) => setStars(4)}
              />
              <label htmlFor="star4" title="text">
                4 stars
              </label>
              <input
                type="radio"
                id="star5"
                name="rate"
                value={stars}
                onChange={(e) => setStars(5)}
              />
              <label htmlFor="star5" title="text">
                5 stars
              </label>
            </div>
            Stars
          </div>
    
          <button
            className="submit-review-btn"
            disabled={review.length < 10 || stars < 1}
            onClick={handleSubmit}
          >
            Submit Your Review
          </button>
        </div>
      ); 
      */
      return (
        <div className="review-modal">
          <h2 style={{paddingLeft:"40px", alignItems:"center", justifyContent:"center"}}>How was your stay at {currentSpot.name}?</h2>
          <p className="error">{error}</p>
          <textarea
            style={{ width: "100%", border: "solid 2px black" }}
            value={review}
            onChange={(e) => {
              setError("");
              setReview(e.target.value);
            }}
            placeholder="Leave your review here..."
            rows={10}
          ></textarea>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="starcss">
              <input
                type="radio"
                id="star5"
                name="rate"
                value={stars}
                onChange={() => setStars(5)}
              />
              <label htmlFor="star5" title="text">
                5 stars
              </label>
              <input
                type="radio"
                id="star4"
                name="rate"
                value={stars}
                onChange={() => setStars(4)}
              />
              <label htmlFor="star4" title="text">
                4 stars
              </label>
              <input
                type="radio"
                id="star3"
                name="rate"
                value={stars}
                onChange={() => setStars(3)}
              />
              <label htmlFor="star3" title="text">
                3 stars
              </label>
              <input
                type="radio"
                id="star2"
                name="rate"
                value={stars}
                onChange={() => setStars(2)}
              />
              <label htmlFor="star2" title="text">
                2 stars
              </label>
              <input
                type="radio"
                id="star1"
                name="rate"
                value={stars}
                onChange={() => setStars(1)}
              />
              <label htmlFor="star1" title="text">
                1 star
              </label>
            </div>
            Stars
          </div>
    
          <button
            className="submit-review-btn"
            disabled={review.length < 10 || stars < 1}
            onClick={handleSubmit}
          >
            Submit Your Review
          </button>
        </div>
      ); 
    };


export default ReviewFormModal;
  