var article = "";
var title = "";
var author = "";
var textContent = "";
var main_img = '';
var id = '';
var ajfile;
var artEditId;


var textArray = [];


/* ----- Импортирую блоты -------*/

let Inline = Quill.import('blots/inline');
let Block = Quill.import('blots/block');
let BlockEmbed = Quill.import('blots/block/embed');


/* ----- Создаю новые блоты -------*/
var getHref;

/* ----- Блот ссылок -------*/

class LinkBlot extends Inline {


    static create(url) {

        let node = super.create();

        node.setAttribute('href', url);
        node.setAttribute('target', '_blank');
        node.setAttribute('class', 'link-url');


        return node;
    }

    static formats(node) {
        return node.getAttribute('href');
    }


}

LinkBlot.blotName = 'link';
LinkBlot.tagName = 'a';


/* ----- Блот линии -------*/

class DividerBlot extends BlockEmbed {
}

DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';


/* ----- Блот картинки -------*/

class ImageBlot extends BlockEmbed {
    static create(value) {
        let node = super.create(value);
        node.setAttribute('contenteditable', false);
        node.classList.add('tl-figure');

        /* let node = super.create(value);
         node.setAttribute('src', value.url);
         node.setAttribute('alt', value.alt);
         node.setAttribute('id', value.id);
         node.classList.add('tl-figure');*/


        const div = document.createElement('div');
        div.classList.add('tl-block-img');


        node.appendChild(div);


        const btn_img = document.createElement('button');
        btn_img.classList.add('set-btn-img');
        $(btn_img).attr('data-id', id);
        $(btn_img).html('<i class="fa fa-check"></i>');
        div.appendChild(btn_img);


        const hov_block = document.createElement('div');
        hov_block.classList.add('inf-block-img');
        $(hov_block).html('To set this picture as the main one for your article, click on the button');
        div.appendChild(hov_block);


        const image = document.createElement('img');

        image.setAttribute('src', value.url);
        image.setAttribute('alt', value.alt);
        image.setAttribute('id', value.id);
        image.classList.add('tl-image');

        div.appendChild(image);

        const figsaption = document.createElement('div');
        figsaption.classList.add('tl-caption');

        const p = document.createElement('p');
        p.classList.add('textarea-p');


        node.appendChild(figsaption);

        const textarea = document.createElement('textarea');

        textarea.classList.add('tasker-caption');
        textarea.setAttribute('placeholder', 'Caption (optional)');
        textarea.setAttribute('wrap', 'off');
        textarea.setAttribute('rows', 1);
        textarea.setAttribute('tabindex', -1);

        figsaption.appendChild(textarea);
        figsaption.appendChild(p);


        return node;
    }

    static value(node) {
        return {
            alt: node.getAttribute('alt'),
            url: node.getAttribute('src'),
            id: node.getAttribute('id')
        };
    }
}

ImageBlot.blotName = 'image';
ImageBlot.tagName = 'figure';
//ImageBlot.tagName = 'img';
ImageBlot.className = 'img-use';


/* ----- Блот видео -------*/


class VideoBlot extends BlockEmbed {
    static create(url) {
        let node = super.create();
        node.setAttribute('contenteditable', false);
        node.classList.add('tl-figure');


        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', url);
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '360px');
        iframe.setAttribute('frameborder', '0');
        iframe.classList.add('tl-video');

        node.appendChild(iframe);

        const figsaption = document.createElement('div');
        figsaption.classList.add('tl-caption');

        node.appendChild(figsaption);

        const textarea = document.createElement('textarea');

        textarea.classList.add('tasker-caption');
        textarea.setAttribute('placeholder', 'Caption (optional)');
        textarea.setAttribute('wrap', 'off');
        textarea.setAttribute('rows', 1);
        textarea.setAttribute('tabindex', -1);

        figsaption.appendChild(textarea);
        const p = document.createElement('p');
        p.classList.add('textarea-p');
        figsaption.appendChild(p);


        return node;


    }


}

VideoBlot.blotName = 'video';
VideoBlot.tagName = 'figure';

/* ----- Регистрирую блоты -------*/

Quill.register(LinkBlot);
Quill.register(DividerBlot);
Quill.register(ImageBlot);
Quill.register(VideoBlot);

/* ----- Создаю quill editor -------*/

let quill = new Quill('#editor-container', {

    modules: {
        toolbar: {
            container: '#tooltip-controls'
        }
    }
});


$('.ql-editor p').attr('class', 'tl-field');


/* ----- Функционал tooltip panel -------*/

quill.addContainer($("#tooltip-controls").get(0));
quill.addContainer($("#sidebar-controls").get(0));
quill.on(Quill.events.EDITOR_CHANGE, function (eventType, range) {

    article = quill.root.innerHTML;
    textContent = quill.getText();
    textcount = $.trim(textContent).length;


    if (eventType !== Quill.events.SELECTION_CHANGE) return;
    if (range == null) {
        $('#tooltip-controls').hide();
        return;
    }
    if (range.length === 0) {

        $('#tooltip-controls').hide();
        let [block, offset] = quill.scroll.descendant(Block, range.index);
        if (block != null && block.domNode.firstChild instanceof HTMLBRElement) {
            let lineBounds = quill.getBounds(range);
            $('#sidebar-controls').removeClass('active').show().css({
                left: lineBounds.left - 50,
                top: lineBounds.top - 2
            });
            if (window.innerWidth <= 950) {
                $('#sidebar-controls').css({
                    left: window.innerWidth - 80,
                    top: lineBounds.top - 2
                });


            }


        } else {

            $('#sidebar-controls, #tooltip-controls').hide();
            $('#sidebar-controls').removeClass('active');
        }
    } else {
        $('#sidebar-controls, #sidebar-controls').hide();
        $('#sidebar-controls').removeClass('active');
        let rangeBounds = quill.getBounds(range);

        $('#tooltip-controls').show().css({
            left: rangeBounds.left + rangeBounds.width / 2 - $('#tooltip-controls').outerWidth() / 2,
            top: rangeBounds.bottom - 70,

        });

        var w_elem = $('#tooltip-controls').outerWidth() / 2 + 10;

        if (window.innerWidth <= 900) {
            if (rangeBounds.left < w_elem) {
                $('#tooltip-controls').css({
                    left: 10,
                    top: rangeBounds.bottom - 70
                });
            }

            if (window.innerWidth - rangeBounds.right < w_elem + 10) {
                $('#tooltip-controls').css({

                    left: window.innerWidth / 2 - w_elem

                });

            }
        }


    }


});

$('#show-controls').click(function () {
    $('.ql-editor').removeAttr('data-placeholder');

})


/* ----- Функция линии -------*/

$('#divider-button').click(function () {
    let range = quill.getSelection(true);
    quill.insertEmbed(range.index, 'divider', true, Quill.sources.USER);
    quill.setSelection(range.index + 1, Quill.sources.SILENT);
    $('#sidebar-controls').hide();
});


/* ----- Функция ссылки -------*/

$('.ql-editor').on('mouseover', 'a', function () {
    $('#show-link').html('<p>' + $(this).attr('href') + '</p>');
    var ex = this.getBoundingClientRect();
    $('#show-link').show().css({
        top: ex.bottom,
        left: ex.left + ex.width / 2 - $('#show-link').outerWidth() / 2
    });
    var w_elemLin = $('#show-link').outerWidth() / 2 + 10;

    if (ex.left < w_elemLin) {
        $('#show-link').css({
            top: ex.bottom + 10,
            left: 10
        });
    }

    if (window.innerWidth - ex.right < w_elemLin + 10) {
        $('#show-link').css({
            top: ex.bottom + 10,
            left: window.innerWidth / 2 - w_elemLin
        });
    }
})

$('.ql-editor').on('mouseout', 'a', function () {

    $('#show-link').hide();
})


/* ----- Функция картинки -------*/

$('#image-button').click(function () {


    var input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.onchange = function () {
        const file = input.files[0];

        // file type is only image.
        if (/^image\//.test(file.type)) {
            saveToServer(file);
        } else {
            console.warn('You could only upload images.');
        }
    }

    function saveToServer(file) {

        const fd = new FormData();
        fd.append('image', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://api.watchvaultapp.com/articles/upload', true);
        xhr.setRequestHeader("Authorization", "Bearer Grne3sTy8v-sE_YqyQqt5femRwyF6cPs");
        xhr.responseType = 'json';
        xhr.onload = function () {
            if (xhr.status === 202) {
                var Url = xhr.response;
                insertToEditor(Url.url);
            }
        };
        xhr.send(fd);


    }

    function insertToEditor(url) {
        // push image url to rich editor.
        const range = quill.getSelection(true);
        id++;

        quill.insertEmbed(range.index, 'image', {
            alt: 'User Img',
            url: url,
            id: id
        }, Quill.sources.USER);


        quill.setSelection(range.index + 2, Quill.sources.SILENT);

    }


    $('#sidebar-controls').hide();
});

/* ----- Установить картинку на главную -------*/

$('.ql-editor').on('click', '.tl-block-img img', function (e) {
    var img = $('.set-main-img');


    if (e.type == 'click') {
        console.log($(this).attr('src'));
        if ($(this).attr('class') === 'active') {
            $(this).removeAttr('class');
        } else {
            $(this).attr('class', 'active');
        }

    }
})

$('.ql-editor').on('click', '.set-btn-img', function (e) {

    if ($('button').is('.active-btn')) {

        $('.active-btn').attr('class', 'set-btn-img');
        $(this).attr('class', 'active-btn');

    } else {
        $(this).attr('class', 'active-btn');
    }

    var img = $(this).attr('data-id');
    main_img = $('#' + img).attr('src');
    console.log(main_img)


})

/* ----- Функция видео -------*/


$('#video-button').click(function () {
    let range = quill.getSelection(true);
    // quill.insertText(range.index, '\n', Quill.sources.USER);
    let url = prompt('Insert video link');

    if (isUrl(url)) {
        quill.insertEmbed(range.index, 'video', url, Quill.sources.USER);
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }
    $('#sidebar-controls').toggleClass();

});

$('#show-controls').click(function () {
    $('#sidebar-controls').toggleClass('active');
    quill.focus();
});

/*----- Update article -----*/

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

var articleId = findGetParameter("id");

if (articleId) {
    var url = "http://api.watchvaultapp.com/articles/" + articleId;
    var method = "GET";
    $.when(send(method, url, null, null)).done(function (response) {

        if (response) {


            var exe = document.createElement('div');
            $(exe).attr('class', 'wrapcontent');
            exe = $(exe)[0];
            $(exe).html(response.text);

            var images = exe.getElementsByTagName('img');
            var textareaTags = exe.getElementsByClassName('tl-caption');


            for (var i = 0; i < images.length; i++) {
                var self = $(images[i]);
                var idBtn =  $(images[i]).attr('id');
                var classActive = 'set-btn-img';
                var divInfImg = 'inf-block-img';
                if (self.attr('src') == response.main_photo) {
                    classActive = 'active-btn';
                }
                self.before('<button class="' + classActive + '" data-id="'+idBtn+'"><i class="fa fa-check"></i></button>');
                self.before('<div class="' + divInfImg + '">To set this picture as the main one for your article, click on the button</div>');
            }
            for (var j = 0; j < textareaTags.length; j++) {
                var self = $(textareaTags[j]);
                var text = self.text();
                self.prepend('<textarea placeholder="caption"   cols="45">'+text+'</textarea>');
            }


            exe = $(exe).prop('innerHTML');


            var data = response;
            $('.tl-title').val(data.title);
            $('.tl-author').val(data.author);
            $(".ql-editor").html(exe);
            title = data.title;
            author = data.author;

        } else {
            alert("No data");
        }
    });
}

/*----- поменять формат даты -----*/

function timestampToDate(timestamp) {
    var monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var year = date.getFullYear();
    var month = date.getMonth();
    for (var i = 0; i <= month; i++) {
        if (i == month) {
            month = monthArr[i];
        }
    }
    var day = date.getDate();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = month + ' ' + day + ',' + ' ' + year;
    return formattedTime;


}

/* ----- Функция отправки данных publish -----*/

$('#publish-btn').click(function () {
    $('#tooltip-controls').hide();
    if (main_img == '') {
        var arr_img = document.getElementsByTagName('img');
        var src = arr_img[0];
        main_img = $(src).attr('src');

    }


    if (title.length >= 4 && author.length >= 1 && textcount > 1) {

        var ex = document.createElement('div');
        $(ex).attr('class', 'wrap-content');
        $(ex).html(article);
        var captions = document.getElementsByClassName('tl-caption');
        var textareaP = ex.getElementsByClassName('textarea-p');
        var textarea_remove = ex.getElementsByTagName('textarea');
        var btn_remove = ex.getElementsByTagName('button');
        var infBtn_remove = ex.getElementsByClassName('inf-block-img');

        for (var i = 0; i < captions.length; i++) {
            var value = captions[i].getElementsByTagName('textarea')[0].value;
            textareaP[i].innerHTML = value;
        }
        $(textarea_remove).remove();
        $(btn_remove).remove();
        $(infBtn_remove).remove();
        article = $(ex).prop('innerHTML');
        console.log(article);


        /*$obj = quill.getContents();
        console.log($obj.ops);*/
        var data = {
            "title": title,
            "author": author,
            "text": article,
            "main_photo": main_img
        }


        $('#show-controls').toggle();

        if (articleId) {

            $.ajax({
                method: "PATCH",
                url: "http://api.watchvaultapp.com/articles/" + articleId,
                headers: {
                    "Authorization": "Bearer Grne3sTy8v-sE_YqyQqt5femRwyF6cPs"
                },
                data: data,
                success: function (data) {
                    //location.href = 'http://textedit.test/article.html?id=' + articleId;
                    $('#date-create').html(' • ' + timestampToDate(data.created_at));
                    var lengthField = $('.tl-author').val().length;
                    $('.tl-title').attr('disabled', 0);
                    $('.tl-author').attr('size', lengthField);
                    $('.tl-author').attr('disabled', 0);
                    $('textarea').attr('disabled', 'disabled');
                    $('.set-btn-img').attr('disabled', 'disabled');
                    $('.inf-block-img').attr('class', 'inf-none');
                    $('#date-create').html(' • ' + timestampToDate(data.created_at));

                    $('#publish-btn').css('display', 'none');
                    $('#edit-btn').css('display', 'block');
                    $('.ql-editor').attr('contenteditable', 'false');
                    $('.ql-editor p').css('cursor', 'default');
                    $('.ql-editor').css('cursor', 'default');

                },
                error: function (err) {

                }
            });
        } else {
            $.ajax({
                method: "POST",
                url: "http://api.watchvaultapp.com/articles",
                headers: {
                    "Authorization": "Bearer Grne3sTy8v-sE_YqyQqt5femRwyF6cPs"
                },
                data: data,

                success: function (data) {

                    $('.tl-title').attr('disabled', 0);
                    $('.tl-author').attr('disabled', 0);

                    $('#date-create').html(' • ' + timestampToDate(data.created_at));

                    $('#publish-btn').css('display', 'none');
                    $('#edit-btn').css('display', 'block');
                    $('.ql-editor').attr('contenteditable', 'false');
                    $('.ql-editor p').css('cursor', 'default');
                    $('.ql-editor').css('cursor', 'default');
                    articleId = data.id;


                },
                error: function (err) {

                }
            });
        }


    } else if (title.length < 4) {
        $('.tl-title').css('color', '#fc0e0a');
        $('#error-msg').html('Title is too small');
        $('.tl-title').keypress('text-change', function () {
            $('.tl-title').css('color', '#23241f');
            $('#error-msg').html('');
        });


    } else if (author.length < 1) {

        $('.tl-author').css('color', '#fc0e0a');
        $('#error-msg').html('Empty content');
        $('.tl-author').keypress('text-change', function () {
            $('.tl-author').css('color', '#777');
            $('#error-msg').html('');
        });

    } else if ($.trim(textContent).length < 1) {
        $('#error-msg').html('Empty content');
        $('.ql-editor').keypress('text-change', function () {

            $('#error-msg').html('');


        });
    }

})


$('#edit-btn').click(function () {
    $('#tooltip-controls').hide();
    $('#show-controls').toggle();

    $(document).on('mousedown selectstart', function () {
        return true;

    })

    $('#publish-btn').css('display', 'block');
    $('#edit-btn').css('display', 'none');

    $('.tl-title').removeAttr('disabled');
    $('.tl-author').removeAttr('disabled');
    $('#date-create').html('');
    $('.ql-editor').attr('contenteditable', 'true');
    $('#date-publ').html('');
    $('.ql-editor p').css('cursor', 'text');
    $('.ql-editor').css('cursor', 'text');
    $('textarea').removeAttr('disabled');
    $('.set-btn-img').removeAttr('disabled');
    $('.inf-none').attr('class', 'inf-block-img');

});


/* ----- Дополнительные функции -------*/

$(document).ready(function () {

    /* ----- Переход по инпутам  -------*/

    $(document).keypress(function (event) {
        if (event.keyCode == 13) {
            $(event.target).parent().next().find('.tl-field').focus();
            event.preventDefault();
        }
    });


    /* ----- Header инпут Title инпут Name  -------*/


    $('.tl-title').focus(function () {

        if (this.value == 'Title') {
            this.value = '';
        }
        var change_tl = "";
        $('.tl-title').bind('keydown keyup', function (e) {

            if (e.type == "keyup" || e.type == "keydown") {
                change_tl = $(this).val();
                if (change_tl.length >= 1) {
                    $('[data-label="Title"]').attr('class', 'lb-focus');

                } else {
                    $('[data-label="Title"]').removeClass();
                }

                title = change_tl;
                return;
            }

        });

    })


    $('.tl-author').focus(function () {
        if (this.value == 'Your name') {
            this.value = '';
        }

        var change_ph = "";

        $('.tl-author').bind('keydown keyup', function (e) {

            if (e.type == "keyup" || e.type == "keydown") {
                change_ph = $(this).val();
                if (change_ph.length >= 1) {
                    $('[data-label="Author"]').attr('class', 'lb-focus');
                } else {
                    $('[data-label="Author"]').removeClass();
                }

                author = change_ph;
                return;
            }

        });

    })


    $('.tl-title').blur(function () {
        if (this.value == '') {
            this.value = 'Title';
        }
    })

    $('.tl-author').blur(function () {
        if (this.value == '') {
            this.value = 'Your name';
        }
    })




    /*----- Placeholder main content -----*/

    var chilP = $('.ql-editor');
    chilP.attr('data-placeholder', 'Your article ...');


});

/*function textArSize(){

    var textareaSize = $(this);
    console.log(textareaSize)
    var top = textareaSize.scrollTop();
    var height = textareaSize.height();
    console.log(height)
    if(top > 0){
        textareaSize.css("height",top + height);

    }
}*/

/*------ проверка ширина экрана ------*/


/// cheking functions

function isUrl(text) {
    if (text != null) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.match(urlRegex) != null ? true : false;
    }
}

function isNewArticle() {
    return findGetParameter("id") === null;
}

function send(method, url, gdata, headers) {

    /*var responseObject;
    var object = {};
    object.method = method;
    object.url = url;
    object.success = function (response) {
    ajfile=
        return {status: true, data: response};
    };
    object.error = function (err) {
        return {status: false, data: err};
    }
    if (data) {
        object.data = data;
    }
    if (headers) {
        object.headers = headers;
    }
    ;
    $.ajax(object)*/
    var def = $.Deferred();
    var rdata = [];
    $.ajax({
        method: method,
        url: url,
        headers: headers,
        data: gdata,
        success: function (data) {
            rdata = data;
            rdata.status = true;
            def.resolve(rdata);
        },
        error: function (err) {
            rdata.status = false;
            def.resolve(rdata);
        }
    })

    return def.promise();

}

















