
import React, {useContext} from 'react';
import styles              from 'Styles/home.scss'; 
import sharedStyles        from 'Styles/shared.css';
import { Link }            from 'react-router-dom';
import AppContext          from 'Context/app_context.js';
import LoginGuardComponent from 'Components/login_guard_component';

function Home() {
  // Declare a new state variable, which we'll call "count"
  const context = useContext(AppContext);
  if(context.state.isLoggedIn) { return <LoginGuardComponent />; }
  return (
        <div className={[sharedStyles.height_fill_container, sharedStyles.centered].join(' ')}>
            <p className={styles.explore_text}> Explore the platform and make friends, lol. </p>
            <Link to='/register'><button className={styles.rubber_button}>Register now</button></Link>
        </div>
  );
}

export default Home;