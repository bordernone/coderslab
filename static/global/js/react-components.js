'use strict';

class backBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    onBtnClick(){
        var redirectTo = GetURLParameter('next');
        if (redirectTo != 0){
            window.location.href = redirectTo;
        } else {
            window.location.href = '/account/';
        }
    }

    render() {
        var _this = this;

        return React.createElement("span", {
            className: "fas fa-arrow-left",
            onClick: function(){
                _this.onBtnClick();
            },
        });
    }
}