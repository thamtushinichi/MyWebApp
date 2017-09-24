
// $(document).ready(function(){
//
//
// 	/* ---- Countdown timer ---- */
//
// 	$('#counter').countdown({
// 		timestamp : (new Date()).getTime() + 11*24*60*60*1000
// 	});
//
//
// 	/* ---- Animations ---- */
//
// 	$('#links a').hover(
// 		function(){ $(this).animate({ left: 3 }, 'fast'); },
// 		function(){ $(this).animate({ left: 0 }, 'fast'); }
// 	);
//
// 	$('footer a').hover(
// 		function(){ $(this).animate({ top: 3 }, 'fast'); },
// 		function(){ $(this).animate({ top: 0 }, 'fast'); }
// 	);
//
//
//
//
//
//
// });


function  saveComment() {
	var name=$("#name").val();
	var detail=$("#detail").val();
	var product_id=$("#product_id").val();
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    var today = dd+'/'+mm+'/'+yyyy;

	$.ajax({
		url:"/comment/add",
		type:"POST",
		dataType:"json",
		data:{name: name, detail: detail, product_id: product_id},
		success: function () {

			var trHtml='<div class="additional_info_sub_grids">'
            +'<div class="col-xs-2 additional_info_sub_grid_left">'
            +'</div>'
            +'<div class="col-xs-10 additional_info_sub_grid_right">'
            +'<div class="additional_info_sub_grid_rightl">'
            +'<a href="single.html">'+name+'</a>'
            +'<h5>'+today+'</h5>'
            +'<p>'+detail+'</p>'
            +'</div>'
            +'<div class="additional_info_sub_grid_rightr">'
            +'<div class="rating">'
            +'<div class="rating-left">'
            +'<img src="/images/star-.png" alt=" " class="img-responsive">'
            +'</div>'
            +'<div class="rating-left">'
            +'<img src="/images/star-.png" alt=" " class="img-responsive">'
            +'</div>'
            +'<div class="rating-left">'
            +'<img src="/images/star.png" alt=" " class="img-responsive">'
            +'</div>'
            +'<div class="rating-left">'
            +'<img src="/images/star.png" alt=" " class="img-responsive">'
            +'</div>'
            +'<div class="rating-left">'
            +'<img src="/images/star.png" alt=" " class="img-responsive">'
            +'</div>'
            +'<div class="clearfix"> </div>'
            +'</div>'
            +'</div>'
            +'<div class="clearfix"> </div>'
            +'</div>'
            +'<div class="clearfix"> </div>'
            +'</div>"';

			$('#comment').append(trHtml);
        }
	})
}

function check_pass() {
    if (document.getElementById('create_password').value==
        document.getElementById('confirm_password').value) {
        document.getElementById('create_account').disabled = false;
        document.getElementById('notify').innerHTML="";
    } else {
        document.getElementById('create_account').disabled = true;
        if(document.getElementById('confirm_password').value!="")
        document.getElementById('notify').innerHTML="Mật khẩu nhập lại không khớp";
    }
}

function show_comment(id){


    var skip=$("#more").attr('name');

    $.ajax({
        url:"/comment/"+id+"/"+skip,
        type:"GET",
        success: function (data) {
            for(var i=0;i<data.length;i++) {

                var trHtml = '<div class="additional_info_sub_grids">'
                    + '<div class="col-xs-2 additional_info_sub_grid_left">'
                    + '</div>'
                    + '<div class="col-xs-10 additional_info_sub_grid_right">'
                    + '<div class="additional_info_sub_grid_rightl">'
                    + '<a href="single.html">' + data[i].name + '</a>'
                    + '<h5>' + data[i].date + '</h5>'
                    + '<p>' + data[i].detail + '</p>'
                    + '</div>'
                    + '<div class="additional_info_sub_grid_rightr">'
                    + '<div class="rating">'
                    + '<div class="rating-left">'
                    + '<img src="/images/star-.png" alt=" " class="img-responsive">'
                    + '</div>'
                    + '<div class="rating-left">'
                    + '<img src="/images/star-.png" alt=" " class="img-responsive">'
                    + '</div>'
                    + '<div class="rating-left">'
                    + '<img src="/images/star.png" alt=" " class="img-responsive">'
                    + '</div>'
                    + '<div class="rating-left">'
                    + '<img src="/images/star.png" alt=" " class="img-responsive">'
                    + '</div>'
                    + '<div class="rating-left">'
                    + '<img src="/images/star.png" alt=" " class="img-responsive">'
                    + '</div>'
                    + '<div class="clearfix"> </div>'
                    + '</div>'
                    + '</div>'
                    + '<div class="clearfix"> </div>'
                    + '</div>'
                    + '<div class="clearfix"> </div>'
                    + '</div>';
                $('#comment').append(trHtml);
            }


            if(data.length!=0) {
                $("#more").attr('name', parseInt(skip) + 10);
            }else {
                $("#more").hide();
            }
        }
    })
}


