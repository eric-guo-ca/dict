//get translate json file
'use strict';


$(function () {

    // vue 数据
    var app = new Vue({
        el: '#myApp',
        data: {
            user:'',
            word:'',
            symbols:'',
            means:[],
            meanscn:[],
            translatemeans:[],
            exchange:{},
            translateTo:'Chinese',
            webMeans:'',
            page:'dict',
            daily:'',
            wordListName:[],
            wordList:[],
            currentList:'',
            currentPage:1,
            totalpage:'',
            wordGroup:[],
            isActive:true,
            login:false,
            message:'',
            //每日一句切换显示翻译
            isShow: false,
            practice:{
                words:'',
                wordList:[],
                rightList:[],
                wrongList:[],
                wordsTotal: '',
                hideMeans:true,
                symbols:'',
                means:[],
                star:false,
                showAnswer:false,
                judge:false,
                finish:false,
                accuracy:new Number(0)
            }
        },
        methods:{
            toggle:function(){
            this.isShow = !this.isShow;
            },
            changeList:function (id,list) {
                changeWordList(id,list);
            },
            deleteWord:function (id) {
                delWord(id);
            }
        }
    });

    //单词翻译
    function getTranslate(key,p) {

        $.ajax({
            type: "POST",
            async: false,
            data: {key: key},
            dataType: "html",
            url: "get_json.php"
        }).done(function (data) {
            var obj = JSON.parse(data);
            //console.log(obj);
            if(p == 'dict'){//在单词查询页面
                var cn = new RegExp("[u4E00-u9FFF]+","g");
                if(cn.test(key)){
                    //console.log("英文");
                    if(obj.word_name){
                        app.word    = key;
                        app.symbols = obj.symbols[0];
                        app.means   = obj.symbols[0].parts;
                        app.exchange= obj.exchange;
                        app.isActive= false;
                        app.meanscn ='';
                        $('#amAudio source').attr('src','http://media.shanbay.com/audio/us/'+key+'.mp3');
                        $('#enAudio source').attr('src','http://media.shanbay.com/audio/uk/'+key+'.mp3');
                        $('#amAudio')[0].load();
                        $('#enAudio')[0].load();

                    }else{
                        clear();
                        app.meanscn ='';
                        app.message = '没有找到您要查询的单词';
                        errorMessage();
                    }

                }else{
                    //console.log("汉字");
                    app.isActive= false;
                    app.meanscn = obj.symbols;
                    //console.log(app.meanscn);
                    clear();
                }


            }else{//在单词联系页面
                //app.practice.symbols = obj.symbols[0];
                app.practice.means   = obj.symbols[0].parts;
                //console.log(obj);

            }
            function clear() {
                app.word = '';
                app.symbols = app.means = app.exchange  ='';
                $('#amAudio source,#enAudio source').attr('src','');
                $('#amAudio')[0].load();
                $('#enAudio')[0].load();
            }
            $("#loading").removeClass('active');
        })
          .fail(function() {
            app.message = '单词翻译引擎错误';
            errorMessage();
        });

    }

    //单词查询
    $('#searchWordForm').submit(function (e) {
       e.preventDefault();

        let keyWord = $("#searchInput").val().trim().toLowerCase();
        let test    = /^[\u4E00-\u9FA5a-z' `.]+$/;

        if (keyWord !== '' && test.test(keyWord)) {
            $("#loading").addClass('active');

            setTimeout(function(){
                getTranslate(keyWord,app.page);
                }, 0);

        }else if(keyWord !==app.word){
           return false;
        }else {
            app.message = '查询输入不正确';
            errorMessage();
        }
    });

    //查询单词加入个人单词表
    $("#addList").on('click',function () {
        if(app.login && app.word !=''){
            let list = '查询单词表';
            let word = app.word;
            addWord(word,list);
        }else{
            app.message = '您还没有登录';
            errorMessage();
        }

    });

    //单个单词添加单词表
    function addWord(word,list) {
        $.ajax({
            type: "POST",
            data: {word:word,list:list,user:app.user},
            dataType: "html",
            url: "add_one_word.php"
        }).done(function (data) {
            let obj = JSON.parse(data);
            if(obj.state=='ok'){
                app.message = obj.message;
                successMessage();
            }else{
                app.message = obj.message;
                errorMessage();
            }
        })
    }

//单词练习
    //开始练习读取单词表
    $("#practiceSelectList .button").on('click',function () {
        let list =$("#practiceSelectList div.text").text();
        $("#loading").addClass('active');
        $.ajax({
            type: "POST",
            async: false,
            data: {list: list,user:app.user},
            dataType: "html",
            url: "practice_words.php"
        }).done(function (data) {
            let obj = JSON.parse(data);
            app.practice.wordList = obj;
            app.practice.wordsTotal = obj.length;
            //console.log(obj);
            setTimeout(function(){
                selectWord();
            }, 0);
            app.practice.star =true;
        })

    });
        //抽取单词
    function selectWord() {
        var w = app.practice.wordList;
        var number = Math.floor(Math.random() * w.length);

        if( w.length>0){
            app.practice.word = w[number];
            w.splice(number,1);
            getTranslate(app.practice.word,'pra');
            $('#audioAm')[0].load();
            $('#audioEn')[0].load();
        }else{
            app.practice.finish = true;
        }

    }
    //下一个单词
    $("#nextQuestion").on("click",function () {
        app.practice.showAnswer = false;
        app.practice.hideMeans  = true;
        $("#answer input").val('');
        selectWord();
    });

    //对比单词
    $("#answer").submit(function (e) {
        e.preventDefault();
        let inWord = $(this).find('input').val().trim().toLowerCase();
        let test   = /^[a-z.' `]+$/;
        let word   = app.practice.word;
        let list   = $("#practiceSelectList div.text").text();
        if(inWord !== '' &&  test.test(inWord)) {
            if(inWord === word){
                app.practice.showAnswer = app.practice.judge = true;
                app.practice.rightList.push(word);
                if(list !== '已学会'){
                    $.ajax({
                        type: "POST",
                        data: {user:app.user,list:list,toList:'已学会',word:word},
                        dataType: "html",
                        url: "change_list_right.php"
                    })
                }

            }else{
                app.practice.showAnswer = true;
                app.practice.judge      = false;
                app.practice.wrongList.push(word);
            }

            let r = app.practice.rightList.length || 0;
            let w = app.practice.wrongList.length || 0;
            let t = r + w;
            app.practice.accuracy = Math.round((r/t)*100);
        }else {
            app.message = '请输入正确单词';
            errorMessage();
        }

    });
    //重新开始
    $("#restart").on('click',function () {
        $("#answer input").val('');
        app.practice.showAnswer = false;
        app.practice.finish     = false;
        app.practice.star       = false;
        app.practice.hideMeans  = true;
        app.practice.word       ='';
        app.practice.accuracy   = new Number(0);
        app.practice.wordList   = [];
        app.practice.wrongList  = [];
        app.practice.rightList  = [];

    });

//设置
    //设置中单个添加单词
    $("#addANewWord .button").on('click',function () {
        let word = $(this).siblings('input').val().trim().toLowerCase();
        let list = $("#addANewWord").find('select').val();
        let test    = /^[a-z.' `]+$/;
        if(word !== '' &&  test.test(word)) {

            $.ajax({
                type: "POST",
                async: false,
                data: {key: word},
                dataType: "html",
                url: "get_json.php"
            }).done(function (data) {
                let obj = JSON.parse(data);
                    if (obj.word_name) {
                        addWord(word, list);
                        $("#addANewWord").find('input').val('');

                    } else {
                        app.message = '请输入正确单词';
                        errorMessage();
                    }

            })
        }else {
            app.message = word == '' ? '不能为空' : '只能是英文单词';
            errorMessage();
        }
    });

    //批量单词添加单词表
    function addSomeWords(words,list) {
        $.ajax({
            type: "POST",
            data: {words:words,list:list,user:app.user},
            dataType: "html",
            url: "add_some_words.php"
        }).done(function (data) {
            let obj = JSON.parse(data);
            if(obj.state=='ok'){
                app.message = obj.message;
                successMessage();
            }else{
                app.message = obj.message;
                errorMessage();
            }
        })
    }

    $("#addSomeNewWord .button").on("click",function () {
        var words = app.wordGroup;
        let list = $("#addSomeNewWord").find('select').val();
        addSomeWords(words,list);
    });

    //读取excel表格
    $("#addSomeNewWord input").change(function(e) {
        var files = e.target.files;

        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
            try {
                var data = ev.target.result,
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    }), // 以二进制流方式读取得到整份excel表格对象
                    persons = []; // 存储获取到的数据
            } catch (e) {
                app.message = '文件类型不正确';
                errorMessage();
                return;
            }

            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    console.log(fromTo);
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }

            console.log(persons);
            var results = persons.map(function (x) {
                return x.words;
            });
            console.log(results);
            app.wordGroup =results ;
        };

        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
    });

    //新建单词表
    $('#addNewList .button').on('click',function () {
        let newList = $('#addNewList input').val().trim();
        let test    = /^[\u4E00-\u9FA5A-Za-z0-9_ ]{1,10}$/;
        if (newList !== '' && test.test(newList)) {
            $.ajax({
                type: "POST",
                data: {list:newList,user:app.user},
                dataType: "html",
                url: "add_word_list.php"
            }).done(function (data) {
                let obj = JSON.parse(data);
                if(obj.state=='ok'){
                    app.message = obj.message;
                    successMessage();
                    listTag();
                    $('#addNewList input').val('');
                }else{
                    app.message = obj.message;
                    errorMessage();
                }
            })

        }else{
            app.message = '请输入正确名称且不超过10个字符';
            errorMessage();
        }

    });

    //删除单词表
    $(".word-list").on('click','.delete-list',function () {
        let list = $(this).closest("tr").find(".list-name").text();
        var msg = "要删除这个单词表吗？";
        if (confirm(msg)==true){
            $.ajax({
                type: "POST",
                data: {list:list,user:app.user},
                dataType: "html",
                url: "del_word_list.php"
            }).done(function (data) {
                let obj = JSON.parse(data);
                if(obj.state=='ok'){
                    app.message = obj.message;
                    successMessage();
                    listTag();
                    $('#addNewList input').val('');
                }else{
                    app.message = obj.message;
                    errorMessage();
                }
            })
        }

    });

    //读取单词表
    function getWordList(list,currentPage) {

        $.ajax({
            type: "POST",
            data: {list:list,user:app.user,page:currentPage},
            dataType: "html",
            url: "show_wordlist.php"
        }).done(function (data) {
            let obj = JSON.parse(data);
            app.wordList  = obj.words;
            app.totalpage = obj.totalpage;
            $("#loading").removeClass('active');
        })

    }
    //设置中获取单词表
    $("#selectList .button").on('click',function () {
        app.currentList = $("#selectList div.text").text();
        let currentPage =1;
        $("#loading").addClass('active');
        setTimeout(function(){
            getWordList(app.currentList,currentPage);
        }, 0);
        setTimeout(function(){
            $('.ui.dropdown').dropdown();
        }, 1000);

    });
    //单词表翻页 向后
    $("#nextPage").on('click',function () {

        if(app.currentPage < app.totalpage){
            app.currentPage ++;
            $("#loading").addClass('active');
            setTimeout(function(){
                getWordList(app.currentList,app.currentPage);
            }, 0);

        }else{
            return false;
        }

    });
    //单词表翻页 向前
    $("#prePage").on('click',function () {

        if(app.currentPage > 1){
            app.currentPage --;
            $("#loading").addClass('active');
            setTimeout(function(){
                getWordList(app.currentList,app.currentPage);
            }, 0);
        }else{
            return false;
        }
    });

    //删除单词
    function delWord(wordID) {
        var msg    = "要删除这个单词吗？";
        if (confirm(msg)==true){
            $.ajax({
                type: "POST",
                data: {id:wordID},
                dataType: "html",
                url: "del_word.php"
            }).done(function (data) {
                let obj = JSON.parse(data);
                if(obj.state=='ok'){
                    app.message = obj.message;
                    successMessage();
                    let list = $("#selectList div.text").text();
                    getWordList(list,app.currentPage);
                }else{
                    app.message = obj.message;
                    errorMessage();
                }
            })
        }
    }
    
    //单词换表
    function changeWordList(id,list) {
        $.ajax({
            type: "POST",
            data: {id:id,list:list},
            dataType: "html",
            url: "change_list.php"
        }).done(function (data) {
            let obj = JSON.parse(data);
            if(obj.state=='ok'){
                app.message = obj.message;
                successMessage();
                getWordList(app.currentList,app.currentPage);
            }else{
                app.message = obj.message;
                errorMessage();
            }
        })
    }

    //全文翻译
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
                app.translatemeans    = data.translation[0];
                app.webMeans = data.web;
                setTimeout(function(){
                    $('#translateButton').removeClass('loading');
                }, 0);
            }).fail(function() {
                app.message = '全文翻译引擎错误';
                errorMessage();
                $('#translateButton').removeClass('loading');
            });
        }
    });

    //载入页面
    function loadPage() {
        //引入每日一句
        $.ajax({
            type: "GET",
            url: "get_daily.php"
        }).done(function (data) {
            var obj = JSON.parse(data);
            app.daily = obj;
            //console.log(app.daily);
        }).fail(function() {
            app.message = '每日一句调用错误';
            errorMessage();
        });
        //绑定页面切换
        if(sessionStorage.getItem("page")){
            app.page = sessionStorage.getItem("page");

        }
        //登录判断
        if(sessionStorage.getItem("login") || localStorage.getItem("login")){
            let data = JSON.parse(sessionStorage.getItem("login")) || JSON.parse(localStorage.getItem("login"));

            $.ajax({
                type: "POST",
                data: {username:data.name,token: data.token},
                dataType: "html",
                url: "check_login.php"
            }).done(function (d) {
                let login = JSON.parse(d);
                if(login.state){
                    app.login = true;
                    app.user  = login.name;
                    if(app.page=='set' || app.page=='pra'){
                        listTag();
                    }
                }
            }).fail(function() {
                app.message = '登录错误，请重新登录！';
                errorMessage();
            });

        }
    }

    //登录页面
    $("#loginForm").submit(function (e) {
        e.preventDefault();
        var um = $("input[name='username']").val().trim();
        var pw = $("input[name='password']").val().trim();
        var kl = $("input[type='checkbox']").prop('checked');
        //console.log(um+pw+kl);

        $.ajax({
            type: "POST",
            data: {username:um,password: pw},
            dataType: "html",
            url: "login.php"
        }).done(function (data) {
            var obj  = JSON.parse(data);
            if(obj.state){
                app.login = true;
                app.user  = obj.name;
                var loginfo = JSON.stringify({'name': obj.name,'token':obj.token});
                sessionStorage.setItem("login", loginfo);
                app.message = '登录成功'+ obj.name;
                successMessage();
                $('.ui.modal').modal('hide');
                $("input[name='username']").val('');
                $("input[name='password']").val('');
                if(kl){
                    localStorage.setItem("login", loginfo);
                }
            }else{
                $('.message').removeClass('hidden');
            }

        }).fail(function() {
            app.message = '服务器错误暂时无法登录';
            errorMessage();
        });

    });

    //退出登录
    $("#loginButton").on('click',function () {
        $('.ui.modal').modal('show');
    });
    $("#logoutButton").on('click',function () {
        var msg = "确定要退出登录?";
        if(confirm(msg)==true){
            sessionStorage.removeItem("login");
            localStorage.removeItem("login");
            app.login = false;
            app.user  = '';
            app.page  ='dict';
            app.message = '成功退出登录！';
            successMessage();
        }
    });

    //辅助

    //载入页面
    loadPage();
    //菜单
    $("#menu .item").on('click',function () {
        var p = $(this).attr('id');
        sessionStorage.setItem("page", p);
        app.page = p;
        if(p =='set' || app.page=='pra'){
            listTag();
        }
    });

    //读取用户单词表分类
    var listTag = function () {

        return $.ajax({
            type: "POST",
            data: {user:app.user},
            dataType: "html",
            url: "show_wordlist_name.php"
        }).done(function (d) {
            var obj = JSON.parse(d);
            app.wordListName = obj;
        }).fail(function() {
            console.log('读取单词表分类错误！');
        });

    };

    //全文翻译语言切换
    $('select[name="language"]').on('change',function () {
        app.translateTo = $(this).val()=='zh-CHS'?'English':'Chinese';
    });

    //发音
    $("#playAm").on('click',function () {

        $('#amAudio')[0].play();
    });
    $("#playEn").on('click',function () {

        $('#enAudio')[0].play();
    });
    $("#amPlay").on('click',function () {

        $('#audioAm')[0].play();
    });
    $("#enPlay").on('click',function () {

        $('#audioEn')[0].play();
    });
    //下拉菜单
    $('.ui.dropdown').dropdown();
    $('.select').dropdown();
    //单词输入显示清除按钮
    $("#searchInput").on('input focus change blur keyup',function () {
        let v = $("#searchInput").val();
        if(v !==''){
            $(".removeButton").show();
        }else{
            $(".removeButton").hide();
        }
    });
    $(".removeButton").on('click',function () {
        $("#searchInput").val('');
        $(".removeButton").hide();
    });
    //多选框
    $('.ui.checkbox').checkbox();
    //登录错误信息关闭
    $('.message .close').on('click', function() {
            $(this).closest('.message').transition('fade');
        });
    //弹出message对话框
    function errorMessage() {
        $('.errorMessage').removeClass('hidden');
        setTimeout(function(){
            $('.errorMessage').addClass('hidden');
            app.message ='';
        }, 3000);
    }
    function successMessage() {
        $('.successMessage').removeClass('hidden');
        setTimeout(function(){
            $('.successMessage').addClass('hidden');
            app.message ='';
        }, 3000);
    }

});

