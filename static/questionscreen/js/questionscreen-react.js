'use strict';

const e = React.createElement;
class backBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    onBtnClick(){
        var redirectTo = GetURLParameter('next');
        if (redirectTo != 0){
            window.location.href = redirectTo;
        } else {
            window.location.href = '/practice/';
        }
    }

    render() {
        var _this = this;
        return e("button", {
            type: "button",
            className: "btn btn-link questionBackBtn",
            onClick: function(){
                _this.onBtnClick();
            }
        }, React.createElement("li", {
            class: "fas fa-arrow-left"
        }));
    }
}

const backBtnContainer = document.querySelector('#questionBackBtnContainer');
ReactDOM.render(e(backBtn), backBtnContainer);