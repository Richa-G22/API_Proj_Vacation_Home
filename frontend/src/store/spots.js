import { csrfFetch } from "./csrf";

// Action Type
const GET_CURRENT_USER_SPOTS = "spots/GET_CURRENT_USER_SPOTS";
const GET_ALL_SPOTS = "spots/GET_ALL_SPOTS";
const GET_DETAILED_SPOT = "spots/GET_DETAILED_SPOT";
const GET_SPOT_REVIEWS = "spots/GET_SPOT_REVIEWS";
const ADD_IMAGE_TO_SPOT = "spots/ADD_IMAGE_TO_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const ADD_REVIEW_TO_SPOT = "spots/ADD_REVIEW_TO_SPOT";

// Action Creator
const editSpot = ( spot ) => {
    return {
        type: UPDATE_SPOT,
        spot,
    }
}
const storeCurrentUserSpots = (spots) => {
    return {
      type: GET_CURRENT_USER_SPOTS,
      payload: spots,
    };
  };

const storeAllSpots = (spots) => {
    return {
      type: GET_ALL_SPOTS,
      payload: spots,
    };
};

const getDetailedSpot = (spotId) => {
    return {
        type: GET_DETAILED_SPOT,
        payload: spotId,
    }
};

const storeSpotReviews = (spotId, reviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        payload: spotId, reviews 
    }
};

const addImage = (spotId, image) => {
    return {
        type: ADD_IMAGE_TO_SPOT,
        payload: spotId, image 
    }
};

const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        payload: spotId
    }
};

/*const addReview = (data) => {
    return {
        type: ADD_REVIEW_TO_SPOT,
        payload: data 
    }
}*/

// Thunk Action Creator
export const deleteSpotThunk = (spotId) => async (dispatch) => {
    console.log('.....inside delete thunk....');
    console.log('.....spotId.....', spotId.spotId);
    const id = spotId.spotId;
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: "DELETE"
    });
    dispatch(deleteSpot(spotId));
    return response;
};

export const updateSpotThunk = (spotId, spot) => async (dispatch) => {

    console.log('......inside update spot thunk........');
    console.log('........spotId.......', spotId);
    console.log('...inside update spot thunk spot..',spot)
    //const id = spot.spotId;
    console.log('......spot.spotId....', spot.spotId);
    const response =  await csrfFetch(`/api/spots/${spotId}`,{
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body : JSON.stringify(spot)
    });

    if (response.ok) {
        const updatedSpot = await response.json();
        dispatch(editSpot(updatedSpot));
        return updatedSpot;
    } else {
        const errors = await response.json();
        return errors;
    }
};

export const getCurrentUserSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots/current");
    const data = await response.json();
    console.log("-----data----", data);
    dispatch(storeCurrentUserSpots(data.Spots));
    return response;
};

export const getAllSpots = () => async (dispatch) => {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    console.log("-----data----", data);
    dispatch(storeAllSpots(data.Spots));
    return response;
};

export const getDetailSpot = (spotId) => async (dispatch) => {
    console.log("getDetailSpot spotid : ", spotId)
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const data = await response.json();
    console.log("---detailedSpot---", data);
    dispatch(getDetailedSpot(data));
    return response;
};

export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    const data = await response.json();
    console.log("---spotReviews---", data);
    dispatch(storeSpotReviews(spotId, data.Reviews));
    return response;
};

export const createNewSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch("/api/spots", {
        method: "POST",
        body: JSON.stringify(spot),
    });
    const data = await response.json();
    console.log('......inside spot thunk action creator1, data.....', data);
    dispatch(getDetailedSpot(data.id));
    console.log('......inside spot thunk action creator2, data.....', data);
    return data;
};

export const addImageToSpot = (spotId, image) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`,{
        method: "POST",
        body: JSON.stringify(image)
    });
    const data = await response.json();
    console.log('......inside image thunk action creator1, data.....', data);
    dispatch(addImage(data));
    console.log('......inside image thunk action creator2, data.....', data);
    return response;
};

export const addReviewToSpot = (spotId, review, stars) => async (dispatch) => {
    console.log('...addReviewSpotThunk...',spotId,review,stars)
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review, stars}),
    });

    if( response.ok ) {
       dispatch(getDetailSpot(spotId));
       dispatch(getSpotReviews(spotId));
    }
    return response

    //if ( response.ok ) {
    //    const newReview = await response.json()
    //    dispatch(storeSpotReviews(spotId,newReview));
    //    return newReview;
    //}
    //return response;

    //const data = await response.json();
    //console.log('.....inside addReviewToSpotThunk data...', data);
    //console.log('.....inside addReviewToSpotThunk response...', response);
    //dispatch(addReview(data));
    ////dispatch(storeSpotReviews(spotId,data.Reviews) )
    //return data;
}

export const deleteReviewThunk = (spotId, reviewId) => async (dispatch) => {
  console.log('.....inside delete thunk....');
  console.log('.....spotId inside delete thunk....', spotId);
  console.log('.....reviewId.....', reviewId);
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if( response.ok ) {
    dispatch(getDetailSpot(spotId));
    dispatch(getSpotReviews(spotId));
  }
  return response;
};

// State Object
const initialState = {};

// Spots Reducer
const spotsReducer = (state = initialState, action) => {
    const newState = { ...state};

    switch (action.type) {
        case GET_CURRENT_USER_SPOTS: {    
            const newState = {};
            console.log('......newState....', newState);
            action.payload.forEach((spot) => (newState[spot.id] = spot));
            console.log('......newState....', newState);
            return newState;    
        }

        case GET_ALL_SPOTS: {
            const newState = {};
            action.payload.forEach((spot) => (newState[spot.id] = spot));
            return newState; 
        }
        
        case GET_DETAILED_SPOT: {
            console.log('........state.....', state);
            console.log('........action.spot.....', action.spot);
            return { ...state, [action.payload.id]: action.payload };
        }

        case GET_SPOT_REVIEWS: {
//            return { ...state, [action.payload.id]: action.reviews.review };
              return { ...state, Reviews: action.reviews };
        } 

        case ADD_IMAGE_TO_SPOT: {
            console.log('......inside Reducer.......',state);
            return {...state};
        }

        case DELETE_SPOT: {
            console.log('.......inside delete Reducer........');
            console.log('......newState before delete......', newState);
            delete newState[action.payload.spotId];
            console.log('......newState after delete......', newState);
            return newState;
        }

        case UPDATE_SPOT: {
            console.log('.....inside updated Reducer....');
            console.log('......newState before update......', newState);
            return { ...state, [action.spot.id]: action.spot };    
        }

        case  ADD_REVIEW_TO_SPOT : {
            console.log('......inside Add Review reducer state.....', state);
            //state.Reviews.push({action.payload});
            const newState = {...state}
            console.log('... new state ', newState )
            console.log('... payload ', action.payload)
            newState.Reviews.push(action.payload);
            //return { ...state, Reviews: action.payload};
            return {...newState}
        }
 
        default:
            return newState;
    }
};

export default spotsReducer;