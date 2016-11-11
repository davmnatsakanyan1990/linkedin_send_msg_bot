if(localStorage.getItem('objectArr')){
    var data = localStorage.getItem('data');
}
else{
    var data = [];
}

if(localStorage.getItem('ajaxIndex')){
    var ajaxIndex = localStorage.getItem('ajaxIndex')
}
else{
    var ajaxIndex = 0;
}


function next_page(){

    var nex_pg_url = $('a[rel="next"]').attr('href');
    nex_pg_url = 'https://www.linkedin.com'+nex_pg_url+'&auto_visit=yes';
    window.location.href = nex_pg_url;
}


function clickOnButton() {

    ajaxIndex++;

    localStorage.setItem('ajaxIndex', ajaxIndex);

    var u = JSON.parse(localStorage.getItem('data'));

    //go to send message page
    window.location = u[ajaxIndex-1];



    // setTimeout(function(){
    //     if(ajaxIndex < objectArr.length) {
    //         clickOnButton();
    //         }
    //         else{
    //             next_page();
    //         }
    // }, 3000);
}

function create_visitable_urls(){

     objectArr = $('#results').find('.people .srp-actions.blue-button > a');
    $.each(objectArr, function(index, value){
        data.push(value.href);
    });

    localStorage.setItem('data', JSON.stringify(data));
}

function add_cancel_btn(){
    $('.btns').html('<button id="cancel">Cancel</button>');
    $('#cancel').on('click', function(){

        var url = window.location.href;
        var d=url.split('&auto_visit');
        var f= d[0];
        window.location.href=f;
    });
}

function show_extension(){

    // add main template of extension
    $('#srp_main_').before(
        '<div class="extension">'+
            '<div class="ext_header">' +
            '</div>'+
            '<div class="ext_content">'+
                '<div class="cont_left">'+
                '<h1>ProspectLink</h1>'+
                '</div>'+
                '<div class="cont_right">'+
                    '<div class="right_content"> '+
                        '<h2>Connect profiles?</h2>'+
                        '<div class="btns">' +
                            '<button id="start_visits" class="btn_yes">Yes</button>'+
                            '<button id="ext_close" class="btn_no">No</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="ext_bottom">'+
            '</div>'+
        '</div>'
    );
    
    if(is_started()){
        add_cancel_btn();
    }

    //close extension
    $(document).on('click', '#ext_close', function(){
        $('.extension').remove();
    });

    // start auto connecting
    $(document).on('click', '#start_visits', function(){

        localStorage.removeItem('url');
        localStorage.removeItem('data');
        localStorage.removeItem('ajaxIndex');
        create_visitable_urls();
        add_cancel_btn();

        var url = window.location.href;

        var arr_as_url = url.split('/');
        if(arr_as_url.indexOf('vsearch') == 3){
            if(arr_as_url[4].split('?')[0] == 'p'){
                localStorage.setItem('url', window.location.href+'&start')
            }
        }

        clickOnButton();
    });
}

function is_started(){
    var url = window.location.href;
    return url.includes('auto_visit=yes');
}

function sendMessage() {

    if($("#inbox-body input[name='to']").val('Title')){
        if($("#inbox-body textarea[name='message']").text('Message')){
            if($("#inbox-body textarea[name='message']").click()){
                if($("#inbox-body input[name='to']").click()){
                    if($("#inbox-body input[name='to']").val('Title')){
                        if($("#inbox-body button[type='submit']").click()){
                            var url = localStorage.getItem('url');
                            setTimeout(function(){
                                window.location = url;
                            }, 4000)
                        }
                    }
                }
            }
        }
    }

}

$(document).ready(function(){

    show_extension();

    // continue auto connecting
    var url = window.location.href;

    var arr_as_url = url.split('/');

    var s_arr_url = url.split('&');

    if(s_arr_url.indexOf('start') != -1){

        clickOnButton();
    }



    if(arr_as_url.indexOf('messaging') == 3){
        sendMessage();
    }

});


