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