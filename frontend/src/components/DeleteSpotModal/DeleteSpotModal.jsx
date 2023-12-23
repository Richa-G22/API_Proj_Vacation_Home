import { deleteSpotThunk } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteSpotModal.css';

function DeleteSpotModal( spotId ) {
  console.log('......spotId inside deleteModal.....',spotId);
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
        <div className='main-div'>
            <h2 style={{ marginBottom: 0, paddingBottom: "0px" }}>Confirm Delete</h2>
            <p style={{ padding: "20px",paddingBottom: "0px",marginTop: 0, fontSize: "19px" }}>
              Are you sure you want to remove this spot <br></br>from the listings?</p>
            <button className='yes-button' onClick={() => dispatch(deleteSpotThunk(spotId))
                    .then(() => closeModal())} >Yes (Delete Spot)
            </button>
            <button className='no-button' onClick={() => closeModal()}>No (Keep Spot)
            </button><br></br>           
        </div>   
  )
}

export default DeleteSpotModal;