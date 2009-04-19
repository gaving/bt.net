$(document).ready(function() {

    /* Alternate our bubble colours */
    $("#container > div:even").addClass("black bubble");
    $("#container > div:odd").addClass("slate bubble");

    /* Rounded corner stuff */
    settings = {
        tl: { radius: 10 },
        tr: { radius: 10 },
        bl: { radius: 10 },
        br: { radius: 10 },
        antiAlias: true,
        autoPad: true
    }
    var myBoxObject = new curvyCorners(settings, "rounded");
    myBoxObject.applyCornersToAll();

    /* Event handlers */
    $('.delete').click(function() {
        $(this).parent().parent().fadeOut("slow");
    });

    $('.view').click(function() {
        alert('View action');
    });

    $('.edit').click(function() {
        alert('Edit action');
    });
});
