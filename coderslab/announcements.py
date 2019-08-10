from timeline.utils import getUpcomingRound, getContestFromRound, getActiveRound
from django.utils import timezone
from django.urls import reverse

def getAnnouncementData():
    if getActiveRound() != None:
        now = timezone.now()
        enddatetime = getActiveRound().startdatetime + getActiveRound().duration
        difference = (enddatetime - now)
        activeRoundId = getActiveRound().id
        contestId = getContestFromRound(getActiveRound()).id
        url = reverse('contestview', args=['comp', contestId, 'round', activeRoundId])
        print(url)
        html = ('<div id="announcement-bar" class="p-2 text-center announcement-bar">'
            '<p class="noMargin">' +
            getActiveRound().roundName + 
            ' Round ends in ' +
            hoursMinutesSecondsString(difference.total_seconds()) + 
            '  <a href="' +
            url +
            '" class="btn btn-info btn-sm">Check</a></p>'
            '</div>')
    else:
        if getUpcomingRound() != None:
            now = timezone.now()
            nextRoundStarttime = getUpcomingRound().startdatetime
            difference = (nextRoundStarttime - now)
            upcomingRoundId = getUpcomingRound().id
            contestId = getContestFromRound(getUpcomingRound()).id
            url = reverse('contestview', args=['comp', contestId, 'round', upcomingRoundId])
            print(url)
            html = ('<div id="announcement-bar" class="p-2 text-center announcement-bar">'
                '<p class="noMargin">' +
                getUpcomingRound().roundName + 
                ' Round begins in ' +
                hoursMinutesSecondsString(difference.total_seconds()) + 
                '  <a href="' +
                url +
                '" class="btn btn-info btn-sm">Check</a></p>'
                '</div>')
        else:
            html = None
    return html

def hoursMinutesSecondsString(seconds):
    days = int(seconds / 86400)
    remaining = seconds % 86400
    hours = int(remaining / 3600)
    remaining = remaining % 3600
    minutes = int(remaining / 60)
    seconds = int(remaining % 60)
    resultString = ''
    if days > 1:
        resultString += str(days) + ' days '
    elif days == 1:
        resultString += str(days) + ' day '
    
    if hours > 1:
        resultString += str(hours) + ' hours '
    elif hours == 1:
        resultString += str(hours) + ' hour '
    
    if minutes > 1:
        resultString += str(minutes) + ' minutes '
    elif minutes == 1:
        resultString += str(minutes) + ' minute '

    if seconds > 1:
        resultString += str(seconds) + ' seconds'
    elif seconds == 1:
        resultString += str(seconds) + ' seconds'
    
    return resultString