import { csrfFetch } from "./csrf";


// Action Type
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

// Action Creator
const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        payload: reviewId
    }
};

// Thunk 
export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  console.log('.....inside delete thunk....');
  console.log('.....reviewId.....', reviewId);
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  dispatch(deleteReview(reviewId));
  return response;
};

// State Object
const initialState = {};

// Reviews Reducer
const reviewsReducer = (state = initialState, action) => {
    const newState = { ...state};

  switch (action.type) {
    case DELETE_REVIEW: {
        console.log('.......inside delete Reducer........');
        console.log('......newState before delete Review......', newState);
        delete newState[action.payload.reviewId];
        console.log('......newState after delete Review......', newState);
        return newState;
    }

    default:
      return newState;
  }
};

export default reviewsReducer;