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
        $(ELEMENTSID.usernameInput).popover({ content: '', trigger: "manual" });
        $(ELEMENTSID.emailInput).popover({ content: '', trigger: "manual" });
        $(ELEMENTSID.passwordInput).popover({ content: '', trigger: "manual" });
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
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (data, status, xhr) {
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
                console.log(data);
            },
            error: function (xhr, status, error) {
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
    }

    componentDidMount() {
        window.gapi.signin2.render(
            GOOGLE_BUTTON_ID,
            {
                scope: 'profile email',
                width: 90,
                height: 30,
                onsuccess: this.onSignIn,
            },
        );
    }


    onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        var id_token = googleUser.getAuthResponse().id_token;
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        console.log('IDTOKEN: ' + id_token);

        // variables
        var fullname = profile.getName();
        var imgurl = profile.getImageUrl();
        var email = profile.getEmail();
        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/login/google/",
            data: {
                fullname: fullname,
                imgurl: imgurl,
                email: email,
                idtoken: id_token,
            },
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (data, status, xhr) {
                console.log(data);
            },
            error: function (xhr, status, error) {
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