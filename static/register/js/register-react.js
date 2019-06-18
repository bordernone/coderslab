'use strict';

const e = React.createElement;
const NAVIGATIONLINKS = {
    register: '/register/',
    login: '/login/',
    resources: '/resources/',
    fbpage: 'https://www.facebook.com/CodersLab-883282698685530',
}
const ELEMENTSID = {
    usernameInput: '#usernameInp',
    emailInput: '#emailInp',
    passwordInput: '#passwordInp',
}

// sign up button
class SignUpBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            registerComplete: false,
            successMsg: '',
        }
    }

    componentDidMount() {
        var _this = this;
        if (document.body.clientWidth < 640) {
            $(ELEMENTSID.usernameInput).popover({ content: '', trigger: "manual", placement: 'top' });
            $(ELEMENTSID.emailInput).popover({ content: '', trigger: "manual", placement: 'top' });
            $(ELEMENTSID.passwordInput).popover({ content: '', trigger: "manual", placement: 'top' });
        } else {
            $(ELEMENTSID.usernameInput).popover({ content: '', trigger: "manual" });
            $(ELEMENTSID.emailInput).popover({ content: '', trigger: "manual" });
            $(ELEMENTSID.passwordInput).popover({ content: '', trigger: "manual" });
        }

        // adding on key press trigger
        $(ELEMENTSID.usernameInput).keypress(function(e) {
            if (e.which === 13) {
                _this.onBtnClick();
            }
        });
        $(ELEMENTSID.emailInput).keypress(function(e) {
            if (e.which === 13) {
                _this.onBtnClick();
            }
        });
        $(ELEMENTSID.passwordInput).keypress(function(e) {
            if (e.which === 13) {
                _this.onBtnClick();
            }
        });
    }

    showPopoverMsg(id, message) {
        $(id).attr('data-content', message);
        $(id).popover('show');
    }

    hideAllPopovers() {
        $('input').popover('hide');
    }

    onBtnClick() {
        var _this = this;
        this.setState({
            isLoading: true,
        });

        // hide popover if open
        this.hideAllPopovers();

        // getting all variables
        var username = $(ELEMENTSID.usernameInput).val();
        var email = $(ELEMENTSID.emailInput).val();
        var password = $(ELEMENTSID.passwordInput).val();

        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "user/",
            data: {
                username: username,
                email: email,
                password: password,
            },
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function(data, status, xhr) {
                var dataObj = data;
                if (dataObj.hasOwnProperty('error')) {
                    _this.setState({
                        isLoading: false,
                    });
                    if (dataObj.hasOwnProperty('at')) {
                        if (dataObj.at == 'username') {
                            _this.showPopoverMsg(ELEMENTSID.usernameInput, dataObj.error);
                        } else if (dataObj.at == 'email') {
                            _this.showPopoverMsg(ELEMENTSID.emailInput, dataObj.error);
                        } else if (dataObj.at == 'password') {
                            _this.showPopoverMsg(ELEMENTSID.passwordInput, dataObj.error);
                        } else {
                            alert('Something went wrong. Please try again');
                            console.log(dataObj);
                        }
                    } else {
                        alert('Something went wrong. Please try again');
                        console.log(dataObj);
                    }
                } else if (dataObj.hasOwnProperty('success')) {
                    _this.setState({
                        registerComplete: true,
                        isLoading: false,
                        successMsg: dataObj.success,
                    });
                    console.log(dataObj)
                }
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    }

    render() {
        var _this = this;
        if (this.state.isLoading == true) {
            return e("button", {
                type: "button",
                className: "btn btn-block formSubmitButton",
                onClick: function onClick() {
                    return _this.onBtnClick();
                },
                disabled: true
            }, "  ", e("span", {
                className: "spinner-border spinner-border-sm"
            }), " Sign Up");
        } else {
            if (this.state.registerComplete == true) {
                return e("div", {
                    class: "alert alert-success"
                }, React.createElement("strong", null, "Success!"), _this.state.successMsg);
            } else {
                return e("button", {
                    type: "button",
                    className: "btn btn-block formSubmitButton",
                    onClick: function onClick() {
                        return _this.onBtnClick();
                    }
                }, "Sign Up");
            }
        }
    }
}

const signupBtnContainer = document.querySelector('#signupBtnContainer');
ReactDOM.render(e(SignUpBtn), signupBtnContainer);

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
        var redirectTo = GetURLParameter('redirect');
        if (redirectTo != 0){
            window.location.href = '/' + redirectTo;
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

        return e("div", {
            id: GOOGLE_BUTTON_ID
        });
    }
}

const googleSignInContainer = document.querySelector('#googleSignInContainer');
ReactDOM.render(e(GoogleSignInBtn), googleSignInContainer);


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
                _this.onSignIn(accessToken);
            }
        });
    }

    postLogin() {
        var redirectTo = GetURLParameter('redirect');
        if (redirectTo != 0){
            window.location.href = '/' + redirectTo;
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

        return e("div", {
            id: FACEBOOK_BUTTON_ID
        });
    }
}

const facebookSignInContainer = document.querySelector('#facebookSignInContainer');
ReactDOM.render(e(FacebookSignInBtn), facebookSignInContainer);