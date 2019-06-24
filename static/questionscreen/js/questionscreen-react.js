'use strict';

const e = React.createElement;
class questionBackBtn extends React.Component {
    constructor(props) {
        super(props);
    }

    onBtnClick() {
        var redirectTo = GetURLParameter('next');
        if (redirectTo != 0) {
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
            onClick: function () {
                _this.onBtnClick();
            }
        }, React.createElement("li", {
            className: "fas fa-arrow-left"
        }));
    }
}

const backBtnContainer = document.querySelector('#questionBackBtnContainer');
ReactDOM.render(e(questionBackBtn), backBtnContainer);


class QuestionScreenCodeEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        var _this = this;
        $(document).ready(function(){
            _this.initializeEditor();
        })
    }

    initializeEditor(){
        var editor = ace.edit('questionScreenEditor');
        editor.setTheme("ace/theme/dracula"); 
    }

    render() {
        var _this = this;

        return React.createElement("div", null, false);
    }
}

const questionScreenCodeEditorContainer = document.querySelector('#questionScreenEditor');
ReactDOM.render(React.createElement(QuestionScreenCodeEditor), questionScreenCodeEditorContainer);