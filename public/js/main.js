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
                    a.slideDown(500);
                        b.slideDown(500, function(){
                            c[0].innerText = "CHECK";
                        });   
                });
             }


$("#logOutBtn").click(function(){
    var urlFull = window.location.href;
    var urlSplitArray = urlFull.split('public/');
    var urlMain = urlSplitArray[0];
    var url = urlMain + 'public/auth/login';
    $.ajax({
        type: "GET",
        url: url,
        success: function() {
            window.location.href = urlMain + 'public/'
        }
    });
    return false;
})


function checkInvalidState(element){
    var elementVal = element.val();
    if(elementVal != '' || elementVal != undefined){

        return elementVal.trim();
    }else{
        return false;
    }
}

function checkInvalidElement(element,value) {
    var elementVal = checkInvalidState(element);
    if(elementVal){
        if(elementVal >= value){
            return elementVal;
        }else{
            invalidIndicator(element);
            return false;
        }
    }else{
        invalidIndicator(element);
        return false;
    }
}

function checkInvalidDateElement(checkInElement,checkOutElement){
    var checkIn = checkInElement.val();
    var checkOut = checkOutElement.val();
    if( checkIn == "" || checkOut == ""){
        return false;
    }
    var checkInDate = new Date(checkIn);
    var checkOutDate = new Date(checkOut);
    var today = new Date();

    if(checkInDate <= today || checkInDate >= checkOutDate || dateDiff(checkInDate,checkOutDate) > 45 ){
        invalidIndicator(checkInElement);
        return false;
    }else{
        console.log(checkInDate,checkOutDate);
        return true;
    }
}

function dateDiff(checkInDate,checkOutDate){
    var timeDiff = Math.abs(checkInDate.getTime() - checkOutDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
}


function invalidIndicator(element){
    if(element.hasClass('incorrect')){
        element.removeClass('incorrect');
    }else{
        element.addClass('incorrect');
    }
}

function urlBuilder(afterPublicSegment){
    var urlFull = window.location.href;
    var urlSplitArray = urlFull.split('public/');
    var urlMain = urlSplitArray[0];
    var url = urlMain + 'public/' + afterPublicSegment;
    return url;
}

function errorDisplay(element,cssFormer,cssLater,error){
    if(element.css('display').toLowerCase() == cssFormer){
        element.css('display',cssLater);
    }
    errorMapper(element,error);
}

function errorMapper(element,error){
    element.text(error);
}

