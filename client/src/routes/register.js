import React from 'react';
import styles from 'Styles/login.css'; 
import { useState, useContext } from 'react';
import auth from 'Network/auth';
import  { Redirect } from 'react-router-dom';
import WarningComponent  from 'Components/warning_component';
import AppContext from 'Context/app_context.js';
import LoginGuardComponent from 'Components/login_guard_component';

// https://www.freecodecamp.org/news/how-to-get-started-with-react-hooks-controlled-forms-826c99943b92/
function RegisterComponent() {

    const emailPlaceholder: string = 'email';
    const passwordPlaceholder: string = 'password';
    const rePasswordPlaceholder: string = 'repeat password';
    const usernamePlaceholder: string = 'username';

    const context = useContext(AppContext);
    const [warning, setWarning] = useState({visible: false, text: ""});

    const[username, setUsername] = useState("");
    (username: string);

    const [email, setEmail] = useState("");
    (email: string);

    const [password, setPassword] = useState("");
    (password: string);

    const [rePassword, setRePassword] = useState("");
    (rePassword: string);

    const [redirectPath, setRedirectPath] = useState(null);

    async function submitOnClickhandler(e){
      e.preventDefault();

      const re = /[^@]+@[^\\.]+\..+/;

      if(username.length < 4) {
        setWarning({visible: true, text: "Too short username"});
        showMessage();
      }
      else if(username.length > 20) {
        setWarning({visible: true, text: "Too long username"});
        showMessage();
      }
      else if (!re.test(email)) {
        setWarning({visible: true, text: "Wrong email type"});
        showMessage();
      }
      else if(password.length < 8) {
        setWarning({visible: true, text: "Too short password"});
        showMessage();
      }
      else if(password.length > 120) {
        setWarning({visible: true, text: "Too long password"});
        showMessage();
      }
      else if(password != rePassword) {
        setWarning({visible: true, text: "The passwords are not the same!!!!"});
        showMessage();
      }
      else {
        const result = await auth.createAccount(username, email, password);
        if(result) { setRedirectPath('/login'); }
      }
    }

    function showMessage(){
        return warning.visible ? <WarningComponent text={warning.text} /> : null;
    }

    function registerView() {
      return (<div className={styles.loginform}>
        {showMessage()}
        <form>
          <div id="fields">
            <label>           
              <input id="username"type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={usernamePlaceholder}/>
            </label>
            <label>           
              <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={emailPlaceholder}/>
            </label>
            <label>           
              <input id="password"type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={passwordPlaceholder}/>
            </label>
            <label>           
              <input id="rePassword"type="password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} placeholder={rePasswordPlaceholder}/>
            </label>
          </div>
            <input type="submit" value="Register" onClick={(e) => submitOnClickhandler(e)} />
        </form>
      </div>);
    }


    function renderView() {
        if (redirectPath) {
          return <Redirect to={`${redirectPath}`} />;
        }
        return registerView();
    }
    if(context.state.isLoggedIn) { return <LoginGuardComponent />; }
    return (renderView());
}

export default RegisterComponent;