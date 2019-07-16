'use strict';

const e = React.createElement;
const NAVIGATIONLINKS = {
    register: '/register/',
    login: '/login/',
    resources: 'https://blog.coderslab.io/about-us/',
    fbpage: 'https://www.facebook.com/CodersLab-883282698685530',
}



// get started button
class GetStartedBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    onBtnClick() {
        window.location.href = NAVIGATIONLINKS.register;
        return null;
    }

    render() {
        var _this = this;
        return e("button", {
            type: "button",
            className: "btn bodyGetStartedBtn",
            onClick: function onClick() {
                return _this.onBtnClick();
            }
        }, "Get Started!");
    }
}

const getStartedBtnContainer = document.querySelector('#getStartedBtn');
ReactDOM.render(e(GetStartedBtn), getStartedBtnContainer);

// learn more button
class LearnMoreBtn extends React.Component{
    constructor(props){
        super(props);
    }

    onBtnClick() {
        window.location.href = NAVIGATIONLINKS.resources;
        return null;
    }

    render() {
        var _this = this;
        return e("button", {
            type: "button",
            className: "btn bodyLearnMoreBtn",
            onClick: function onClick() {
              return _this.onBtnClick();
            }
          }, "Learn more");
    }
}

const learnMoreBtnContainer = document.querySelector('#learnMoreBtn');
ReactDOM.render(e(LearnMoreBtn), learnMoreBtnContainer);