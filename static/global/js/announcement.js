function getAnnouncement() {
    //making ajax request
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: "POST",
        url: "/misc/announcement/",
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        success: function (dataObj, status, xhr) {
            console.log(dataObj)
            if (dataObj.hasOwnProperty('contents') && dataObj.contents != null) {
                const myEl = document.querySelector('#announcementWrapper');
                myEl.insertAdjacentHTML('afterbegin', dataObj.contents);
                $('#bodyWrapper').addClass('paddingTop-100-strict');
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

getAnnouncement();