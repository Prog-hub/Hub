import React,{useContext} from 'react';
import styles from 'Styles/login.css'; 
import { useState } from 'react';
import auth from 'Network/auth';
import LoginGuardComponent from 'Components/login_guard_component';
import AppContext from 'Context/app_context.js';
import RegisterButtonComponent from 'Components/register_button_component';
import WarningComponent  from 'Components/warning_component';

// https://www.freecodecamp.org/news/how-to-get-started-with-react-hooks-controlled-forms-826c99943b92/
function LoginComponent() {

  const emailPlaceholder: string = 'email';
  const passwordPlaceholder: string = 'password';

  const [email, setEmail] = useState("");//("andreas@gmail.com");
  (email: string);

  const [password, setPassword] = useState("");//useState("testtest");
  (password: string);

  const [warning, setWarning] = useState({visible: false, text: ""});
  
  const context = useContext(AppContext);

  async function handleSubmit(event) {
    event.preventDefault();

    const re = /[^@]+@[^\\.]+\..+/;

    if(!re.test(email)){
      setWarning({visible: true, text: "Wrong email type"});
      showMessage();
    }
    else if(password.length < 8 ){
      setWarning({visible: true, text: "Too short password"});
      showMessage();
    }
    else if(password.length > 20 ){
      setWarning({visible: true, text: "Too long password"});
      showMessage();
    }
    else{
      const result = await auth.login(email, password);
  
      if(result) {
        context.auth_action();
      } else {
        setWarning({visible: true, text: "Wrong email or password"});
        showMessage();
      }
    }
    
  }
  function showMessage(){
    return warning.visible ? <WarningComponent text={warning.text} /> : null;
  }


  if(context.state.isLoggedIn) { return <LoginGuardComponent />; }

  return (
          <div className={styles.loginform}>
            {showMessage()}
            <form onSubmit={(e) => handleSubmit(e)} >
            <div id="fields">
              <label>           
                <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={emailPlaceholder}/>
              </label>
              <label>           
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={passwordPlaceholder}  />
              </label>
            </div>
              <input type="submit" value="Login" />
              <input type="submit" value="Forgot password?" />
            </form>

            <RegisterButtonComponent /> 
          </div>
  );
}

export default LoginComponent;