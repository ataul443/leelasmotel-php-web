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
        
        var roomfullimgStandard =  ["url('http://localhost/motel/leelasmotel-php-web/public/images/standardRoom/01.jpg')", "url('http://localhost/motel/leelasmotel-php-web/public/images/standardRoom/02.jpg')", "url('http://localhost/motel/leelasmotel-php-web/public/images/standardRoom/03.jpg')"];
        var roomfullpriceStandard = ["$350", "$450", "$750"];
        var roomfullimgDelux =  ["url('http://localhost/motel/leelasmotel-php-web/public/images/deluxRoom/01.jpg')", "url('http://localhost/motel/leelasmotel-php-web/public/images/deluxRoom/02.jpg')", "url('http://localhost/motel/leelasmotel-php-web/public/images/deluxRoom/03.jpg')"];        
        var roomfullpriceDelux = ["$550", "$850", "$2750"];
        var roomfullimgRoyal =  ["url('http://localhost/motel/leelasmotel-php-web/public/images/royalRoom/01.jpg')", "url('http://localhost/motel/leelasmotel-php-web/public/images/royalRoom/02.jpg')", "url('http://localhost/motel/leelasmotel-php-web/public/images/royalRoom/03.jpg')"];
        var roomfullpriceRoyal = ["$3530", "$2450", "$7550"];
        var roomDet = $('#rooms #roomType');
        var roomPrice = $('#rooms #price');
        var bgimg;
        var counter = 0;

        $('#cross0').click(function () {
            roomfull.hide(500);
        });
        roomdiv.click(function(){
            roomfull.show(300);
            bgimg = $(this).index();
            carousel0();
        });
        $('#prev').click(function () {
            counter--;
            carousel0();
        });
        $('#next').click(function () {
            counter++;
            carousel0();
        });

        function carousel0()
        {
            if(counter > 2)
                counter=0;
            if(counter<0)
                counter = 2;

            if(bgimg == 0){
                roomfull.css({
                    'background-image': roomfullimgStandard[counter]
                }); 
                $("#typePrice").text(roomfullpriceStandard[counter]); 
            } 
            if(bgimg == 1){
                roomfull.css({
                    'background-image': roomfullimgDelux[counter]
                }); 
                $("#typePrice").text(roomfullpriceDelux[counter]); 
            } 
            if(bgimg == 2){
                roomfull.css({
                    'background-image': roomfullimgRoyal[counter]
                }); 
                $("#typePrice").text(roomfullpriceRoyal[counter]); 
            } 
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
                $("#checkbtn").css("display" , "none");
                $("#checkInCheck").prop({'value':'Arrival Date' , "disabled": true});
                $("#checkOutCheck").prop({'value':'Departure Date' , "disabled": true});
                $("#resetbtn").show(100);

            }else{
                return;
            }

        });

        $("#resetbtn").click(function(){
            $("#checkbtn").prop("disabled", false);
            $("#checkbtn").css("display" , "block");            
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


        function getPrice(){}