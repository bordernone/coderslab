'use strict';

class backBtn extends React.Component {
    constructor(props) {
        super(props);

        this.onBtnClick = this.onBtnClick.bind(this);
    }

    onBtnClick(){
        var _this = this;
        var redirectTo = GetURLParameter('next');
        if (redirectTo != 0){
            window.location.href = redirectTo;
        } else if (_this.props.defaultredirect){
            window.location.href = _this.props.defaultredirect;
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