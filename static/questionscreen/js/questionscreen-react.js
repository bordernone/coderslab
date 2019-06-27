'use strict';

var editor = null;

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
        return React.createElement("button", {
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
ReactDOM.render(React.createElement(questionBackBtn), backBtnContainer);


class QuestionScreenCodeEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var _this = this;
        $(document).ready(function () {
            _this.initializeEditor();
        })
    }

    initializeEditor() {
        editor = ace.edit('questionScreenEditor');
        editor.setTheme("ace/theme/dracula");
    }

    render() {
        var _this = this;

        return React.createElement("div", null, false);
    }
}

const questionScreenCodeEditorContainer = document.querySelector('#questionScreenEditor');
ReactDOM.render(React.createElement(QuestionScreenCodeEditor), questionScreenCodeEditorContainer);

class QuestionScreenSubmissionBtn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };


        this.sendSubmissionContest = this.sendSubmissionContest.bind(this);
        this.sendSubmissionPractice = this.sendSubmissionPractice.bind(this);
    }

    onBtnClick() {
        this.setState({
            isLoading: true,
        });
        let iscontest = document.getElementById('thisquestion').getAttribute('data-question-contest');
        if ((iscontest.toLowerCase() == 'true') || (iscontest == true)) {
            this.sendSubmissionContest();
        } else {
            this.sendSubmissionPractice();
        }
    }

    sendSubmissionContest() {
        var _this = this;
        var solutionCode = editor.getValue();
        var questionId = document.getElementById('thisquestion').getAttribute('data-question-id');
        var programmingLanguage = $('#programminglanguage').val();
        var payload = {
            'solutioncode': solutionCode,
            'questionid': questionId,
            'programminglanguage': programmingLanguage,
        };

        if (solutionCode.length < 10) {
            alert('Please try again');
            _this.setState({
                isLoading: false,
            });
        } else {
            //making ajax request
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                type: "POST",
                url: "/contest/submit/",
                data: payload,
                beforeSend: function (xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                },
                success: function (dataObj, status, xhr) {
                    console.log(dataObj);

                    _this.setState({
                        isLoading: false,
                    });
                },
                error: function (xhr, status, error) {
                    console.log(error);

                    _this.setState({
                        isLoading: false,
                    });
                }
            });
        }
    }

    sendSubmissionPractice() {
        var _this = this;
        var solutionCode = editor.getValue();
        var questionId = document.getElementById('thisquestion').getAttribute('data-question-id');
        var programmingLanguage = $('#programminglanguage').val();
        var payload = {
            'solutioncode': solutionCode,
            'questionid': questionId,
            'programminglanguage': programmingLanguage,
        };

        if (solutionCode.length < 10) {
            alert('Please try again');
            _this.setState({
                isLoading: false,
            });
        } else {
            //making ajax request
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                type: "POST",
                url: "/practice/submit/",
                data: payload,
                beforeSend: function (xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                },
                success: function (dataObj, status, xhr) {
                    console.log(dataObj);

                    _this.setState({
                        isLoading: false,
                    });
                },
                error: function (xhr, status, error) {
                    console.log(error);

                    _this.setState({
                        isLoading: false,
                    });
                }
            });
        }
    }

    render() {
        var _this = this;

        if (_this.state.isLoading == false) {
            return React.createElement("button", {
                type: "button",
                className: "btn btn-block formSubmitButton",
                onClick: function () {
                    _this.onBtnClick();
                },
            }, "Submit");
        } else {
            return React.createElement("button", {
                className: "btn btn-block formSubmitButton",
                type: "button",
                onClick: function () {
                    return _this.onBtnClick();
                }
            }, React.createElement("span", {
                className: "spinner-border spinner-border-sm"
            }), " Submit");
        }
    }
}


const questionScreenSubmissionBtnContainer = document.querySelector('#questionScreenSubmissionBtnWrapper');
ReactDOM.render(React.createElement(QuestionScreenSubmissionBtn), questionScreenSubmissionBtnContainer);
