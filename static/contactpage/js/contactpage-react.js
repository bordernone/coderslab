'use strict';

class ContactUsBtn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            sent: false,
        }

        this.sendMsg = this.sendMsg.bind(this);

        this.ELEMENTSID = {
            full_name: '#full_name',
            email: '#email',
            subject: '#subject',
            message: '#message',
        };
    }

    onBtnClick() {
        this.sendMsg()
        this.setInputPopovers();
    }

    setInputPopovers() {
        var _this = this;
        if (document.body.clientWidth < 640) {
            for (var inputField in _this.ELEMENTSID) {
                $(inputField).popover({ content: '', trigger: "manual", placement: 'top' });
            }
        } else {
            for (var inputField in _this.ELEMENTSID) {
                $(inputField).popover({ content: '', trigger: "manual" });
            }
        }
    }

    showPopoverMsg(id, message) {
        $(id).attr('data-content', message);
        $(id).popover('show');
    }

    hideAllPopovers() {
        $('input').popover('hide');
    }

    sendMsg() {
        this.hideAllPopovers();

        var _this = this;
        _this.setState({
            isLoading: true,
        });
        // get all values
        var full_name = $(_this.ELEMENTSID.full_name).val();
        var email = $(_this.ELEMENTSID.email).val();
        var subject = $(_this.ELEMENTSID.subject).val();
        var message = $(_this.ELEMENTSID.message).val();

        var payload = {
            'full_name': full_name,
            'email': email,
            'subject': subject,
            'message': message,
        };
        // make ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/contact-us/send/",
            data: payload,
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (dataObj, status, xhr) {
                if (dataObj.hasOwnProperty('success')) {
                    _this.setState({
                        isLoading: false,
                        sent: true,
                    });
                } else if (dataObj.hasOwnProperty('error')) {
                    var errorMsg = dataObj.error;
                    if (dataObj.hasOwnProperty("at")) {
                        var at = dataObj.at;
                        _this.showPopoverMsg(_this.ELEMENTSID[at], errorMsg);
                    } else {
                        alert(console.log(errorMsg));
                    }
                    _this.setState({
                        isLoading: false,
                    });
                } else {
                    console.log(dataObj);
                    _this.setState({
                        isLoading: false,
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);

                _this.setState({
                    isLoading:false,
                });
            }
        });
    }

    render() {
        var _this = this;
        if (_this.state.isLoading == true) {
            return React.createElement("button", {
                type: "button",
                className: "btn btn-block formSubmitButton",
                disabled: true,
            }, React.createElement("span", {
                className: "spinner-border spinner-border-sm"
            }), "Send");
        } else if (_this.state.sent == true) {
            return React.createElement("button", {
                type: "button",
                className: "btn btn-block formSubmitButton",
                disabled: true,
            }, "Message Sent!");
        } else {
            return React.createElement("button", {
                type: "button",
                className: "btn btn-block formSubmitButton",
                onClick: function () {
                    _this.onBtnClick();
                },
            }, "Send");
        }
    }
}

const ContactUsBtnContainer = document.querySelector('#contactpageSubmitBtnContainer');
ReactDOM.render(React.createElement(ContactUsBtn), ContactUsBtnContainer);

// back button
const ContactUsBackBtnContainer = document.querySelector('#contactpageBackBtnContainer');
const ContactUsBackBtn = React.createElement(backBtn, {
    defaultredirect: '/',
});
ReactDOM.render(ContactUsBackBtn, ContactUsBackBtnContainer);