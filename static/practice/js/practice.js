function showQuestion(slug){
    window.location.href = slug + '?next=' + encodeURI(window.location.pathname);
}