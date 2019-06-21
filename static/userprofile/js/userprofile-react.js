'use strict';

const e = React.createElement;
const profileEditModal2Element = '#profile_details_2_modal';
const profileEditModal1Element = '#profile_details_1_modal';


const ELEMENTSID = {
    inputs: {
        location: '#locationInp',
        website: '#websiteInp',
        school: '#schoolInp',
        college: '#collegeInp',
        work: '#workInp',
        first_name: '#first_name',
        last_name: '#last_name',
        bio: '#userbio',
        facebookprofileurl: '#fb_profile_url',
        linkedinprofileurl: '#linkedin_profile_url',
        instagramprofileurl: '#insta_profile_url',
        twitterprofileurl: '#twitter_profile_url',
    },
}

class profileEditModal2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            locationInp: '',
            websiteInp: '',
            schoolInp: '',
            collegeInp: '',
            workInp: '',
        }

        this.setCurrentInputFields = this.setCurrentInputFields.bind(this);

    }

    componentDidMount() {
        this.setCurrentInputFields();
        this.setInputPopovers();
    }

    setCurrentInputFields() {
        var _this = this;

        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/user/profile/json/",
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (dataObj, status, xhr) {
                if (dataObj.hasOwnProperty('error')) {
                    console.log(dataObj);
                } else {
                    _this.setState({
                        locationInp: dataObj.location,
                        websiteInp: dataObj.website,
                        schoolInp: dataObj.school,
                        collegeInp: dataObj.college,
                        workInp: dataObj.work,
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    onFormSubmit() {
        var _this = this;

        _this.hideAllPopovers()
        //making ajax request
        var payload = {
            location: _this.state.locationInp,
            website: _this.state.websiteInp,
            school: _this.state.schoolInp,
            college: _this.state.collegeInp,
            work: _this.state.workInp,
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
                if (dataObj.hasOwnProperty('success')) {
                    location.reload();
                } else if (dataObj.hasOwnProperty('error')) {
                    var errorMsg = dataObj.error;
                    if (dataObj.hasOwnProperty("at")) {
                        var at = dataObj.at;
                        _this.showPopoverMsg(ELEMENTSID.inputs[at], errorMsg);
                    } else {
                        alert(console.log(errorMsg));
                    }
                } else {
                    console.log(dataObj);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    setInputPopovers() {
        if (document.body.clientWidth < 640) {
            for (var inputField in ELEMENTSID) {
                $(inputField).popover({ content: '', trigger: "manual", placement: 'top' });
            }
        } else {
            for (var inputField in ELEMENTSID) {
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

    render() {
        var _this = this;

        return e("div", {
            className: "modal-dialog"
        }, e("div", {
            className: "modal-content"
        }, e("div", {
            className: "modal-header"
        }, e("h6", {
            className: "modal-title"
        }, "Edit Basic Info"), e("button", {
            type: "button",
            className: "close",
            "data-dismiss": "modal"
        }, "\xD7")), e("div", {
            className: "modal-body"
        }, e("form", null, e("div", {
            className: "form-group"
        }, e("label", {
            htmlFor: "locationInp"
        }, "Location:"), e("input", {
            type: "text",
            className: "form-control",
            id: "locationInp",
            placeholder: "Your location here",
            name: "locationInp",
            value: _this.state.locationInp,
            onChange: function (event) { _this.setState({ locationInp: event.target.value }); }
        })), e("div", {
            className: "form-group"
        }, e("label", {
            htmlFor: "websiteInp"
        }, "Website:"), e("input", {
            type: "text",
            className: "form-control",
            id: "websiteInp",
            placeholder: "Your website url",
            name: "websiteInp",
            value: _this.state.websiteInp,
            onChange: function (event) { _this.setState({ websiteInp: event.target.value }); }
        })), e("div", {
            className: "form-group"
        }, e("label", {
            htmlFor: "schoolInp"
        }, "School:"), e("input", {
            type: "text",
            className: "form-control",
            id: "schoolInp",
            placeholder: "Your school's name",
            name: "schoolInp",
            value: _this.state.schoolInp,
            onChange: function (event) { _this.setState({ schoolInp: event.target.value }); }
        })), e("div", {
            className: "form-group"
        }, e("label", {
            htmlFor: "collegeInp"
        }, "College:"), e("input", {
            type: "text",
            className: "form-control",
            id: "collegeInp",
            placeholder: "Your college's name",
            name: "collegeInp",
            value: _this.state.collegeInp,
            onChange: function (event) { _this.setState({ collegeInp: event.target.value }); }
        })), e("div", {
            className: "form-group"
        }, e("label", {
            htmlFor: "workInp"
        }, "Work:"), e("input", {
            type: "text",
            className: "form-control",
            id: "workInp",
            placeholder: "Your work",
            name: "workInp",
            value: _this.state.workInp,
            onChange: function (event) { _this.setState({ workInp: event.target.value }); }
        })))), e("div", {
            className: "modal-footer"
        }, e("button", {
            type: "button",
            className: "btn btn-primary",
            onClick: function () {
                _this.onFormSubmit();
            },
        }, "Submit"))));
    }
}
const profileEditModal2Container = document.querySelector(profileEditModal2Element);
ReactDOM.render(e(profileEditModal2), profileEditModal2Container);


// profileEditModal1
class profileEditModal1 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstnameInp: '',
            lastnameInp: '',
            bioInp: '',
            facebookprofileurlInp: '',
            linkedinprofileurlInp: '',
            instagramprofileurlInp: '',
            twitterprofileurlInp: '',
        }

        this.setCurrentInputFields = this.setCurrentInputFields.bind(this);

    }

    componentDidMount() {
        this.setCurrentInputFields();
        this.setInputPopovers();
    }

    setCurrentInputFields() {
        var _this = this;

        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/user/profile/json/",
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (dataObj, status, xhr) {
                if (dataObj.hasOwnProperty('error')) {
                    console.log(dataObj);
                } else {
                    _this.setState({
                        firstnameInp: dataObj.first_name,
                        lastnameInp: dataObj.last_name,
                        bioInp: dataObj.bio,
                        facebookprofileurlInp: dataObj.socialLinkFacebook,
                        linkedinprofileurlInp: dataObj.socialLinkLinkedIn,
                        instagramprofileurlInp: dataObj.socialLinkInsta,
                        twitterprofileurlInp: dataObj.socialLinkTwitter,
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    onFormSubmit() {
        var _this = this;

        _this.hideAllPopovers()
        //making ajax request
        var payload = {
            first_name: _this.state.firstnameInp,
            last_name: _this.state.lastnameInp,
            bio: _this.state.bioInp,
            facebookprofileurl: _this.state.facebookprofileurlInp,
            linkedinprofileurl: _this.state.linkedinprofileurlInp,
            instagramprofileurl: _this.state.instagramprofileurlInp,
            twitterprofileurl: _this.state.twitterprofileurlInp,
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
                if (dataObj.hasOwnProperty('success')) {
                    location.reload();
                } else if (dataObj.hasOwnProperty('error')) {
                    var errorMsg = dataObj.error;
                    if (dataObj.hasOwnProperty("at")) {
                        var at = dataObj.at;
                        _this.showPopoverMsg(ELEMENTSID.inputs[at], errorMsg);
                    } else {
                        alert(console.log(errorMsg));
                    }
                } else {
                    console.log(dataObj);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    setInputPopovers() {
        if (document.body.clientWidth < 640) {
            for (var inputField in ELEMENTSID) {
                $(inputField).popover({ content: '', trigger: "manual", placement: 'top' });
            }
        } else {
            for (var inputField in ELEMENTSID) {
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

    render() {
        var _this = this;

        return e("div", {
            className: "modal-dialog"
        }, e("div", {
            className: "modal-content"
        }, e("div", {
            className: "modal-header"
        }, e("h6", null, "Update your profile"), e("button", {
            type: "button",
            className: "close",
            "data-dismiss": "modal"
        }, "\xD7")), e("div", {
            className: "modal-body"
        }, e("form", null, e("div", {
            className: "form-group"
        }, e("label", {
            htmlFor: "first_name"
        }, "Full Name:"), e("input", {
            type: "text",
            className: "form-control",
            placeholder: "First Name",
            id: "first_name",
            value: _this.state.firstnameInp,
            onChange: function (event) { _this.setState({ firstnameInp: event.target.value }) },
        }), e("br", null), e("input", {
            type: "text",
            className: "form-control",
            placeholder: "Last Name",
            id: "last_name",
            value: _this.state.lastnameInp,
            onChange: function (event) { _this.setState({ lastnameInp: event.target.value }) },
        })), e("div", {
            className: "form-group"
        }, e("label", {
            htmlFor: "userbio"
        }, "Bio:"), e("textarea", {
            className: "form-control",
            id: "userbio",
            rows: "3",
            value: _this.state.bioInp,
            onChange: function (event) { _this.setState({ bioInp: event.target.value }) },
        })), e("div", {
            className: "form-group"
        }, e("label", {
            htmlFor: "fb_profile_url"
        }, "Social Profiles:"), e("input", {
            type: "text",
            className: "form-control",
            placeholder: "Facebook profile url",
            id: "fb_profile_url",
            value: _this.state.facebookprofileurlInp,
            onChange: function (event) { _this.setState({ facebookprofileurlInp: event.target.value }) },
        }), e("br", null), e("input", {
            type: "text",
            className: "form-control",
            placeholder: "LinkedIn profile url",
            id: "linkedin_profile_url",
            value: _this.state.linkedinprofileurlInp,
            onChange: function (event) { _this.setState({ linkedinprofileurlInp: event.target.value }) },
        }), e("br", null), e("input", {
            type: "text",
            className: "form-control",
            placeholder: "Instagram profile url",
            id: "insta_profile_url",
            value: _this.state.instagramprofileurlInp,
            onChange: function (event) { _this.setState({ instagramprofileurlInp: event.target.value }) },
        }), e("br", null), e("input", {
            type: "text",
            className: "form-control",
            placeholder: "Twitter profile url",
            id: "twitter_profile_url",
            value: _this.state.twitterprofileurlInp,
            onChange: function (event) { _this.setState({ twitterprofileurlInp: event.target.value }) },
        })), e("div", {
            className: "custom-file"
        }, e("input", {
            type: "file",
            className: "custom-file-input",
            id: "profilePicFile"
        }), e("label", {
            className: "custom-file-label",
            htmlFor: "profilePicFile"
        }, "Choose a profile picture")))), e("div", {
            className: "modal-footer"
        }, e("button", {
            type: "button",
            className: "btn btn-primary",
            onClick: function(){
                _this.onFormSubmit();
            },
        }, "Submit"))));
    }
}
const profileEditModal1Container = document.querySelector(profileEditModal1Element);
ReactDOM.render(e(profileEditModal1), profileEditModal1Container);


class editButton extends React.Component {
    constructor(props) {
        super(props);
    }

    onBtnClick() {
        if (this.props.item == 'namesocialbio') {
            $(profileEditModal1Element).modal('show');
        } else {
            $(profileEditModal2Element).modal('show');
        }
    }

    render() {
        var _this = this;

        return e("a", {
            href: "#",
            className: 'userProfileEditBtn',
            onClick: function onClick(e) {
                e.preventDefault();
                _this.onBtnClick();
            }
        }, e("i", {
            className: "fas fa-pencil-alt"
        }));
    }
}

// Location edit button
const locationBtnContainer = document.querySelector('#locationEditBtnContainer');
if (locationBtnContainer !== null) {
    const locationEditBtn = e(editButton, {
        item: "location",
    });
    ReactDOM.render(locationEditBtn, locationBtnContainer);
}

// website edit button
const websiteBtnContainer = document.querySelector('#websiteEditBtnContainer');
if (websiteBtnContainer !== null) {
    const websiteEditBtn = e(editButton, {
        item: "website",
    });
    ReactDOM.render(websiteEditBtn, websiteBtnContainer);
}

// school edit button
const schoolBtnContainer = document.querySelector('#schoolEditBtnContainer');
if (schoolBtnContainer !== null) {
    const schoolEditBtn = e(editButton, {
        item: "school",
    });
    ReactDOM.render(schoolEditBtn, schoolBtnContainer);
}

// college edit button
const collegeBtnContainer = document.querySelector('#collegeEditBtnContainer');
if (collegeBtnContainer !== null) {
    const collegeEditBtn = e(editButton, {
        item: "college",
    });
    ReactDOM.render(collegeEditBtn, collegeBtnContainer);
}

// work edit button
const workBtnContainer = document.querySelector('#workEditBtnContainer');
if (workBtnContainer !== null) {
    const workEditBtn = e(editButton, {
        item: "work",
    });
    ReactDOM.render(workEditBtn, workBtnContainer);
}

// profile edit button
const namesocialbioContainer = document.querySelector('#namesocialEditBtnContainer');
if (namesocialbioContainer !== null) {
    const namesocialbioEditBtn = e(editButton, {
        item: "namesocialbio",
    });
    ReactDOM.render(namesocialbioEditBtn, namesocialbioContainer);
}