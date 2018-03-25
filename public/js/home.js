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
        var roomdiv = $("#rooms>div");
        var roomfullimg =  ["url(https://i.imgur.com/OvRQPrw.jpg)", "url(http://www.dhdesigner.net/wp-content/uploads/2017/05/chic-wall-lamps-for-bedroom-wall-lamp-for-bedroom.jpg)", "url(https://vignette.wikia.nocookie.net/yakuza-mob-roleplay/images/9/93/Hotel-Room-With-A-View.jpg/revision/latest?cb=20141121164436)", "url(https://media.timeout.com/images/103639807/image.jpg)"];
        var roomfullprice = ["$350", "$450", "$750", "$150"];
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
            roomfull.css({
                'background-image': roomfullimg[bgimg]
            });
            $("#typeDet").text(roomDet[bgimg].innerText);
            $("#typePrice").text(roomfullprice[bgimg]);
            
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
                $("#checkAvailInfoBox").slideDown(400);
                $("#checkbtn").prop("disabled", true);
                $("#checkInCheck").prop({'value':'Arrival Date' , "disabled": true});
                $("#checkOutCheck").prop({'value':'Departure Date' , "disabled": true});
                $("#resetbtn").show(100);

            }else{
                return;
            }

        });

        $("#resetbtn").click(function(){
            $("#checkbtn").prop("disabled", false);            
            $("#checkInCheck").prop("disabled", false);            
            $("#checkOutCheck").prop("disabled", false);
            $("#resetbtn").hide(100);
            $("#checkAvailInfoBox").slideUp(400);
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
                    dataMapper(data,checkin,checkout);
                });

            return true;
        };


        function dataMapper(data,checkin,checkout){
            var standardRoomsAvailable = data.status.standard.length;
            var deluxRoomsAvailable = data.status.delux.length;
            var royalRoomsAvailable = data.status.royal.length;
            var checkIn = new Date(checkin);
            var checkOut = new Date(checkout);
            checkIn = dateFormatter(checkIn);
            checkOut = dateFormatter(checkOut);
            $("#checkInDate").text(checkIn);
            $("#checkOutDate").text(checkOut);
            $("#stdRoomsAvail").text(standardRoomsAvailable);
            $("#deluxRoomsAvail").text(deluxRoomsAvailable);
            $("#superDeluxRoomsAvail").text(royalRoomsAvailable);

        }