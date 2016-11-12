if(getCookie('data')){
    var data = JSON.parse(getCookie('data'));
}
else{
    var data = [];
}

if(getCookie('ajaxIndex')){
   var  ajaxIndex = getCookie('ajaxIndex')
}
else{
    var ajaxIndex = 0;
}

if(getCookie('page_num')){
    var  page_num = getCookie('page_num')
}
else{
    var page_num = 1;
}

var name;
var text;



function goToSendMessage() {

    // get stored urls
    var d = JSON.parse(getCookie('data'));

    //go to send message page
    if(ajaxIndex < data.length) {
        window.location = d[ajaxIndex ]+'&start';
    }
    else{
        if(getCookie('next_page') == 'yes') {
            page_num++;
            setCookie('page_num', page_num, 3600);
            window.location = (getCookie('url')) + '&page_num=' + page_num;
        }
        else{
            alert('there are no more connections')
        }
    }

}

function create_visitable_urls(){

     objectArr = $('#results').find('.people .srp-actions.blue-button > a');
    $.each(objectArr, function(index, value){
        if((value.href.split('/')).indexOf('messaging') != -1){
            data.push(value.href);
        }
    });

    setCookie('data', JSON.stringify(data), 3600);
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

function clearCookie(){

    deleteCookie('url');
    deleteCookie('data');
    deleteCookie('ajaxIndex');
    deleteCookie('next_page');
    deleteCookie('page_num');
}

function show_extension(){

    // add main template of extension
    $('#srp_main_').before(
        '<div class="extension">'+
            '<div class="ext_header">' +
            '</div>'+
            '<div class="ext_content">'+
                '<div class="cont_left">'+
                    '<div class="name_field">'+
                        '<input class="full_width" type="text" name="name" placeholder="Input name" value="Davit">'+
                    '</div>'+
                    '<textarea placeholder="Write message" class="full_width" name="text" cols="20" rows="3">my message</textarea>'+
                '</div>'+
                '<div class="cont_right">'+
                    '<div class="right_content"> '+
                        '<h2>Start mail sending?</h2>'+
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

    //$(document).on('click', '#clear', function(){
    //    clearCookie();
    //});

    // start auto sending
    $(document).on('click', '#start_visits', function(){
        name = $('.ext_content .cont_left input[name="name"]').val();
        text = $('.ext_content .cont_left textarea[name="text"]').val();

        clearCookie();

        setCookie('name', name, 3600);
        setCookie('text', text, 3600);

        create_visitable_urls();
        add_cancel_btn();

        var url = window.location.href;
        var url_as_array = url.split('/');
        if(url_as_array.indexOf('vsearch') == 3){
            if(url_as_array[4].split('?')[0] == 'p'){
                setCookie('url', window.location.href+'&start', 3600)
            }
        }

        goToSendMessage();
    });
}


function is_started(){
    var url = window.location.href;
    return url.includes('auto_visit=yes');
}

function sendMessage() {

    if($("#inbox-body input[name='to']").val(getCookie('name'))){
        if($("#inbox-body textarea[name='message']").text(getCookie('text'))){
            if($("#inbox-body textarea[name='message']").click()){
                if($("#inbox-body input[name='to']").click()){
                    if($("#inbox-body input[name='to']").val(getCookie('name'))){
                        if($("#inbox-body button[type='submit']").hasClass('hidden')){
                            if($('#enter-to-send-checkbox').click()){
                                if($("#inbox-body button[type='submit']").click()){
                                    setTimeout(function(){
                                        ajaxIndex++;
                                        setCookie('ajaxIndex', ajaxIndex, 3600);
                                        goToSendMessage();
                                    }, 4000)
                                }
                            }
                        }
                        else{
                            if($("#inbox-body button[type='submit']").click()){
                                setTimeout(function(){
                                    ajaxIndex++;
                                    setCookie('ajaxIndex', ajaxIndex, 3600);
                                    goToSendMessage();
                                }, 4000)
                            }
                        }
                    }
                }
            }
        }
    }

}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2)
        return parts.pop().split(";").shift();
    else
        return 0;


}

function setCookie(index, value, expires) {
    var now = new Date();
    var time = now.getTime();
    time += 1000 * expires;
    now.setTime(time);
    document.cookie =
        index+'=' + value +
        '; expires=' + now.toUTCString() +
        '; path=/';
}

function deleteCookie(index){
    var now = new Date();
    var time = now.getTime();
    now.setTime(time);
    document.cookie =
        index+'=' +
        '; expires=' + now.toUTCString() +
        '; path=/';
}

$(document).ready(function(){

    var url = window.location.href;
    var url_arr_1 = url.split('/');
    var url_arr_2 = url.split('&');

    if($('.pagination .next').length > 0){
        setCookie('next_page', 'yes', 3600);
    }
    else{
        setCookie('next_page', 'no', 3600);
    }


    // show extension in first page only
    if(url_arr_1.indexOf('messaging') == -1){
        show_extension();
    }

    if(url_arr_1.indexOf('vsearch') == 3){
        if(url_arr_1[4].split('?')[0] == 'p'){

            // get base url, Extension is OFF
            if(url_arr_2.indexOf('start') == -1)
            {
                localStorage.setItem('url', window.location.href + '&start')
            }
            // start sending messages, extension is ON
            else{

                // started, in next page
                create_visitable_urls();

                goToSendMessage();
            }
        }
    }

    // send message, if you are in sending message page, extension is ON
    if((url_arr_1.indexOf('messaging') == 3 && (url_arr_2.indexOf('start') != -1))){

        var user = $('#thread-list li.thread-item.new-thread .header .name')[0].innerText;

        var conversations = $('#thread-list li.thread-item.addable .header .name');

        var is_exist = false;
        for(var i= 0; i < conversations.length; i++){
            if(conversations[i].innerText == user){
                is_exist = true;
            }
        }

        if(! is_exist){
            sendMessage();
        }
        else{
            ajaxIndex++;
            setCookie('ajaxIndex', ajaxIndex, 3600);
            goToSendMessage();
        }

    }

});


