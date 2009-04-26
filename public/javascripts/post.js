$(document).ready(function() {

    /* Set up the main view */
    __initView();

    /* Hook all our event actions in */
    __hookEventHandlers();
});

function __initView() {

    /* Alternate our bubble colours */
    $("#container > div:even").addClass("black bubble");
    $("#container > div:odd").addClass("black bubble");
    // $("#container > div:odd").addClass("slate bubble");

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
}

function __hookEventHandlers() {

    function createDialog(options) {

        /* Load the given url in */
        $("#dialog").load(options['url'])

        /* Show the dialog */
        $("#dialog").dialog({
            title: options['title'],
            position: 'top',
            width: 460
        });
    }

    function __getId(context) {
        return $(context).parent().parent().attr('id');
    }

    $('.new').click(function() {
        createDialog({ url: 'posts/new', title: 'Create post' });
    });

    $('.view').click(function() {
        alert('View action');
    });

    $('.edit').click(function() {
        var id = $(this).parent().parent().attr('id');
        var url = 'posts/edit/' + id;
        createDialog({ url: url, title: 'Edit post' });
    });

    /* Event handlers */
    $('.delete').click(function() {
        var id = __getId(this);
        $("#dialog").dialog({
            title: 'Are you sure you want to delete this post?',
            bgiframe: true,
            resizable: false,
            height: 140,
            modal: true,
            overlay: {
                backgroundColor: '#000',
                opacity: 0.5
            },
            buttons: {
                'Yes, delete the post!': function() {
                    var url = 'posts/destroy/' + id
                    $.get(url, function(xml){

                        /* Close the dialog if we're successful! */
                        $('#dialog').dialog('close');

                        /* Fade out the post */
                        $('#' + id).fadeOut("slow");

                        $('#dialog').dialog('destroy');
                    });
                },
                Cancel: function() {
                    $(this).dialog('close');
                    $(this).dialog('destroy');
                }
            }
        });
    });
}
