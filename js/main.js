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
var data = [];



function goToSendMessage() {

    // get stored urls

    data = JSON.parse(getCookie('data'));

    if(getCookie('ajaxIndex')){
        var  ajaxIndex = getCookie('ajaxIndex')
    }
    else{
        var ajaxIndex = 0;
    }
    //go to send message page
    if(ajaxIndex < data.length) {

        $.ajax({
            url: 'https://www.linkedin.com/messaging/conversationsView?keyword='+data[ajaxIndex].name,
            type: 'get',
            success: function(response){
                if(response.conversationsBefore.length == 0){
                    window.location = data[ajaxIndex].url+'&start';
                }
                else{
                    var requesting_url = data[ajaxIndex].url;
                    var requesting_id = (((((requesting_url.split('?'))[1]).split('&'))[0]).split('='))[1];
                    var is_exist = false;
                    $.each(response.conversationsBefore, function(index, value){
                        if(value.participants[0].id == requesting_id){
                            is_exist = true;
                        }
                    });

                    if(! is_exist){
                        window.location = data[ajaxIndex].url+'&start';
                    }
                    else{
                        ajaxIndex++;
                        setCookie('ajaxIndex', ajaxIndex, 3600);
                        goToSendMessage();
                    }
                }
            }
        });

       // window.location = d[ajaxIndex ]+'&start';
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

    objectArr = $('#results').find('.people');

    $.each(objectArr, function(index, value){
        var link = ($(value).find('.srp-actions.blue-button>a'))[0].href;
        var user_name = ($(value).find('.bd .title'))[0].innerText;

        if((link.split('/')).indexOf('messaging') != -1){
            data.push({'name' : user_name, 'url': link});
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
                        '<input class="full_width" type="text" name="name" placeholder="Input name" value="  ">'+
                    '</div>'+
                    '<textarea placeholder="Write message" class="full_width" name="text" cols="20" rows="3">Nice to see You in my connections list ! &#13;&#10; &#13;&#10;'+
                    'I am ready to assist You for attracting more new clients and keep the current ones more effectively , by developing a fully Responsive Website for Your Business. &#13;&#10; &#13;&#10;'+

                    'I believe, if there would have been a Marketing God, his first commandment would sound exactly like this. &#13;&#10; &#13;&#10;'+

                    '" The Websites in 21th century should be so nice and easy to use and creative, that the users entering there will get an orgasm even ! So, that You will change them into real "fanatics" of Your Brand from just "interested users" by "making" them to fell in love with Your Brand in 3 seconds... &#13;&#10; &#13;&#10;'+

                    'Here You can visit our website.   http://1webproject.com/ &#13;&#10; &#13;&#10;'+

                    'So, do You think You are interested in such services ?</textarea>'+
                '</div>'+
                '<div class="cont_right">'+
                    '<div class="right_content"> '+
                        '<h2>Start mail sending?</h2>'+
                        '<div class="btns">' +
                            '<button id="start_visits" class="btn_yes">Yes</button>'+
                            '<button id="clear" class="btn_no">Clear Cookie</button>'+
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
    // $(document).on('click', '#ext_close', function(){
    //     $('.extension').remove();
    // });

    $(document).on('click', '#clear', function(){
       clearCookie();
    });

    // start auto sending
    $(document).on('click', '#start_visits', function(){
        name = $('.ext_content .cont_left input[name="name"]').val();
        text = $('.ext_content .cont_left textarea[name="text"]').val();

       // clearCookie();

        if(getCookie('ajaxIndex')){
              ajaxIndex = getCookie('ajaxIndex')
        }
        else{
             ajaxIndex = 0;
        }

        setCookie('name', name, 3600);
        setCookie('text', encodeURIComponent(text), 3600);

        create_visitable_urls();
        add_cancel_btn();

        var url = window.location.href;
        var url_as_array = url.split('/');
        if(url_as_array.indexOf('vsearch') == 3){
            if(url_as_array[4].split('?')[0] == 'p'){
                setCookie('url', window.location.href+'&start', 3600)
            }
        }

        setTimeout(function(){
            goToSendMessage();
        }, 1000);

    });
}


function is_started(){
    var url = window.location.href;
    return url.includes('auto_visit=yes');
}

function sendMessage() {

    if($("#inbox-body input[name='to']").val(getCookie('name'))){
        if($("#inbox-body textarea[name='message']").text(decodeURIComponent(getCookie('text')))){
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
                                    }, 5000)
                                }
                            }
                        }
                        else{
                            if($("#inbox-body button[type='submit']").click()){
                                setTimeout(function(){
                                    ajaxIndex++;
                                    setCookie('ajaxIndex', ajaxIndex, 3600);
                                    goToSendMessage();
                                }, 5000)
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

    // show extension in first page only
    if(url_arr_1.indexOf('messaging') == -1){
        show_extension();
    }

    if(url_arr_1.indexOf('vsearch') == 3){
        if(url_arr_1[4].split('?')[0] == 'p'){

            if($('.pagination .next').length > 0){
                setCookie('next_page', 'yes', 3600);
            }
            else{
                setCookie('next_page', 'no', 3600);
            }

            // get base url, Extension is OFF
            if(url_arr_2.indexOf('start') == -1)
            {
                localStorage.setItem('url', window.location.href + '&start')
            }
            // start sending messages, extension is ON
            else{

                // started, in next page
                data = [];

                create_visitable_urls();
                deleteCookie('ajaxIndex');
                goToSendMessage();
            }
        }
    }

    // send message, if you are in sending message page, extension is ON
    if((url_arr_1.indexOf('messaging') == 3 && (url_arr_2.indexOf('start') != -1))){

        sendMessage();

    }

});


