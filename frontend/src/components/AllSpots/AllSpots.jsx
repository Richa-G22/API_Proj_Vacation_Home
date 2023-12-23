import { getAllSpots } from '../../store/spots';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./AllSpots.css";
import { NavLink } from "react-router-dom";

const AllSpots = () => {
    console.log('........inside Spots-----')
    const AllSpots = Object.values(
        useSelector(state => state.spots ? state.spots : [])
    );
    
    const dispatch = useDispatch();
    console.log('########Allspots', AllSpots);
 
    
    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    return (
            <div className="spots-grid"> 
                {AllSpots.map((spot) => (             
                        <NavLink key={spot.id} className="spot-div" to={`/spots/${spot.id}`} title={spot.name}>
                           {console.log('.....spot.....', spot, spot.name)} 
                            <div className="spot-image-div">
                                <img className="spot-image" src={spot.previewImage} alt="preview" />
                            </div>
                            <div className="city-state-stars">
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
                ))}
            </div>   
    );
}

export default AllSpots;