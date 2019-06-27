'use strict';

class NavMyScore extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            myScore: '',
            isLoading: true,
        }

        this.getMyScore = this.getMyScore.bind(this);
    }

    componentDidMount() {
        this.getMyScore();
    }

    getMyScore() {
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
                if (dataObj.hasOwnProperty('totalScore')) {
                    _this.setState({
                        myScore: dataObj.totalScore,
                        isLoading: false,
                    });
                } else {
                    _this.setState({
                        myScore: 'N/A',
                        isLoading: false,
                    })
                }
            },
            error: function (xhr, status, error) {
                console.log(error);

                _this.setState({
                    myScore: 'N/A',
                    isLoading: false,
                })
            }
        });
    }

    render() {
        if (this.state.isLoading == true){
            return 'Loading...';
        } else {
            return 'My Score: ' + this.state.myScore;
        }
    }
}

const headerNavMyScoreContainer = document.querySelector('#navMyScoreContainer');
ReactDOM.render(React.createElement(NavMyScore), headerNavMyScoreContainer);