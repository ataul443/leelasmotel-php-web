var rev = $('#reviews>div');
        var count = 0;
        rev.css({
            'display' : 'none'
        })
        function revslide() {
            for (i = 0; i < 3; i++) {
                if (i == count) {
                    rev[i].style.display = "block";
                } else {
                    rev[i].style.display = "none";
                }
            }

            count++;
            count %= 3;
        }
        setInterval(revslide, 5000);

        var roomfull = $('#roomFull');
        var roomdiv = $('#rooms>div');
        var roomDet = $('#rooms #roomType');
        var roomPrice = $('#rooms #price');
        var bgimg;
        var typeDet = $("#typeDet");        
        var typePrice = $("#typePrice");

        $('#cross0').click(function () {
            roomfull.hide(500);
        });
        roomdiv.click(function(){
            roomfull.show(500);
            bgimg = $(this).index();
            carousel0();
        });
        $('#prev').click(function () {
            bgimg--;
            carousel0();
        });
        $('#next').click(function () {
            bgimg++;
            carousel0();
        });

        function carousel0()
        {
            if(bgimg == roomdiv.length)
                bgimg=0;
            if(bgimg<0)
                bgimg = roomdiv.length-1;
            $('#carousel0').css({
                'background-image': $(roomdiv[bgimg]).css('background-image')
            });
            $("#typeDet").text(roomDet[bgimg].innerText);
            $("#typePrice").text(roomPrice[bgimg].innerText);
            
        }

        $("#linkAccomo").click(function () { 
            $('html, body').animate({
                scrollTop: $("#accommodation").offset().top
            }, 500); /*animation time length*/
        });

        // checkAvailability funtion
        $("#checkAvailInfoBox").slideUp(400);


        $("#checkbtn").click(function(){
            var flag = check();
            if(flag){
                if($(window).width() <= 700){
                    if($("#checkbtn").text() == "CHECK")
                    {
                        $("#checkAvailInfoBox").slideToggle(400);
                    }
                }
                else
                    $("#checkAvailInfoBox").slideToggle(400);
            }
        });


        function check(){
            var checkin = $("#checkInCheck").val();
            var checkout = $("#checkOutCheck").val();

            //var adult = $("#selectGuestAdult").val();
            //var child = $("#selectGuestChild").val();
            var flag = checkInvalidDateElement($("#checkInCheck"),$("#checkOutCheck"));
            if(!flag){
                $("#checkAvailError").slideDown(300);
                return false;
            }else{
                $("#checkAvailError").slideUp(100);
            }
            var urlFull = window.location.href;
            var urlSplitArray = urlFull.split('public/');
            var urlMain = urlSplitArray[0];
            var url = urlMain + 'public/availabilityCheck';


            console.log("url",url);

            $.post(url,
                {checkin: checkin,
                    checkout: checkout},function (data,result){
                console.log(data);
                    dataMapper(data);
                });

            return true;
        };


        function dataMapper(data){
            var standardRoomsAvailable = data.status.standard.length;
            var deluxRoomsAvailable = data.status.delux.length;
            var royalRoomsAvailable = data.status.royal.length;

            $("#stdRoomsAvail").text(standardRoomsAvailable);
            $("#deluxRoomsAvail").text(deluxRoomsAvailable);
            $("#superDeluxRoomsAvail").text(royalRoomsAvailable);

        }