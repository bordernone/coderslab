'use strict';

class Countdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            countdown: {
                days: '-',
                hours: '-',
                minutes: '-',
            },
        }

        this.setupCountdown = this.setupCountdown.bind(this);
        this.initiateCountdown = this.initiateCountdown.bind(this);
    }

    componentDidMount() {
        this.setupCountdown();
    }

    setupCountdown() {
        var _this = this;

        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "nextround/datetime/",
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (dataObj, status, xhr) {
                if (dataObj.hasOwnProperty('datetime')) {
                    var countDownDatetime = dataObj.datetime;
                    _this.initiateCountdown(countDownDatetime)
                } else {
                    console.log(dataObj);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    initiateCountdown(countDownDate) {
        var _this = this;
        var countdown = setInterval(function () {
            var today = new Date().getTime();
            var remaining = countDownDate - today;
            var days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            var hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

            if (remaining >= 0) {
                _this.setState({
                    countdown: {
                        days: days,
                        hours: hours,
                        minutes: minutes,
                    },
                });
            } else {
                console.log(remaining)
            }
        }, 5000);
    }

    render() {
        var _this = this;
        return React.createElement("div", {
            className: "row noMargin timelineTimerWrapper"
        }, React.createElement("div", {
            className: "timelineTimerBoxEach"
        }, React.createElement("div", {
            className: "timelineTimerBox"
        }, React.createElement("h4", null, _this.state.countdown.days)), React.createElement("div", {
            className: "timelineTimerLabelBox"
        }, React.createElement("div", {
            className: "timelineTimerLabel"
        }, React.createElement("h4", null, "Days")))), React.createElement("div", {
            className: "timelineTimerBoxEach"
        }, React.createElement("div", {
            className: "timelineTimerBox"
        }, React.createElement("h4", null, _this.state.countdown.hours)), React.createElement("div", {
            className: "timelineTimerLabelBox"
        }, React.createElement("div", {
            className: "timelineTimerLabel"
        }, React.createElement("h4", null, "Hours")))), React.createElement("div", {
            className: "timelineTimerBoxEach"
        }, React.createElement("div", {
            className: "timelineTimerBox"
        }, React.createElement("h4", null, _this.state.countdown.minutes)), React.createElement("div", {
            className: "timelineTimerLabelBox"
        }, React.createElement("div", {
            className: "timelineTimerLabel"
        }, React.createElement("h4", null, "Minutes")))), React.createElement("div", {
            className: "timelineTimerFooterTextBox"
        }, React.createElement("h3", null, "Until Next Round")));
    }
}

const countdownContainer = document.querySelector('#timelineCountdownContainer');
ReactDOM.render(React.createElement(Countdown), countdownContainer);

class Timeline extends React.Component {
    constructor(props) {
        super(props);

        this.itemIdPrepend = 'timelineItem';

        this.state = {
            isLoading: true,
            noContest: false,

            contest: {
                'id': null,
                'name': null,
            },

            rounds: [
                {
                    'id': null,
                    'name': null,
                    'isActive': false,
                }
            ]
        }

        this.setupConnections = this.setupConnections.bind(this);
        this.getRoundsFromServer = this.getRoundsFromServer.bind(this);
    }

    componentDidMount() {
        this.getRoundsFromServer();
    }

    getRoundsFromServer() {
        var _this = this;

        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "api/activeupcomingroundsdata/",
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (dataObj, status, xhr) {
                if (dataObj.hasOwnProperty('contest')) {
                    _this.setState({
                        contest: {
                            'id': dataObj.contest.id,
                            'name': dataObj.contest.name,
                        },

                        rounds: dataObj.contest.rounds,
                        isLoading: false,
                    }, _this.setupConnections);
                } else if (dataObj.hasOwnProperty('error')) {
                    _this.setState({
                        isLoading: false,
                        noContest: true,
                    });
                    console.log(dataObj);
                } else {
                    console.log(dataObj);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    }

    setupConnections() {
        var _this = this;
        let allrounds = this.state.rounds;
        let count = allrounds.length;
        for (var i = 0; i < count - 1; i++) {
            let firstItemIdSelector = '#' + _this.itemIdPrepend + allrounds[i].id;
            let secondItemIdSelector = '#' + _this.itemIdPrepend + allrounds[i + 1].id;

            jQuery(firstItemIdSelector + ' , ' + secondItemIdSelector).connections({
                css: {
                    border: '3px dotted rgb(170, 170, 170)',
                    opacity: 0.5
                }
            });
        }
    }

    getActiveClass(thisround) {
        if (thisround.isActive == true) {
            return "active";
        } else {
            return "";
        }
    }

    getRoundColSpace(index) {
        if (index % 3 == 0 && index != 0) {
            return "col-sm-12";
        } else {
            return "col-sm-4";
        }
    }

    navigateToContest(contestid, roundid) {
        window.location.href = `/contest/contest/${contestid}/round/${roundid}/`;
    }

    render() {
        var _this = this;

        if (_this.state.isLoading == true) {
            return React.createElement("button", {
                className: "btn btn-link mx-auto d-block",
                disabled: true,
            }, React.createElement("span", {
                className: "spinner-border spinner-border-sm"
            }), "  Loading..");
        } else if (_this.state.noContest == true) {
            return React.createElement("h2", {
                className: "text-muted text-center",
            }, "No Upcoming Contest");
        } else {
            const roundsList = this.state.rounds.map((thisround, index) =>
                React.createElement("div", {
                    className: _this.getRoundColSpace(index) + " d-flex justify-content-center align-tems-center",
                    key: thisround.id,
                }, React.createElement("div", {
                    className: "timelineEachItem " + _this.getActiveClass(thisround),
                    id: _this.itemIdPrepend + thisround.id,
                    onClick: function () {
                        _this.navigateToContest(_this.state.contest.id, thisround.id);
                    },
                }, React.createElement("h6", null, thisround.name)))
            );

            return React.createElement("div", {
                className: "row noMargin timelineWrapper justify-content-around",
                id: "timelineWrapper"
            }, roundsList);
        }
    }
}

const timelineContainer = document.querySelector('#timelineWrapperContainer');
ReactDOM.render(React.createElement(Timeline), timelineContainer);