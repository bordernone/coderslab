'use strict';

const accountsettingsBackBtnContainer = document.querySelector('#accountSettingsBackBtnContainer');
const accountSettingsBackBtnElement = React.createElement(backBtn, {
    defaultredirect: '/practice/',
});
ReactDOM.render(accountSettingsBackBtnElement, accountsettingsBackBtnContainer);

class accountsettingsInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            isInputDisabled: true,
            inputType: 'text',
        }

        this.inputElementId = this.props.item + 'ReactInput';
        this.getInitialValue = this.getInitialValue.bind(this);
        this.toggleInputDisable = this.toggleInputDisable.bind(this);
        this.onEditBtnClick = this.onEditBtnClick.bind(this);
    }

    componentDidMount() {
        if (this.props.isInputDisabled) this.setState({ isInputDisabled: this.props.isInputDisabled });
        if (this.props.inputType) this.setState({ inputType: this.props.inputType });

        this.getInitialValue();
        this.addPopover();
    }

    addPopover() {
        $('#' + this.inputElementId).popover({
            content: '',
            trigger: 'manual',
        })
    }

    showPopoverMsg(id, message) {
        $(id).attr('data-content', message);
        $(id).popover('show');
    }

    hideAllPopovers() {
        $('input').popover('hide');
    }

    onInputChange(newValue) {
        this.setState({
            value: newValue,
        });
    }

    onEditBtnClick() {
        this.hideAllPopovers();
        var _this = this;

        if (_this.state.isInputDisabled == false) {
            // update the requested item
            let itemKey = this.props.item;
            let value = this.state.value;
            let payload = {};
            payload[itemKey] = value;
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                type: "POST",
                url: "/user/profile/update/",
                data: payload,
                beforeSend: function (xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                },
                success: function (dataObj, status, xhr) {
                    if (dataObj.hasOwnProperty('success')) {
                        _this.toggleInputDisable();
                    } else if (dataObj.hasOwnProperty('error')) {
                        let errorMsg = dataObj.error;
                        _this.showPopoverMsg('#' + _this.inputElementId, errorMsg);
                    } else {
                        console.log(dataObj);
                        alert('Something went wrong');
                    }
                },
                error: function (xhr, status, error) {
                    console.log(error);
                }
            });
        } else {
            this.toggleInputDisable();
        }

    }

    toggleInputDisable() {
        this.hideAllPopovers();

        var _this = this;
        if (this.state.isInputDisabled == true) {
            this.setState({
                isInputDisabled: false,
            }, function () {
                _this.inputRef.focus();
            });
        } else {
            this.setState({
                isInputDisabled: true,
            });
        }
    }

    getInitialValue() {
        if (this.props.item == 'password') {
            this.setState({
                value: '****',
            });
        } else {
            var _this = this;

            var payload = {
                q: _this.props.item,
            };

            var csrftoken = getCookie('csrftoken');
            $.ajax({
                type: "GET",
                url: "/user/profile/json/",
                data: payload,
                beforeSend: function (xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                },
                success: function (dataObj, status, xhr) {
                    if (dataObj.hasOwnProperty(_this.props.item)) {
                        _this.setState({
                            value: dataObj[_this.props.item],
                        });
                    } else {
                        console.log(dataObj);
                        alert('Something went wrong');
                    }
                },
                error: function (xhr, status, error) {
                    console.log(error);
                }
            });
        }
    }

    render() {
        var _this = this;

        if (_this.props.item == 'email') {
            return React.createElement("span", null, React.createElement("input", {
                type: _this.state.inputType,
                value: _this.state.value,
                className: "accountSettingsItemValueInput",
                disabled: _this.state.isInputDisabled,
                onChange: function (event) {
                },
            }));
        } else {
            return React.createElement("span", null, React.createElement("input", {
                type: _this.state.inputType,
                value: _this.state.value,
                className: "accountSettingsItemValueInput",
                disabled: _this.state.isInputDisabled,
                onChange: function (event) {
                    _this.onInputChange(event.target.value);
                },
                ref: function ref(input) {
                    _this.inputRef = input;
                },
                id: _this.inputElementId,
            }), React.createElement("span", {
                className: (_this.state.isInputDisabled ? "fas fa-pencil-alt" : "fas fa-check text-success") + " accountSettingsItemEditButton",
                onClick: function () {
                    _this.onEditBtnClick();
                },
            }));
        }
    }
}

const accountSettingsUsernameInputContainer = document.querySelector('#accountSettingsUsernameInpContainer');
let usernameInpElement = React.createElement(accountsettingsInput, {
    item: 'username',
    isInputDisabled: true,
    inputType: 'text',
});
ReactDOM.render(usernameInpElement, accountSettingsUsernameInputContainer);

const accountSettingsFirstnameContainer = document.querySelector('#accountSettingsFirstnameInpContainer');
let firstnameInpElement = React.createElement(accountsettingsInput, {
    item: 'first_name',
    isInputDisabled: true,
    inputType: 'text',
});
ReactDOM.render(firstnameInpElement, accountSettingsFirstnameContainer);

const accountSettingsLastnameContainer = document.querySelector('#accountSettingsLastnameInpContainer');
let lastnameInpElement = React.createElement(accountsettingsInput, {
    item: 'last_name',
    isInputDisabled: true,
    inputType: 'text',
});
ReactDOM.render(lastnameInpElement, accountSettingsLastnameContainer);

const accountSettingsEmailContainer = document.querySelector('#accountSettingsEmailInpContainer');
let emailInpElement = React.createElement(accountsettingsInput, {
    item: 'email',
    isInputDisabled: true,
    inputType: 'text',
});
ReactDOM.render(emailInpElement, accountSettingsEmailContainer);

const accountSettingsPasswordContainer = document.querySelector('#accountSettingsPasswordInpContainer');
let passwordInpElement = React.createElement(accountsettingsInput, {
    item: 'password',
    isInputDisabled: true,
    inputType: 'password',
});
ReactDOM.render(passwordInpElement, accountSettingsPasswordContainer);

// switch
class accountSettingsImpEmailSwitch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: false,
        }

        this.getInitialValue = this.getInitialValue.bind(this);
    }

    componentDidMount() {
        this.getInitialValue();
    }

    getInitialValue() {
        var _this = this;

        var payload = {
            q: _this.props.item,
        };

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "GET",
            url: "/user/profile/json/",
            data: payload,
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (dataObj, status, xhr) {
                if (dataObj.hasOwnProperty(_this.props.item)) {
                    _this.setState({
                        value: dataObj[_this.props.item],
                    });
                } else {
                    console.log(dataObj);
                    alert('Something went wrong');
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    switchChange() {
        var _this = this;
        var newValue;
        if (_this.state.value == true) {
            this.setState({
                value: false,
            });
            newValue = false;
        } else {
            this.setState({
                value: true,
            });
            newValue = true;
        }
        let payload = {
            'receiveImpEmail': newValue,
        };
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/user/profile/update/",
            data: payload,
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (dataObj, status, xhr) {
                if (dataObj.hasOwnProperty('success') == false) {
                    console.log(dataObj);
                    alert('Something went wrong');
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    render() {
        var _this = this;

        return React.createElement("label", {
            className: "switch noMargin"
        }, React.createElement("input", {
            type: "checkbox",
            checked: _this.state.value,
            onChange: function () {
                _this.switchChange();
            },
        }), React.createElement("span", {
            className: "slider round"
        }), React.createElement("span", {
            className: "sliderStatus"
        }, _this.state.value == true ? "ON" : "OFF"));
    }
}

const accountSettingsImpEmailContainer = document.querySelector('#accountSettingsImpEmailContainer');
let impEmailElement = React.createElement(accountSettingsImpEmailSwitch, {
    item: 'receiveImpEmail',
});
ReactDOM.render(impEmailElement, accountSettingsImpEmailContainer);