'use strict';

class LogoutScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dotString: '...',
        }

        this.interval = null;

        this.signoutGoogle = this.signoutGoogle.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.timeElapsed = 0;
    }

    componentDidMount() {
        window['onLoad'] = this.onLoad();
        this.interval = setInterval(this.runTimer.bind(this), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);

        delete window['onLoad'];
    }

    runTimer() {
        let loaded = false
        this.timeElapsed = this.timeElapsed + 1;

        if (this.timeElapsed > 5){
            window.location.href = '/';
        }

        try {
            let x = gapi.auth2.getAuthInstance();
            loaded = true;

            this.signoutGoogle();
        } catch(error){
            let temp = this.state.dotString;
            if (temp == '...') {
                temp = '';
            } else {
                temp = temp + '.';
            }
            this.setState({
                dotString: temp,
            });
        }
    }

    onLoad() {
        var _this = this;
        gapi.load('auth2', function () {
            gapi.auth2.init();
        });
    }

    signoutGoogle() {
        var _this = this;
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            window.location.href = '/';
        });
    }

    render() {
        return React.createElement("p", null, "Logging you out" + this.state.dotString);
    }
}

const logoutScreenContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(LogoutScreen), logoutScreenContainer);