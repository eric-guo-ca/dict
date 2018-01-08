
$(function () {

    var app = new Vue({
        el: '#myApp',
        data: {
            means:'',
            translateTo:'Chinese',
            webMeans:'',
            isActive:true,
            login:false
        }
    });

    $('#translateButton').on('click',function () {
        $(this).addClass('loading');
        var appSecret = '2lyEjlkWotjgOjKLT78fFIOpQZdPBSmt';
        var appKey    = '56f7884e6afb0ad5';
        var salt      = (new Date).getTime();
        var query     = $('#translateText').val().trim();
        var from      = $('select[name="language"]').val();
        var to        = from == 'zh-CHS'?'EN':'zh-CHS';
        var str1      = appKey + query + salt +appSecret;
        var sign      = md5(str1);

        if(query !== ''){

            $.ajax({
                url: 'http://openapi.youdao.com/api',
                type: 'post',
                dataType: 'jsonp',
                data: {
                    q: query,
                    appKey: appKey,
                    salt: salt,
                    from: from,
                    to: to,
                    sign: sign
                }
            }).done(function (data) {
                console.log(data);
                app.means    = data.translation[0];
                app.webMeans = data.web;
                setTimeout(function(){
                    $('#translateButton').removeClass('loading');
                }, 0);
            });
        }


    });

    $('select[name="language"]').on('change',function () {
        app.translateTo = $(this).val()=='zh-CHS'?'English':'Chinese';
    });





    $('.select').dropdown();
});
