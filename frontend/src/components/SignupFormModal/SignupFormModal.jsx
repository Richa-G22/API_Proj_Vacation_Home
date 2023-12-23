import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';


function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          console.log('.......data.......', data);
          if (data && data.errors) {
            setErrors({...data.errors });
            console.log('......data.errors....', data.errors);
            console.log('.....email....', email);
            console.log('.....username....', username);
          //  setErrors(data.errors);
          }
        });
    }
    return setErrors({...errors,
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <div>
          <h1 className="sign-up">Sign Up</h1>
      </div>
    
      {errors.firstName && <p className="error">{errors.firstName}</p>}
      {errors.lastName && <p className="error">{errors.lastName}</p>}
      {errors.email && <p className="error">{errors.email}</p>}
      {errors.username && <p className="error">{errors.username}</p>}
      {errors.password && <p className="error">{errors.password}</p>}
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

      <div className='input-fields-div'>
      <form onSubmit={handleSubmit}>
        <div>
          <input className='input'
            type="text"
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          /> 
        </div>
        <br></br>

        <div>
          <input className='input'
            type="text"
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          /> 
        </div>
        <br></br>
        
        <div>
          <input className='input'
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /> 
        </div>
        <br></br>

        <div>
          <input className='input'
            type="text"
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          /> 
        </div>   
        <br></br> 
        
        <div>
          <input className='input'
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /> 
        </div>
        <br></br>

        <div>   
          <input className='input'
            type="password"
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          /> 
        </div> 
        <br></br> 
        
        <button className="sign-up-button" type="submit" disabled={
          email.length === 0 || username.length < 4 ||
          firstName.length === 0 || lastName.length === 0 ||
          password.length < 6 || confirmPassword.length === 0
        }>Sign Up</button> 
       
      </form>
      </div>
    </>
  );
}

export default SignupFormModal;