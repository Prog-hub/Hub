import React, {useContext} from 'react';
import styles from 'Styles/nav.css';
import { Link } from 'react-router-dom';
import isAuthenticated from 'Utility/is_authenticated';
import LogoutComponent from 'Components/logout_component';
import AppContext from 'Context/app_context.js';


type NavItemProps = { path: string, title: string }

function NavItem(props: NavItemProps) {
    return ( <li><Link to={props.path}>{props.title}</Link></li> );
}

function navObject(protect, hideOnLogin, item_info, i) {
    return {
        protected: protect,
        hideOnLogin: hideOnLogin,
        object:  <NavItem key={i} {...item_info}/>
    };
}


function NavBar() {
    const context = useContext(AppContext);
    let navItems = [
        navObject(false, true,  { title: 'Home',    path: '/home' }, 0),
        navObject(true,  false, { title: 'Profile', path: `/profile/${context.state.userId}` }, 1),
        navObject(true,  false, { title: 'Chats',  path: '/chat-notifications' }, 2),
        navObject(true,  false, { title: 'Search',  path: '/search' }, 3),
        navObject(false, false, { title: 'About',   path: '/about'}, 4),
    ];

    if (isAuthenticated()) {
        navItems = navItems.filter(item => !item.hideOnLogin);
        navItems = navItems.map((item) => item.object);
        navItems.push(<li key={5}> <LogoutComponent /> </li>);
    } else {
        navItems = navItems.reduce((result, item) => {
             if (item.protected) {
                 return result;
             }
             result.push(item.object);
             return result;
        }, []);
        navItems.push(<NavItem key={6} title={'login'} path={'/login' }/>);
    }

    return (
        <React.Fragment>
            <ul className={styles.nav_list}>
                {navItems}
            </ul>
        </React.Fragment>
    );
}


export default NavBar;