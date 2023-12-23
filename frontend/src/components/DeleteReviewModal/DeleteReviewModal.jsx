import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";
import { deleteReviewThunk } from "../../store/spots";

const DeleteReviewModal = ( {spotId, reviewId} ) => {
console.log('........spotId inside deleteModal.........', spotId);
console.log('......reviewId inside deleteModal.....',reviewId);
const dispatch = useDispatch();
const { closeModal } = useModal();

return (
    <div className="main-div">
      <h2 style={{ marginBottom: 0, paddingBottom: "0px" }}>Confirm Delete</h2>
      <p style={{ padding: "20px",paddingBottom: "0px",marginTop: 0, fontSize: "19px" }}>Are you sure you want to delete this review?</p>
      <button className='yes-button' onClick={() => dispatch(deleteReviewThunk(`${spotId}`,`${reviewId}`))
            .then(() => closeModal())} >Yes (Delete Review)
      </button>
      <button
        className="no-button" onClick={() => closeModal()}>No (Keep Review)
      </button>
    </div>
  );
};
export default DeleteReviewModal;