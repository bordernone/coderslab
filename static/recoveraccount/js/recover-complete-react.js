'use strict';

const recoverAccountCompleteBackBtnContainer = document.querySelector('#recoverAccountCompleteBackBtnContainer');
let recoverAccountCompleteBckBtn = React.createElement(backBtn, {
    defaultredirect: '/login/',
});
ReactDOM.render(recoverAccountCompleteBckBtn, recoverAccountCompleteBackBtnContainer);