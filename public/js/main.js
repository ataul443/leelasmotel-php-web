var slide = ["https://i.imgur.com/g5kvcni.jpg", "https://i.imgur.com/hcRgjvs.jpg", "https://i.imgur.com/vmmaTZq.jpg"];
        var slideDiv = $('#slider');
        var counter = 0;

        function slider() {
            slideDiv.stop().animate({
                opacity: 0.2
            }, 100, function () {
                slideDiv.css({
                    'background-image': "url('" + slide[counter] + "')"
                });
                counter++;
                if (counter == 3) {
                    counter = 0;
                }
            }).animate({
                opacity: 1
            }, 100);

        }
        setInterval(slider, 3000);

        $("#menu-icon").on("click", collapse);

        function collapse() {
            $("#navCont>div:nth-of-type(2) ").slideToggle(200);
        }

        $('#cross').click(function () {
        $("#signuppage").slideUp(500);
        });

        $("#signUp").click(function(){            
            $("#signuppage").slideDown(500, mySignUp());
        });
        $("#logIn").click(function(){            
            $("#signuppage").slideDown(500, myLogIn());
        });
        $("#accountPopUp").slideUp();
        $("#account").click(function(){            
            $("#accountPopUp").slideToggle(500);
        });

            if($(window).width() <= 700){
                var a = $("#checkAvail span:nth-of-type(1)");
                var b = $("#checkAvail span:nth-of-type(2)");
                var c = $("#checkbtn");
                c[0].innerText = "CHECK AVAILABILITY";
                c.click(function(){
                    a.slideToggle(500);
                        b.slideToggle(500);
                        if(c[0].innerText == "CHECK AVAILABILITY")
                                c[0].innerText = "CHECK";
                            else
                                c[0].innerText = "CHECK AVAILABILITY";
                            
                });
             }