
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AppContext, {AppStateType} from 'Context/app_context.js';

import Login             from 'Routes/login'; 
import Register          from 'Routes/register'; 
import NavBar            from './navbar';
import isAuthenticated   from 'Utility/is_authenticated';
import store             from 'Utility/store';
import Profile           from 'Routes/profile';
import Search            from 'Routes/search';
import NotFound          from 'App/not_found';
import user              from 'Network/user';
import About             from "Routes/about";
import Chat              from "Routes/chat";
import Home              from 'Routes/home';
import ChatNotifications from 'Routes/chat_notifications';
import sharedStyles      from 'Styles/shared.css';

type PrivateRouteProps = {
    location: string,
    path: string,
    component: any
};

function PrivateRoute({ component: Component, ...rest }: PrivateRouteProps) {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}


class App extends React.Component<{}, AppStateType> {
    constructor(){
        super();
        this.state = {
            a: 1,
            isLoggedIn: isAuthenticated(),
            userId: null,
            theme: 'dark',
        }; // appenda theme namn till css style objektet eftersom jag kommer leda "dark_nåt"
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.handleUserInfo = this.handleUserInfo.bind(this);
    }

    async fetchUserInfo(cb) {
      const result = await user.getInfo();
      cb(result);
    }

    handleUserInfo(userInfo) {
      if (!userInfo) { 
        store.setUserId(null);
        this.setState({isLoggedIn: isAuthenticated(), userId: null});
      } else {
        store.setUserId(userInfo.user_id);
        this.setState({isLoggedIn: isAuthenticated(), userId: userInfo.user_id});
      }

    }

    componentDidMount() {
      this.fetchUserInfo(this.handleUserInfo);
    }
 
    render() {
        return (
            <AppContext.Provider value={ 
                {
                    state: this.state,
                    increase: (new_count) => {
                        this.setState({a: new_count});
                    },
                    auth_action: () => {
                        this.fetchUserInfo(this.handleUserInfo);
                    }
                }
            }> 

                <Router>
                    <NavBar />
                    <div className={sharedStyles.stretched_container}>
                      <Switch>
                          <Route        exact path={["/", "/home"]}    component={Home} />
                          <Route        path="/login/"                 component={Login} />
                          <Route        path="/about/"                 component={About} />
                          <Route        path="/register"               component={Register} />
                          <PrivateRoute exact path="/profile/:user_id" component={Profile} />
                          <PrivateRoute exact path='/profile/'         component={() => <Redirect to={`/profile/${store.getUserId()}`}/>}/> 
                          <PrivateRoute path="/search"                 component={Search} />
                          <PrivateRoute path="/chat/:chat_id"          component={Chat} />
                          <PrivateRoute path="/chat-notifications/"    component={ChatNotifications} />
                          <Route        path="*"                       component={NotFound} />
                      </Switch>
                    </div>
                </Router>
            </AppContext.Provider>
        );
    }

}


export default App;