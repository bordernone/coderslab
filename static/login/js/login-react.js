'use strict';

const e = React.createElement;
const NAVIGATIONLINKS = {
    register: '/register/',
    login: '/login/',
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
        var redirectTo = GetURLParameter('next');
        if (redirectTo != 0){
            window.location.href = redirectTo;
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

// Google login
const googleSignInContainer = document.querySelector('#googleSignInContainer');
ReactDOM.render(e(GoogleSignInBtn), googleSignInContainer);

// Facebook login
const facebookSignInContainer = document.querySelector('#facebookSignInContainer');
ReactDOM.render(e(FacebookSignInBtn), facebookSignInContainer);