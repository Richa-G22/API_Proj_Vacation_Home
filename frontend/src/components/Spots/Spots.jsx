import { getCurrentUserSpots } from '../../store/spots';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./Spot.css";
import { NavLink, useNavigate } from "react-router-dom";
import  OpenModalButton  from "../OpenModalButton";
import  DeleteSpotModal  from "../DeleteSpotModal";

const Spots = () => {
    console.log('........inside Spots-----')
    const currentUserSpots = Object.values(
        useSelector(state => state.spots ? state.spots : [])
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log('########Currentspots', currentUserSpots);
 
    
    useEffect(() => {
        dispatch(getCurrentUserSpots());
    }, [dispatch]);

    console.log('########Allspots', currentUserSpots);


    return (
        <>
        <div>
            <h2>Manage Your Spots</h2>
            {currentUserSpots.length === 0 && (
                <button style={{backgroundColor: "grey", color: "white", boxShadow: "5px 5px 5px black", height: "30px"}} 
                    onClick={() => navigate("/spots/new")}>Create a New Spot 
                </button>
            )}
        </div>
            <div className="grid"> 
                {currentUserSpots.map((spot) => (    
                    <div key={spot.id}>      
                        <NavLink  className="navlink-div" to={`/spots/${spot.id}`} title={spot.name}>
                            <div className="image-div">
                                <img className="image" src ={spot.previewImage} alt="preview" />
                            </div><br></br>
                            <div className="spot-location-stars">
                                <div>{spot.city}, {spot.state}
                                </div>
                                <div>
                                    <i className="fa-solid fa-star"></i>{" "}
                                    <span style={{ fontWeight: "bold" }}>{spot.avgRating > 0 ? spot.avgRating.toFixed(1) : "New"}</span>
                                </div>
                            </div>
                            <div>
                                <span style={{ fontWeight: "bold" }}>${spot.price}</span> night
                            </div>
                            
                        </NavLink> 
                     
                        <div className="buttons">
                                <button style={{backgroundColor: "grey", color: "white", 
                                                boxShadow: "5px 5px 5px black", height: "30px", cursor: "pointer"}} 
                                        onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update
                                </button>   
                                <OpenModalButton style={{backgroundColor: "grey", color: "white", 
                                        boxShadow: "5px 5px 5px black", height: "30px", cursor: "pointer"}}
                                    modalComponent={<DeleteSpotModal spotId={spot.id}  />}
                                    buttonText="Delete"
                                />
                        </div> 
                    </div>
                ))}
            </div>
        </>
    );
}
             
export default Spots;
