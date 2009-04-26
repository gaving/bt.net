$(document).ready(function() {

    /* Set up the main view */
    __initView();

    /* Hook all our event actions in */
    __hookEventHandlers();
});

function __initView() {

    /* Alternate our bubble colours */
    // $("#container > div:even").addClass("black bubble");
    // $("#container > div:odd").addClass("black bubble");
    // $("#container > div:odd").addClass("slate bubble");

    $('#container').hide().ajaxStart(function() {
        $('#spinner').show();
        $(this).hide();
    }).ajaxStop(function() {
        $('#spinner').hide();
        $(this).show();
    });

    /* Build the main list of posts */
    __buildPosts();
}

function __roundBorders() {

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
function __buildPosts() {

    /* Empty all our children first */
    $('#container').empty();

    function __renderPost(item) {
        $('#container').tplAppend(item, function() {
            return [
                'div', { id: item['id'], className: 'black bubble' }, [
                    'div', { className: 'rounded' }, [
                        'blockquote', {}, [
                            'p', {}, item['content']
                        ]
                    ],
                    'div', { className: 'controls' }, [
                        'img', { title: 'View post', className: 'button view', src: '/images/view.png' }, [],
                        'img', { title: 'Edit post', className: 'button edit', src: '/images/edit.png' }, [],
                        'img', { title: 'Delete post', className: 'button delete', src: '/images/delete.png' }, [],
                    ],
                    'cite', { className: 'rounded' }, [
                        'strong', {}, item['name']
                    ]
                ]
            ];
        });
    }

    $.getJSON('/info/posts', function(data) {
        $(data).each(function(i, item) {
            item = item['post']
            __renderPost(item);
        });

        /* Round the borders of our new bubbles */
        __roundBorders();
    });
}

function __hookEventHandlers() {

    function createDialog(options, buttons) {

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
        $("#dialog").load('/posts/new', function() {
            $(this).dialog({
                title: 'Create post',
                position: 'top',
                resizable: false,
                bgiframe: true,
                modal: true,
                width: 460,
                overlay: {
                    backgroundColor: '#000',
                    opacity: 0.5
                },
                buttons: {
                    Create: function() {
                        $('#new_post').ajaxSubmit(function() {

                            /* Close the dialog on submit */
                            $('#dialog').dialog('close');
                            $('#dialog').dialog('destroy');

                            __buildPosts();
                        });
                    },
                    Cancel: function() {
                        $(this).dialog('close');
                        $(this).dialog('destroy');
                    }
                }
            });
        });
    });

    $('.view').click(function() {
        alert('View action');
    });

    $('.edit').live('click', function() {
        var id = $(this).parent().parent().attr('id');
        var url = '/posts/edit/' + id;
        $("#dialog").load(url, function() {
            $(this).dialog({
                title: 'Edit post',
                position: 'top',
                resizable: false,
                bgiframe: true,
                modal: true,
                width: 460,
                overlay: {
                    backgroundColor: '#000',
                    opacity: 0.5
                },
                buttons: {
                    Update: function() {
                        $('#edit_post_' + id).ajaxSubmit(function() {

                            /* Close the dialog on submit */
                            $('#dialog').dialog('close');
                            $('#dialog').dialog('destroy');

                            __buildPosts();
                        });
                    },
                    Cancel: function() {
                        $(this).dialog('close');
                        $(this).dialog('destroy');
                    }
                }
            });
        });
    });

    /* Event handlers */
    $('.delete').live('click', function() {
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
                    var url = '/posts/destroy/' + id
                    $.get(url, function() {

                        /* Close the dialog if we're successful! */
                        $('#dialog').dialog('close');
                        $('#dialog').dialog('destroy');

                        /* Fade out the post */
                        $('#' + id).fadeOut("slow");
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
