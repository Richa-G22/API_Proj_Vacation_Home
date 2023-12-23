import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { updateSpotThunk, getDetailSpot } from '../../store/spots';
import "./UpdateSpot.css";

const UpdateSpot = () => {
  const { spotId } = useParams();

  const currentSpot = useSelector((state) => state.spots ? state.spots[spotId] : null)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState(currentSpot?.country);
  const [address, setAddress] = useState(currentSpot?.address);
  const [city, setCity] = useState(currentSpot?.city);
  const [state, setState] = useState(currentSpot?.state);
  const [lat, setLat] = useState(currentSpot?.lat);
  const [lng, setLng] = useState(currentSpot?.lng);
  const [name, setName] = useState(currentSpot?.name);
  const [description, setDescription] = useState(currentSpot?.description);
  const [price, setPrice] = useState(currentSpot?.price);
  const [previewImage, setPreviewImage] = useState(currentSpot?.previewImage);
  const [image1, setImage1] = useState(currentSpot?.image1);
  const [image2, setImage2] = useState(currentSpot?.image2);
  const [image3, setImage3] = useState(currentSpot?.image3);
  const [image4, setImage4] = useState(currentSpot?.image4);
  const [errors, setErrors] = useState({});

// const currentSpot = useSelector((state) => state.spots[spotId]);

  useEffect(() => {
    dispatch(getDetailSpot(spotId));
  }, [dispatch, spotId]);

  if (!currentSpot) { 
    return <h1>Loading...</h1>
  }

  console.log('..current spot...', currentSpot)

  const validate = () => {
    setErrors({});
    console.log('.......inside validate........')

    if (!country) 
      setErrors((errors) => ({ ...errors, country: "Country is required" }));
      console.log('...........inside country loop...........')
      console.log('........country.....', country);

    if (!address)
      setErrors((errors) => ({ ...errors, address: "Address is required" }));
      console.log('...........inside address loop...........')
      console.log('........address.....', address);

    if (!city) 
      setErrors((errors) => ({ ...errors, city: "City is required" }));

    if (!state)
      setErrors((errors) => ({ ...errors, state: "State is required" }));

    if (!lat)
      setErrors((errors) => ({ ...errors, lat: "Latitude is required" }));

    if (!lng)
      setErrors((errors) => ({ ...errors, lng: "Longitude is required" }));

    if (!description || description.length < 30)
      setErrors((errors) => ({ ...errors,description: "Description needs a minimum of 30 characters"}));

    if (!name) 
      setErrors((errors) => ({ ...errors, name: "Name is required" }));

    if (!price)
      setErrors((errors) => ({ ...errors, price: "Price is required" }));

    if (!previewImage)
    {console.log('........inside  previewImge looop......')
      setErrors((errors) => ({ ...errors, previewImage: "Preview Image is required" }));
    }
/*    else if (
      !previewImage.endsWith(".png") && 
      !previewImage.endsWith(".jpg") && 
      !previewImage.endsWith(".jpeg")
    ) {
      setErrors((errors) => ({ ...errors, previewImage: "Image URL must end in .png, .jpg, or .jpeg"}));
    }*/

    if (
        image1 && (
        !image1.endsWith(".png") && 
        !image1.endsWith(".jpg") && 
        !image1.endsWith(".jpeg") )
    ) {
        setErrors((errors) => ({ ...errors, image1: "Image URL must end in .png, .jpg, or .jpeg"}));
    }
  
    if (
        image2 && (
        !image2.endsWith(".png") && 
        !image2.endsWith(".jpg") && 
        !image2.endsWith(".jpeg") )
    ) {
        setErrors((errors) => ({ ...errors, image2: "Image URL must end in .png, .jpg, or .jpeg"}));
    }
  
    if (
        image3 && (
        !image3.endsWith(".png") && 
        !image3.endsWith(".jpg") && 
        !image3.endsWith(".jpeg") )
    ) {
        setErrors((errors) => ({...errors, image3: "Image URL must end in .png, .jpg, or .jpeg"}));
    }
  
    if (
        image4 && (
        !image4.endsWith(".png") && 
        !image4.endsWith(".jpg") &&
        !image4.endsWith(".jpeg"))
    ) {
        setErrors((errors) => ({...errors, image4: "Image URL must end in .png, .jpg, or .jpeg"}));
    }
  };

/*const {
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
  } = currentSpot;*/

//if (!SpotImages) { 
//    return <h1>Loading...</h1>
//}

/*const previewImage = SpotImages.find((img) => img.preview === true);
      if (!previewImage) { 
        return <h1>Loading...</h1>
}*/

const handleSubmit = async (e) => {
    console.log('......errors datatype', typeof(errors));
    console.log('........state..........', state);
    console.log('..........inside handle submit..........');
    e.preventDefault();
    console.log('.........moving on to validate function..........');
    validate();
    console.log('.........found errors............', errors);
    //setErrors({});

    if (JSON.stringify(errors) === '{}') {
        const newSpot =  await dispatch(
            updateSpotThunk(spotId,{
                country,
                address,
                city,
                state,
                lat,
                lng,
                name,
                description,
                price
            })
        ).catch(async (res) => {
            const data = await res.json();
            console.log('......data.......',data)
            console.log('.....errors.....', errors)
            console.log('..........newSpot.........', newSpot);
            
            if (data && data.errors) {
                setErrors((errors) => ({ ...errors, ...data.errors }));
            } 
        });
       
            navigate(`/spots/${spotId}`);
        
    }
}


return (
    <form className="create-spot-form" onSubmit={handleSubmit}>
        <h2>Update your Spot</h2>
        <div>
    <h3 className="section-h3">Where&apos;s your place located?</h3>
    <p className="section-p">
      Guests will only get your exact address once they booked a
      reservation.
    </p>
  </div>

  <div className="input-row">
    <label htmlFor="country">
      Country<span className="error">{errors.country}</span>
    </label>
    <input
      className="input-wide"
      type="text"
      defaultValue={currentSpot.country}
      onChange={(e) => setCountry(e.target.value)}
      placeholder="Country"
      id="country"
    ></input>
  </div>

  <div className="input-row">
    <label htmlFor="street-address">
      Street Address <span className="error">{errors.address}</span>
    </label>
    <input
      className="input-wide"
      type="text"
      defaultValue = {currentSpot.address}
      onChange={(e) => setAddress(e.target.value)}
      placeholder="Address"
      id="street-address"
    />
  </div>

  <div className="input-row-two-col">
    <div className="small-input-div" style={{ width: "50%" }}>
      <label htmlFor="city">
        City <span className="error">{errors.city}</span>
      </label>
      <input
        type="text"
        defaultValue = {currentSpot.city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
        id="city"
      />
    </div>
    <div>&nbsp;,&nbsp;</div>
    <div className="small-input-div" style={{ width: "50%" }}>
      <label htmlFor="state">
        State <span className="error">{errors.state}</span>
      </label>
      <input
        type="text"
        defaultValue={currentSpot.state}
        //value = {currentSpot.state}
        onChange={(e) => setState(e.target.value)}
        //onSubmit={(e) => setState(e.target.value)}
        placeholder="State"
        id="state"
      />
    </div>
  </div>

  <div className="input-row-two-col">
    <div className="small-input-div" style={{ width: "50%" }}>
      <label htmlFor="latitude">
        Latitude <span className="error" style={{ paddingLeft: "2", marginLeft: "2" }}>{errors.lat}</span>
      </label>
      <input
        type="text"
        defaultValue={currentSpot.lat}
        onChange={(e) => setLat(e.target.value)}
        placeholder="Latitude"
        id="latitude"
      />
    </div>
    
    <div>&nbsp;,&nbsp;</div>
    <div className="small-input-div" style={{ width: "50%" }}>
      <label htmlFor="longitude">
        Longitude <span className="error" style={{ paddingLeft: "0", marginLeft: "0" }}>{errors.lng}</span>
      </label>
      <input
        type="text"
        defaultValue={currentSpot.lng}
        onChange={(e) => setLng(e.target.value)}
        placeholder="Longitude"
        id="longitude"
      />
    </div>  
  </div>
  

  <div className="inner-section-div">
    <h3 className="section-h3">Describe your place to guests</h3>
    <p className="section-p">
      Mention the best features of your space, any special amenities like
      fast wif or parking, and what you love about the neighborhood.
    </p>
  </div>
  <div>
    <textarea
      className="input-wide"
      rows="10"
      defaultValue={currentSpot.description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Please write at least 30 characters"
      id="place-description"
    />
    {errors.description && <p className="error">{errors.description}</p>}
  </div>

  <div className="inner-section-div">
    <h3 className="section-h3">Create a title for your spot</h3>
    <p className="section-p">
      Catch guests&apos; attention with a spot title that highlights what makes
      your place special.
    </p>
  </div>
  <div>
    <input
      className="input-wide"
      type="text"
      defaultValue={currentSpot.name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Name of your spot"
      id="spot-name"
    />
    {errors.name && <p className="error">{errors.name}</p>}
  </div>

  <div className="inner-section-div">
    <h3 className="section-h3">Set a base price for your spot</h3>
    <p className="section-p">
      Competitive pricing can help your listing stand out and rank higher in
      search results.
    </p>
  </div>
  <div>
    <label htmlFor="price">$ </label>
    <input
      style={{ width: "95%" }}
      type="text"
      defaultValue={currentSpot.price}
      onChange={(e) => setPrice(e.target.value)}
      placeholder="Price per night (USD)"
      id="price"
    />
    {errors.price && <p className="error">{errors.price}</p>}
  </div>

  <div className="inner-section-div">
  
    <h3 className="section-h3">Liven up your spot with photos</h3>
    <p className="section-p">
      Submit a link to at least one photo to publish your spot
    </p>
  </div>
  <div>
    <div className="input-image-div">
      <input
        className="input-wide"
        type="text"
        defaultValue={currentSpot.previewImage}
        onChange={(e) => setPreviewImage(e.target.value)}
        placeholder="Preview Image URL"
        id="previewImage"
      />
    {errors.previewImage && <p className="error">{errors.previewImage}</p>}  
    </div>

    <div className="input-image-div">
      <input
        className="input-wide"
        type="text"
        defaultValue={currentSpot.image1}
        onChange={(e) => setImage1(e.target.value)}
        placeholder="Image URL"
        id="image1"
      />
      {errors.image1 && <p className="error">{errors.image1}</p>}
    </div>

    <div className="input-image-div">
      <input
        className="input-wide"
        type="text"
        defaultValue={currentSpot.image2}
        onChange={(e) => setImage2(e.target.value)}
        placeholder="Image URL"
        id="image2"
      />
      {errors.image2 && <p className="error">{errors.image2}</p>}
    </div>

    <div className="input-image-div">
      <input
        className="input-wide"
        type="text"
        defaultValue={currentSpot.image3}
        onChange={(e) => setImage3(e.target.value)}
        placeholder="Image URL"
        id="image3"
      />
      {errors.image3 && <p className="error">{errors.image3}</p>}
    </div>

    <div className="input-image-div">
      <input
        className="input-wide"
        type="text"
        defaultValue={currentSpot.image4}
        onChange={(e) => setImage4(e.target.value)}
        placeholder="Image URL"
        id="image4"
      />
      {errors.image4 && <p className="error">{errors.image4}</p>}
    </div>
  </div>

  <div className="submit-button-div">
    <button className="submit-button" type="submit">
      Update your Spot
    </button>
  </div>
</form>
)
}

export default UpdateSpot;