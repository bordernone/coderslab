'use strict';

// Google login
const googleSignInContainer = document.querySelector('#googleSignInContainer');
ReactDOM.render(React.createElement(GoogleSignInBtn), googleSignInContainer);

// Facebook login
const facebookSignInContainer = document.querySelector('#facebookSignInContainer');
ReactDOM.render(React.createElement(FacebookSignInBtn), facebookSignInContainer);