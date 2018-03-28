    
    var maxHt = Math.max.apply(null, $(".procard").map(function(){
    return $(this).height();
    }).get());

    $("#wrapper>div").css(
        'height' , $("#bookDet").height()
    );
    // $("#bookDet").height()
    $(".procard").css(
        'height' , $("#bookDet").height()
    );

var payConBtn = $("#payConbtn");
var bookroombtn = $("#bookRoomBtn");
var payConBtn = $("payConbtn");
var payCon = $("#payCon");
var paySum = $("#bookComplete");


bookroombtn.click(function(){
    summaryDet();
    bookRoom.css(
        'transform' , 'rotateY(90deg)'
    );
    bookDet.css(
        'transform', 'rotateY(0deg)'
    );
    $("#cssmenu ul li:nth-of-type(4)").removeClass("doing").addClass("done");
    $("#cssmenu ul li:nth-of-type(3)").removeClass("nextStep").addClass("doing");
    $('html, body').animate({
        scrollTop: $("#cssmenuCont").offset().top
    }, 500);
});





 payConBtn.click(function(){
    payCon.css(
        'transform' , 'rotateY(90deg)'
    );
    paySum.css(
        'transform', 'rotateY(0deg)'
    )            
    $("#cssmenu ul li:nth-of-type(2)").removeClass("doing").addClass("done");
    $("#cssmenu ul li:nth-of-type(1)").removeClass("nextStep").addClass("doing");
    $('html, body').animate({
        scrollTop: $("#cssmenuCont").offset().top
    }, 500);
});
var k = $("#selRoomDiv #roomTypeSel");
var j = $("#selRoomDiv #priceSel");
var i;
/*
$("#selectRoom>div").click(function(){
        i = $(this).index();
        $("#selectRoom, #bookRoom>div:nth-of-type(2)>p").slideUp(500, function(){
            $("#bookRoom").removeClass("bookRoom");                   
            $("#selectedRoom").innerText = s[i].innerText;
            $("#selectedPrice").innerText = j[i].innerText;
            $("#bookRoom form, #bookRoom>div:nth-of-type(3)").slideDown(500); 
        });
});
*/




function summaryDet(){
    var a = $("#selectedRoom").attr('value');
    var x = $(".sumRoom");
    var dateIn = $(".sumCheckIn");
    var dateOut = $(".sumCheckOut");            
    var guest = $(".sumguest");
    var roomno = $(".sumroomno");
    var adult = $(".adult");
    var child = $(".child");
    for(z=0; z<2; z++)
    {
        dateIn[z].innerText = $("#indate").val();
        dateOut[z].innerText = $("#outdate").val();
        adult[z].innerText = $("#selectGuestAdult").val();
        child[z].innerText = $("#selectGuestChild").val();
        $(".sumRoomStd")[z].innerText = $("#selectStdRoom").val();
        $(".sumRoomDlx")[z].innerText = $("#selectDeluxRoom").val();
        $(".sumRoomRyl")[z].innerText = $("#selectSuperRoom").val();
    }
}

