'use strict';

class backBtn extends React.Component {
    constructor(props) {
        super(props);

        this.onBtnClick = this.onBtnClick.bind(this);
    }

    onBtnClick() {
        var _this = this;
        var redirectTo = GetURLParameter('next');
        if (redirectTo != 0) {
            window.location.href = redirectTo;
        } else if (_this.props.defaultredirect) {
            window.location.href = _this.props.defaultredirect;
        } else {
            window.location.href = '/account/';
        }
    }

    render() {
        var _this = this;

        return React.createElement("span", {
            className: "fas fa-arrow-left",
            onClick: function () {
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
        if (redirectTo != 0) {
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
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (data, status, xhr) {
                if (data.hasOwnProperty('success')) {
                    _this.postLogin();
                } else {
                    console.log(data);
                    alert('Something went wrong! Please try again');
                }
            },
            error: function (xhr, status, error) {
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
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                var accessToken = response.authResponse.accessToken;
                console.log(accessToken);
                _this.onSignIn(accessToken);
            }
        });
    }

    postLogin() {
        var redirectTo = GetURLParameter('next');
        if (redirectTo != 0) {
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
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (data, status, xhr) {
                if (data.hasOwnProperty('success')) {
                    _this.postLogin();
                } else {
                    console.log(data);
                    alert('Something went wrong! Try again in a moment');
                }
            },
            error: function (xhr, status, error) {
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

class FooterSubscription extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: '',
            isLoading: false,
            completed: false,
        }

        this.ELEMENTSID = {
            emailInput: '#subscribeEmailInput',
        }

        this.processSubscription = this.processSubscription.bind(this);
        this.onBtnClick = this.onBtnClick.bind(this);
    }

    componentDidMount() {
        this.setupPopover();
    }

    onBtnClick() {
        this.processSubscription();
    }

    setupPopover() {
        $(this.ELEMENTSID.emailInput).popover({
            content: '', placement: 'top', trigger: 'manual',
        })
    }

    showPopoverMsg(id, message) {
        $(id).attr('data-content', message);
        $(id).popover('show');
    }

    hideAllPopovers() {
        $('input').popover('hide');
    }

    processSubscription() {
        var _this = this;

        // hide popovers
        _this.hideAllPopovers();

        let emailAddress = _this.state.inputValue
        var postReqKey = {
            email: emailAddress
        }
        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/misc/subscribe/",
            data: postReqKey,
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (data, status, xhr) {
                var dataObj = data;
                if (dataObj.hasOwnProperty('error')) {
                    var errorMsg = dataObj.error;
                    if (dataObj.hasOwnProperty('at')) {
                        var occuredAt = dataObj.at;
                        if (occuredAt == 'email') {
                            _this.showPopoverMsg(_this.ELEMENTSID.emailInput, errorMsg);
                        } else {
                            console.log(dataObj);
                        }
                    } else {
                        console.log(dataObj);
                    }
                } else if (dataObj.hasOwnProperty('success')) {
                    if (dataObj.success == true) {
                        _this.setState({
                            completed: true,
                        })
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
            error: function (xhr, status, error) {
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
            return React.createElement("div", {
                className: "subscribeBox"
            }, React.createElement("input", {
                type: "email",
                className: "form-control",
                placeholder: "Enter your email address",
                value: _this.state.value,
                disabled: true,
                id: 'subscribeEmailInput',
            }), React.createElement("button", {
                type: "button",
                className: "btn btn-link",
            }, React.createElement("span", {
                className: "spinner-border text-secondary"
            })));
        } if (_this.state.completed == true) {
            return React.createElement("div", {
                className: "subscribeBox"
            }, React.createElement("input", {
                type: "email",
                className: "form-control",
                placeholder: "Enter your email address",
                value: _this.state.value,
                disabled: true,
                id: 'subscribeEmailInput',
            }), React.createElement("button", {
                type: "button",
                className: "btn btn-link",
            }, React.createElement("span", {
                className: "fas fa-check text-success"
            })));
        } else {
            return React.createElement("div", {
                className: "subscribeBox"
            }, React.createElement("input", {
                type: "email",
                className: "form-control",
                placeholder: "Enter your email address",
                value: _this.state.value,
                id: 'subscribeEmailInput',
                onChange: function (event) {
                    let value = event.target.value;
                    _this.setState({
                        inputValue: value,
                    });
                }
            }), React.createElement("button", {
                type: "button",
                className: "btn btn-link",
                onClick: function () {
                    _this.onBtnClick();
                }
            }, React.createElement("span", {
                className: "fas fa-arrow-right"
            })));
        }
    }
}

class SiteCookieConsent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shouldDisplayConsentPrompt: false,
        }

        this.COOKIECONSENTKEY = 'coderslabcookieconsent';

        this.shouldDisplay = this.shouldDisplay.bind(this);
    }

    componentDidMount() {
        this.shouldDisplay();
    }

    shouldDisplay() {
        var _this = this;
        if (this.getCookie(this.COOKIECONSENTKEY) != '') {
            _this.setState({
                shouldDisplayConsentPrompt: false,
            });
        } else {
            _this.setState({
                shouldDisplayConsentPrompt: true,
            });
        }
    }

    onAcceptBtnClick() {
        this.setCookie(this.COOKIECONSENTKEY, true, 30);
        this.shouldDisplay();
    }

    getCookie(key) {
        var name = key + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    setCookie(key, value, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = key + "=" + value + ";" + expires + ";path=/";
    }


    render() {
        var _this = this;

        if (_this.state.shouldDisplayConsentPrompt == true) {
            return React.createElement("div", {
                className: "siteCookieConsentWrapper"
            }, React.createElement("div", {
                className: "siteCookieConsentText"
            }, React.createElement("span", {
                className: "fas fa-bell"
            }), " By accessing this site, i agree to the ", React.createElement("a", {
                href: "/misc/privacy-policy/"
            }, "Privacy Policy"), " and ", React.createElement("a", {
                href: "/misc/terms-and-conditions/"
            }, "Terms & Conditions"), "."), React.createElement("div", {
                className: "siteCookieConsentButton"
            }, React.createElement("button", {
                type: "button",
                className: "btn btn-success btn-sm",
                onClick: function () {
                    _this.onAcceptBtnClick();
                }
            }, React.createElement("span", {
                className: "fas fa-check"
            }), " Accept")));
        } else {
            return React.createElement('div', null);
        }

    }
}