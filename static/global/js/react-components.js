'use strict';

class backBtn extends React.Component {
    constructor(props) {
        super(props);

        this.onBtnClick = this.onBtnClick.bind(this);
    }

    onBtnClick(){
        var _this = this;
        var redirectTo = GetURLParameter('next');
        if (redirectTo != 0){
            window.location.href = redirectTo;
        } else if (_this.props.defaultredirect){
            window.location.href = _this.props.defaultredirect;
        } else {
            window.location.href = '/account/';
        }
    }

    render() {
        var _this = this;

        return React.createElement("span", {
            className: "fas fa-arrow-left",
            onClick: function(){
                _this.onBtnClick();
            },
        });
    }
}

// Google sign in button
const GOOGLE_BUTTON_ID = 'google-sign-in-button';
class GoogleSignInBtn extends React.Component {
    constructor(props) {
        super(props);

        this.postLogin = this.postLogin.bind(this);
        this.onSignIn = this.onSignIn.bind(this);
    }

    componentDidMount() {
        window.gapi.signin2.render(
            GOOGLE_BUTTON_ID, {
                scope: 'profile email',
                width: 90,
                height: 30,
                onsuccess: this.onSignIn,
            },
        );
    }

    postLogin() {
        var redirectTo = GetURLParameter('next');
        if (redirectTo != 0){
            window.location.href = redirectTo;
        } else {
            window.location.href = '/practice/';
        }
    }

    onSignIn(googleUser) {
        var _this = this;
        var id_token = googleUser.getAuthResponse().id_token;

        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/login/google/",
            data: {
                idtoken: id_token,
            },
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function(data, status, xhr) {
                if (data.hasOwnProperty('success')){
                    _this.postLogin();
                } else {
                    console.log(data);
                    alert('Something went wrong! Please try again');
                }
            },
            error: function(xhr, status, error) {
                console.log(error);
                alert('Something went wrong! Please try again');
            }
        });
    }

    render() {
        var _this = this;

        return React.createElement("div", {
            id: GOOGLE_BUTTON_ID
        });
    }
}


// facebook login button
const FACEBOOK_BUTTON_ID = 'facebook-sign-in-button';
class FacebookSignInBtn extends React.Component {
    constructor(props) {
        super(props);

        this.checkLoginState = this.checkLoginState.bind(this)
        this.onSignIn = this.onSignIn.bind(this);
    }

    componentDidMount() {
        window['checkLoginState'] = this.checkLoginState;

        var btnElementHtml = '<div class="fb-login-button" data-width="" data-size="medium" data-button-type="login_with" data-auto-logout-link="false" data-use-continue-as="false" scope="public_profile,email" onlogin="checkLoginState"></div>';
        var fbButton = document.getElementById(FACEBOOK_BUTTON_ID);
        fbButton.innerHTML = btnElementHtml;
    }

    componentWillUnmount() {
        delete window['checkLoginState'];
    }

    checkLoginState() {
        var _this = this;
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                var accessToken = response.authResponse.accessToken;
                console.log(accessToken);
                _this.onSignIn(accessToken);
            }
        });
    }

    postLogin() {
        var redirectTo = GetURLParameter('next');
        if (redirectTo != 0){
            window.location.href = redirectTo;
        } else {
            window.location.href = '/practice/';
        }
    }

    onSignIn(accessToken) {
        var _this = this;
        // make ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/login/facebook/",
            data: {
                accesstoken: accessToken,
            },
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function(data, status, xhr) {
                if (data.hasOwnProperty('success')){
                    _this.postLogin();
                } else {
                    console.log(data);
                    alert('Something went wrong! Try again in a moment');
                }
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    }

    render() {
        var _this = this;

        return React.createElement("div", {
            id: FACEBOOK_BUTTON_ID
        });
    }
}