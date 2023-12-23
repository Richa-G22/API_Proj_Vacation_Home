import { useState} from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        console.log('......message...', data.message)
        console.log('......data.......',data)
        console.log('.....datatype of data.....', typeof(data))
        console.log('.....errors.....', errors)
        
        if (data) {
          console.log('......inside if loop....', data.message);
          //setErrors((errors) => ({ ...errors, ...data.message }));
          setErrors({'credential' : "The provided credentials were invalid"});
        } 
        
      });
  };
 
  console.log('.....login.....', credential);
  console.log('.....password.....', password);
  

  return (
    <>
        <div>
            <h1 className="log-in">Log In</h1>
        </div>

          <div className="login-input-fields-div">
          {errors.credential && (<p className='error'>{errors.credential}</p>)}
            <form onSubmit={handleSubmit}>
              <div>
                  <input className='form-input-fields'
                    type="text"
                    placeholder='Username or Email'
                    value={credential}
                    onChange={(e) => {setErrors({}),setCredential(e.target.value)}}
                    required
                  />
              </div>
              <br></br>
                
              <div>
                  <input className='form-input-fields'
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => {setErrors({}),setPassword(e.target.value)}}
                    required
                  /> 
              </div>
              <br></br>

              <div>
                    <button className="log-in-button" type="submit" disabled=
                    {credential.length <= 3 || password.length <= 5}>Log In</button>
              </div>
              <br></br>

              <div>
                    <button
                      className="demo-user-button" type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        setCredential("Demo-lition"),
                        setPassword("password")}}
                    >
                      Log in as Demo User
                    </button>
              </div>      
            </form>
          </div>    
    </>
  );
}

export default LoginFormModal;