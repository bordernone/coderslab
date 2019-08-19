from django.urls import reverse

def getAnnouncementData():
    url = reverse('getCertificateView')
    html = ('<div id="announcement-bar" class="p-2 text-center announcement-bar">' +
            '<p class="noMargin">' + 
            ' Get your certificate of participation ' + 
            '  <a href="' +
            url +
            '" class="text-primary">here</a></p>' +
            '</div>')
    return html