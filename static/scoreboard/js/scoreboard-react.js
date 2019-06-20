'use strict';

const e = React.createElement;

class scoreboardCompetitionUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [
                {
                    'userid': '',
                    'profileImgUrl': '',
                    'first_name': '',
                    'last_name': '',
                    'username': '',
                },
            ],
        }
    }

    componentDidMount() {
        var _this = this;

        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "competition/recent/",
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (dataObj, status, xhr) {
                if (dataObj.hasOwnProperty('users')) {
                    _this.setState({
                        users: dataObj.users,
                    });
                } else if (dataObj.hasOwnProperty('error')) {
                    _this.setState({
                        users: null,
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

    itemClicked(username){
        window.location.href="/user/"+username+'/';
    }

    render() {
        var _this = this;

        const eachCompetitionUser = _this.state.users.map((user, index) =>
            e("div", {
                className: "col-sm-6 d-flex scoreboardScoreItem",
                key: user.userid
            }, e("div", {
                className: "p-2 scoreboardCounter justify-content-center align-items-center d-flex"
            }, index + 1, "."), e("div", {
                className: "p-2 scoreboardDisplayPic",
                onClick: function onClick() {
                    return _this.itemClicked(user.username);
                },
            }, e("div", {
                className: "scoreboardDisplayPicWrapper"
            }, e("img", {
                src: user.profileImgUrl
            }))), e("div", {
                className: "p-2 scoreboardDisplayName d-flex align-items-center",
                onClick: function onClick() {
                    return _this.itemClicked(user.username);
                }
            }, user.username))
        );
        return eachCompetitionUser;
    }
}

const scoreboardCompetitionUserContainer = document.querySelector('#competitionUsersScoreboardView');
ReactDOM.render(e(scoreboardCompetitionUser), scoreboardCompetitionUserContainer);

class OverallUsersScoreboardView extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            users: [
                {
                    'userid': '',
                    'profileImgUrl': '',
                    'first_name': '',
                    'last_name': '',
                    'username': '',
                },
            ],
        }
    }

    componentDidMount() {
        var _this = this;

        //making ajax request
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "overall/",
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function (dataObj, status, xhr) {
                if (dataObj.hasOwnProperty('users')) {
                    _this.setState({
                        users: dataObj.users,
                    });
                } else if (dataObj.hasOwnProperty('error')) {
                    _this.setState({
                        users: null,
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

    itemClicked(username){
        window.location.href="/user/"+username+'/';
    }

    render() {
        var _this = this;

        const eachUser = _this.state.users.map((user, index) =>
            e("div", {
                className: "col-sm-6 d-flex scoreboardScoreItem",
                key: user.userid
            }, e("div", {
                className: "p-2 scoreboardCounter justify-content-center align-items-center d-flex"
            }, index + 1, "."), e("div", {
                className: "p-2 scoreboardDisplayPic",
                onClick: function onClick() {
                    return _this.itemClicked(user.username);
                },
            }, e("div", {
                className: "scoreboardDisplayPicWrapper"
            }, e("img", {
                src: user.profileImgUrl
            }))), e("div", {
                className: "p-2 scoreboardDisplayName d-flex align-items-center",
                onClick: function onClick() {
                    return _this.itemClicked(user.username);
                }
            }, user.username))
        );
        return eachUser;
    }
}

const overallUsersScoreboardContainer = document.querySelector('#overallUsersScoreboardView');
ReactDOM.render(e(OverallUsersScoreboardView), overallUsersScoreboardContainer);