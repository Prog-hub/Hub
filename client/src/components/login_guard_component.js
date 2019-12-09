import React from 'react';
import  { Redirect } from 'react-router-dom';
import isAuthenticated from 'Utility/is_authenticated';

const LoginGuardComponent = () => {
    if (isAuthenticated()) {
        return <Redirect to={`/profile`} />;
   } else {
       return <Redirect to='/login' />;
   }
};

export default LoginGuardComponent;