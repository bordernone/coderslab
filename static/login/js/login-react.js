'use strict';

const e = React.createElement;
const NAVIGATIONLINKS = {
    register: '/register/',
    login: '/login/',
    resources: '/resources/',
    fbpage: 'https://www.facebook.com/CodersLab-883282698685530',
}
const ELEMENTSID = {
    usernameoremailInput: '#usernameoremailInp',
    passwordInput: '#passwordInp',
}

class LoginBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }

        this.postLogin = this.postLogin.bind(this);
    }

    componentDidMount() {
        var _this = this;

        if (document.body.clientWidth < 640) {
            $(ELEMENTSID.usernameoremailInput).popover({ content: '', trigger: "manual", placement: 'top' });
            $(ELEMENTSID.passwordInput).popover({ content: '', trigger: "manual", placement: 'top' });
        } else {
            $(ELEMENTSID.usernameoremailInput).popover({ content: '', trigger: "manual" });
            $(ELEMENTSID.passwordInput).popover({ content: '', trigger: "manual" });
        }
        // adding on key press trigger
        $(ELEMENTSID.usernameoremailInput).keypress(function(e) {
            if (e.which === 13) {
                _this.onClickLogin();
            }
        });
        $(ELEMENTSID.passwordInput).keypress(function(e) {
            if (e.which === 13) {
                _this.onClickLogin();
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

    postLogin() {
        var redirectTo = GetURLParameter('redirect');
        if (redirectTo != 0){
            window.location.href = '/' + redirectTo;
        } else {
            window.location.href = '/practice/';
        }
    }

    onClickLogin() {
        var _this = this;
        this.setState({
            isLoading: true,
        });

        this.hideAllPopovers();
        var usernameoremail = $(ELEMENTSID.usernameoremailInput).val();
        var password = $(ELEMENTSID.passwordInput).val();
        if (usernameoremail.indexOf('@') > -1) {
            var postReqKey = {
                email: usernameoremail,
                password: password
            };
        } else {
            var postReqKey = {
                username: usernameoremail,
                password: password
            };
        }

        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "native/",
            data: postReqKey,
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function(data, status, xhr) {
                var dataObj = data;
                if (dataObj.hasOwnProperty('error')) {
                    var errorMsg = dataObj.error;
                    if (dataObj.hasOwnProperty('at')) {
                        var occuredAt = dataObj.at;
                        if (occuredAt == 'username' || occuredAt == 'email') {
                            _this.showPopoverMsg(ELEMENTSID.usernameoremailInput, errorMsg);
                        } else if (occuredAt == 'password') {
                            _this.showPopoverMsg(ELEMENTSID.passwordInput, errorMsg);
                        } else {
                            console.log(dataObj);
                        }
                    } else {
                        console.log(dataObj);
                    }
                } else if (dataObj.hasOwnProperty('success')) {
                    if (dataObj.success == true) {
                        _this.postLogin();
                    } else {
                        console.log(dataObj);
                    }
                } else {
                    console.log(data);
                }

                _this.setState({
                    isLoading: false,
                });
            },
            error: function(xhr, status, error) {
                console.log(error);
                _this.setState({
                    isLoading: false,
                });
            }
        });
    }

    render() {
        var _this = this;
        if (_this.state.isLoading == true) {
            return e("button", {
                type: "button",
                className: "btn btn-block formSubmitButton",
                disabled: true
            }, "  ", React.createElement("span", {
                className: "spinner-border spinner-border-sm"
            }), " Sign In");
        } else {
            return e("button", {
                type: "button",
                className: "btn btn-block formSubmitButton",
                onClick: function onClick() {
                    return _this.onClickLogin();
                }
            }, "Sign In");
        }
    }
}

const loginBtnContainer = document.querySelector('#loginBtnContainer');
ReactDOM.render(e(LoginBtn), loginBtnContainer);

// Google sign in button
const GOOGLE_BUTTON_ID = 'google-sign-in-button';
class GoogleSignInBtn extends React.Component {
    constructor(props) {
        super(props);
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


    onSignIn(googleUser) {
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
                console.log(data);
            },
            error: function(xhr, status, error) {
                console.log(error);
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

    onSignIn(accessToken) {
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
                console.log(data);
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