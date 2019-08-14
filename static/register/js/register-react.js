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
                            $.Toast('Warning', 'Username can only contain alphabets, numbers, dashes, and underscore.', 'warning')
                        } else if (dataObj.at == 'email') {
                            _this.showPopoverMsg(ELEMENTSID.emailInput, dataObj.error);
                        } else if (dataObj.at == 'password') {
                            _this.showPopoverMsg(ELEMENTSID.passwordInput, dataObj.error);
                        } else {
                            $.Toast('Error', 'Something went wrong. Please try again.', 'error');
                            console.log(dataObj);
                        }
                    } else {
                        $.Toast('Error', 'Something went wrong. Please try again.', 'error');
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
            }), " Sign Up*");
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
                }, "Sign Up*");
            }
        }
    }
}

const signupBtnContainer = document.querySelector('#signupBtnContainer');
ReactDOM.render(e(SignUpBtn), signupBtnContainer);

// Google login
const googleSignInContainer = document.querySelector('#googleSignInContainer');
//ReactDOM.render(e(GoogleSignInBtn), googleSignInContainer);

// Facebook login
const facebookSignInContainer = document.querySelector('#facebookSignInContainer');
//ReactDOM.render(e(FacebookSignInBtn), facebookSignInContainer);