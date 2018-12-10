
/*----- Функция получить параметр page -----*/

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
/*----- Функция перехода по страницам -----*/

function getPagination(xhr)
{

    var object = {};
    object.currentPage = parseInt(xhr.getResponseHeader('X-Pagination-Current-Page'));
    object.pageCount = parseInt(xhr.getResponseHeader('X-Pagination-Page-Count'));
    object.perPage = parseInt(xhr.getResponseHeader('X-Pagination-Per-Page'));
    object.totalCount = parseInt(xhr.getResponseHeader('X-Pagination-Total-Count'));
    var next= object.currentPage+1;
    var prev = object.currentPage-1;
    pageArt=object.currentPage;
    if(object.currentPage!=1){
        $('#pagination').append('<a href="/articles.html?page='+prev+'"><i class="fa fa-angle-left"></i></a>');
    }


    for (var i=1; i <= object.pageCount; i++) {

        var btnClass = object.currentPage == i ? 'class="pag-btn-active"' : '';
        $('#pagination').append('<span '+btnClass+'><a href="/articles.html?page='+i+'">'+i+'</a></span>');


    }

    $('.pag-btn-active').children().remove();
    $('.pag-btn-active').html(object.currentPage);

    $('#pagination').append('<a href="/articles.html?page='+next+'"><i class="fa fa-angle-right"></i></a>');
    $('#pagination').append('<a href="/articles.html?page='+object.pageCount+'"><i class="fa fa-angle-double-right"></i></a>');

    console.log(object.currentPage);

}

/*----- Функция вывести все статьи -----*/

		var page = findGetParameter("page");
		if(page==null){
		    page=1;
        }
		var link = "http://api.watchvaultapp.com/articles?per-page=19";
		if(page){
			link = link + '&page='+page;

		}
		$.ajax({
			method: "GET",
			url: link,
			success: function(data,textStatus, xhr){
				var wrap = $('.wrap-art');
				for(var i=1; i<data.length;i++){
					var id = data[i].id,
						title = data[i].title,
						author = data[i].author,
						main_photo = data[i].main_photo;


					wrap.append('<article id="block-article-'+id+'" class="block-article">'
						+'<div class ="entry-img">'
						+'<a href="/article.html?id='+id+'" class="link-view-article">'
						+'<img src="'+main_photo+'" alt="Картинка поста"></a></div></article>');

					$('.wrap-art #block-article-'+id).append('<div class="entry-info">'
						+'<a href="/article.html?id='+id+'&page='+page+'" class ="title-article">'
						+'<h1 class ="head-article" id="head-article-'+id+'">'+title+'</h1></a>'
						+'<div class ="author-article">'
						+'<p class ="name-author">'+author+'</p><span class="date-publ">'+timestampToDate(data[i].created_at)+'</span></div></div>');



				}

				getPagination(xhr);
			}
		});

/*----- поменять формат даты -----*/

		function timestampToDate(timestamp) {
			var date = new Date(timestamp*1000);
			var hours = date.getHours();
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var minutes = "0" + date.getMinutes();
			var seconds = "0" + date.getSeconds();
			var formattedTime =day +'.'+ month +'.'+ year;
			return formattedTime;
		}

/*----- Функция удаления статьи -----*/

function delArt(){
    console.log('del');

    $.ajax({
        method: "DELETE",
        url: "http://api.watchvaultapp.com/articles/"+id,
        headers: {
            "Authorization":"Bearer Grne3sTy8v-sE_YqyQqt5femRwyF6cPs"
        },
        complete: function(xhr, textStatus){
            if(xhr.status == 204){
                location.href = "/articles.html?page="+page;

            }
        }
    });

}

/*----- Функция обновления статьи -----*/

function updArt(){


    location.href = "/index.html?id="+id;

}

/*----- Получить данные статьи и отобразить -----*/

var id = findGetParameter("id");
if(id){
    $.ajax({
        method: "GET",
        url: "http://api.watchvaultapp.com/articles/"+id,
        success: function(data){

            $('.title-art').html(data.title);
            $('.author-art').html(data.author);
            $('.add-date').html('<span class="point">&#8226</span> ' + timestampToDate(data.created_at))
            $("#content").html(data.text);

        }
    });
}



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

/*----- Поменять формат даты -----*/

function timestampToDate(timestamp) {
    var date = new Date(timestamp*1000);
    var hours = date.getHours();
    var year = date.getFullYear();
    var moth = date.getMonth();
    var day = date.getDate();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime =day +'.'+ moth +'.'+ year;
    return formattedTime;
}

/*----- Вернуться к списку статей -----*/
function returnPage(){
    location.href = "/articles.html?page="+page;
    console.log(page);
}




		