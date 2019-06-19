'use strict';

const e = React.createElement;

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
        return e("div", {
            className: "row noMargin timelineTimerWrapper"
        }, e("div", {
            className: "timelineTimerBoxEach"
        }, e("div", {
            className: "timelineTimerBox"
        }, e("h4", null, _this.state.countdown.days)), e("div", {
            className: "timelineTimerLabelBox"
        }, e("div", {
            className: "timelineTimerLabel"
        }, e("h4", null, "Days")))), e("div", {
            className: "timelineTimerBoxEach"
        }, e("div", {
            className: "timelineTimerBox"
        }, e("h4", null, _this.state.countdown.hours)), e("div", {
            className: "timelineTimerLabelBox"
        }, e("div", {
            className: "timelineTimerLabel"
        }, e("h4", null, "Hours")))), e("div", {
            className: "timelineTimerBoxEach"
        }, e("div", {
            className: "timelineTimerBox"
        }, e("h4", null, _this.state.countdown.minutes)), e("div", {
            className: "timelineTimerLabelBox"
        }, e("div", {
            className: "timelineTimerLabel"
        }, e("h4", null, "Minutes")))), e("div", {
            className: "timelineTimerFooterTextBox"
        }, e("h3", null, "Until Next Round")));
    }
}

const countdownContainer = document.querySelector('#timelineCountdownContainer');
ReactDOM.render(e(Countdown), countdownContainer);

class Timeline extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeRound: 'timelineItem1',
        }
    }

    componentDidMount() {
        this.setupConnections();
    }

    setupConnections() {
        $('#' + this.state.activeRound).addClass('active');

        jQuery('#timelineItem1').connections({
            to: '#timelineItem2',
            css: {
                border: '3px dotted rgb(170, 170, 170)',
                opacity: 0.5
            }
        });

        jQuery('#timelineItem2').connections({
            to: '#timelineItem3',
            css: {
                border: '3px dotted rgb(170, 170, 170)',
                opacity: 0.5
            }
        });

        jQuery('#timelineItem3, #timelineItem5').connections({
            css: {
                border: '3px dotted rgb(170, 170, 170)',
                opacity: 0.5
            }
        });

        jQuery('#timelineItem4').connections({
            to: '#timelineItem5',
            css: {
                border: '3px dotted rgb(170, 170, 170)',
                opacity: 0.5
            }
        });
    }

    render() {
        var _this = this;
        return e("div", {
            className: "row noMargin timelineWrapper justify-content-around",
            id: "timelineWrapper"
        }, e("div", {
            className: "col-sm-4 d-flex justify-content-center align-tems-center"
        }, e("div", {
            className: "timelineEachItem",
            id: "timelineItem1"
        }, e("h6", null, "Round 1A"))), e("div", {
            className: "col-sm-4 d-flex justify-content-center align-tems-center"
        }, e("div", {
            className: "timelineEachItem",
            id: "timelineItem2"
        }, e("h6", null, "Round 1B"))), e("div", {
            className: "col-sm-4 d-flex justify-content-center align-tems-center"
        }, e("div", {
            className: "timelineEachItem",
            id: "timelineItem3"
        }, e("h6", null, "Round 2"))), e("div", {
            className: "col-sm-4 d-flex justify-content-center align-tems-center"
        }, e("div", {
            className: "timelineEachItem",
            id: "timelineItem4"
        }, e("h6", null, "Final Round"))), e("div", {
            className: "col-sm-4 d-flex justify-content-center align-tems-center"
        }, e("div", {
            className: "timelineEachItem",
            id: "timelineItem5"
        }, e("h6", null, "Round 3"))));
    }
}

const timelineContainer = document.querySelector('#timelineWrapperContainer');
ReactDOM.render(e(Timeline), timelineContainer);