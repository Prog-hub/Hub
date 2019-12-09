function isAuthenticated() {
    const cookie = document.cookie.split('=');
    const isLoggedin: boolean = cookie[0] == 'auth' && cookie[1] == 'true';
    return isLoggedin;
}

export default isAuthenticated;