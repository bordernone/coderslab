'use strict';

const e = React.createElement;
const profileEditModal2Element = '#profile_details_2_modal';

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
            "data-dismiss": "modal"
        }, "Submit"))));
    }
}

const profileEditModal2Container = document.querySelector(profileEditModal2Element);
ReactDOM.render(e(profileEditModal2), profileEditModal2Container);


class editButton extends React.Component {
    constructor(props) {
        super(props);
    }

    onBtnClick() {
        $(profileEditModal2Element).modal('show');
    }

    render() {
        var _this = this;

        return e("a", {
            href: "#",
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