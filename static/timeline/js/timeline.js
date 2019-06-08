jQuery(document).ready(function () {
    jQuery('#timelineItem1').connections({
        to: '#timelineItem2',
        css: {
            border: '3px dotted rgb(170, 170, 170)',
            opacity: 0.5
        }
    });

    jQuery('#timelineItem2').connections({
        to: '#timelineItem3',
        css: {
            border: '3px dotted rgb(170, 170, 170)',
            opacity: 0.5
        }
    });

    jQuery('#timelineItem3, #timelineItem5').connections({
        css: {
            border: '3px solid green',
            opacity: 0.5,
        }
    });

    jQuery('#timelineItem4').connections({
        to: '#timelineItem5',
        css: {
            border: '3px dotted rgb(170, 170, 170)',
            opacity: 0.5
        }
    });
});
