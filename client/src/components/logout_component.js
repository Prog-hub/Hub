import React, {useContext} from 'react';
import auth from 'Network/auth';
import AppContext from 'Context/app_context.js';

function LogoutComponent() {
    const app_context = useContext(AppContext);
    
    async function logout(){
        const result = await auth.logout();
        if (result) {
            app_context.auth_action();
        }
    }

    return ( <input type="submit" onClick={() => logout()}  value="Logout" /> );
}

export default LogoutComponent;