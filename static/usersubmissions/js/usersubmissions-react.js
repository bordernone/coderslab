'use strict';

class UserSubmissions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            dataLimit: 10,
            noMoreSubmissions: false,
            section: 'practice',
            contestCheckbox: false,
            error: false,
            submissions: [
                {
                    title: 'Loading',
                    checked: true,
                    passed: true,
                },
            ]
        }

        this.loadContents = this.loadContents.bind(this);
        this.onCheckboxToggle = this.onCheckboxToggle.bind(this);
    }

    componentDidMount() {
        this.loadContents();
    }

    shouldComponentUpdate(nextProps, nextState) {
        var _this = this;
        if (_this.state.submissions != nextState.submissions || _this.state.isLoading != nextState.isLoading || _this.state.contestCheckbox != nextState.contestCheckbox) {
            return true;
        } else {
            return false;
        }
    }

    onCheckboxToggle() {
        var _this = this;
        if (this.state.contestCheckbox == false) {
            this.setState({
                contestCheckbox: true,
                section: 'contest',
                dataLimit: 10,
                noMoreSubmissions: false,
            }, _this.loadContents);
        } else {
            this.setState({
                contestCheckbox: false,
                section: 'practice',
                dataLimit: 10,
                noMoreSubmissions: false,
            }, _this.loadContents);
        }
    }

    onLoadmoreBtnClick() {
        var _this = this;
        _this.setState({
            dataLimit: _this.state.dataLimit + 10,
        }, _this.loadContents);
    }

    loadContents() {
        var _this = this;
        _this.setState({
            isLoading: true,
        });
        var payload = {
            q: _this.state.section,
            limit: _this.state.dataLimit,
        }

        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "GET",
            url: "/usersubmissions/json/",
            data: payload,
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (dataObj, status, xhr) {
                if (dataObj.hasOwnProperty('submissions')) {
                    if (_this.state.submissions == dataObj.submissions) {
                        _this.setState({
                            noMoreSubmissions: true,
                        });
                    } else {
                        _this.setState({
                            submissions: dataObj.submissions,
                            noMoreSubmissions: false,
                        });
                    }
                } else if (dataObj.hasOwnProperty('error')) {
                    _this.setState({
                        submissions: [],
                    });
                    console.log(dataObj);
                } else {
                    console.log(dataObj);
                }
                _this.setState({
                    isLoading: false,
                });
            },
            error: function (xhr, status, error) {
                console.log(error);
                _this.setState({
                    isLoading: false,
                    error: true,
                });
            }
        });
    }

    render() {
        var _this = this;

        if (_this.state.error == true) {
            return React.createElement("div", {
                className: "text-center text-secondary m-5",
            }, React.createElement("div", null, "Error, please refresh the page."));
        } else if (_this.state.isLoading == true) {
            return React.createElement("div", {
                className: "text-center m-5",
            }, React.createElement("div", {
                className: "spinner-border"
            }));
        } else {
            const submissions = _this.state.submissions.map((submission, index) => {
                if (submission.checked == false) {
                    return React.createElement("tr", {
                        className: "d-flex",
                        key: index,
                    }, React.createElement("td", {
                        className: "flex-grow-1"
                    }, submission.title), React.createElement("td", null, React.createElement("small", {
                        className: "text-warning"
                    }, "(Pending)")));
                } else if (submission.passed == false) {
                    return React.createElement("tr", {
                        className: "d-flex",
                        key: index,
                    }, React.createElement("td", {
                        className: "flex-grow-1"
                    }, submission.title), React.createElement("td", null, React.createElement("small", {
                        className: "text-danger"
                    }, React.createElement("li", {
                        className: "fas fa-times"
                    }))));
                } else {
                    return React.createElement("tr", {
                        className: "d-flex",
                        key: index,
                    }, React.createElement("td", {
                        className: "flex-grow-1"
                    }, submission.title), React.createElement("td", null, React.createElement("small", {
                        className: "text-success"
                    }, React.createElement("li", {
                        className: "fas fa-check"
                    }))));
                }
            });

            const showMoreBtn = (() => {
                if (_this.state.submissions.length >= _this.state.dataLimit && _this.state.noMoreSubmissions == false) {
                    return React.createElement("button", {
                        type: "button",
                        className: "btn btn-light text-secondary",
                        onClick: function(){
                            _this.onLoadmoreBtnClick();
                        },
                    }, "Load more");
                } else {
                    return React.createElement("button", {
                        type: "button",
                        className: "btn btn-light text-secondary",
                        disabled: true,
                    }, "No more submissions");
                }
            });


            return React.createElement("div", null, React.createElement("div", {
                className: "contentCenterWrapperSMExtraInfo d-flex justify-content-end"
            }, React.createElement("div", {
                className: "custom-control custom-switch"
            }, React.createElement("input", {
                type: "checkbox",
                className: "custom-control-input",
                id: "switchContest",
                name: "switchContest",
                checked: _this.state.contestCheckbox,
                onChange: function () {
                    _this.onCheckboxToggle();
                },
            }), React.createElement("label", {
                className: "custom-control-label",
                htmlFor: "switchContest"
            }, React.createElement("small", null, "Show Contest Submissions")))), React.createElement("div", {
                className: "contentCenterBodyWrapper"
            }, React.createElement("div", {
                className: "submissionsDisplayDiv"
            }, React.createElement("table", {
                className: "table text-secondary table-hover"
            }, React.createElement("tbody", null, submissions))), React.createElement("div", {
                className: "loadMoreSubmissionsContainer"
            }, React.createElement(showMoreBtn))));
        }
    }
}

const userSubmissionsContainer = document.querySelector('#userSubmissionsContainer');
ReactDOM.render(React.createElement(UserSubmissions), userSubmissionsContainer);

// back btn
const userSubmissionsBackBtnContainer = document.querySelector('#userSubmissionsBackBtnContainer');
let userSubmissionsBackBtn = React.createElement(backBtn, {
    defaultredirect: '/practice/',
});
ReactDOM.render(userSubmissionsBackBtn, userSubmissionsBackBtnContainer);