var bookroombtn = $("#book-btn");
var cbook = $("#confirm-book-btn")
var bookDet = $("#bookDet");


bookroombtn.click(function(){
    var standardRooms = "#std-select";
    var deluxRooms = "#delux-select";
    var royalRooms = "#royal-select";
    var adults = "#adult-select";
    var childs = "#child-select";
    var checkIn = $("#custCheckIn");
    var checkOut = $("#custCheckOut");
    var data = validate(standardRooms,deluxRooms,royalRooms,adults,childs,checkIn,checkOut);
    var name = personalInfoElementValidator($("#custBookingFormName"));
    var mobile = personalInfoElementValidator($("#custBookingFormContact"));
    var address = personalInfoElementValidator($("#custBookingFormAddress"));

    if(!(name && mobile && address)){
        console.log('wrong value 2');
        return
    }



    if(data) {
        var url = urlBuilder('roomAllot');
        bookroombtn.text('Submitting data...');
        $.ajax({
            type: 'POST',
            data: data,
            url: url,
            success: function(data){
                if(data.errorStack){
                    alert(data.errorStack);
                    return;
                }
                bookroombtn.css({display: 'none'});
                cbook.css({display: ''});
                var name = $("#custBookingFormName");
                var address = $("#custBookingFormAddress");
                var mobile = $("#custBookingFormContact");
                var payload = payloadMakerForBooking(data,name,address,checkIn,checkOut,mobile);
                if(!payload){
                    alert('Info not complete');
                    return;
                }

                cbook.click(function () {
                    cbook.text('Confirming Booking...');
                    bookingConfirm(payload);
                })


                return;



            },
            error: function(data,request){
                var errorStack = data.responseJSON.errorStack;
                alert(errorStack);
                window.location.reload();
                return;

            }
        })

    }else{
        return;
    }
})


function payloadMakerForBooking(data,nameElement,addressElement,checkInElement,checkOutElement,mobileElement){
    console.log('payload data',data);
    var adult = data.adult;
    var child = data.child;
    if(data.roomAllotted == null){
        var error = data.errorStack;
        /**
         *
         * Please paste here code for indicating error for not availability of given numbers of rooms;
         * error text is in variable error;
         */
        alert(error);
        window.location.reload();
        return
    }
    var roomAllotted = (data.roomAllotted).toString();
    var customerId = data.customerData.customerId;
    var checkIn =checkInElement.val();
    var checkOut = checkOutElement.val();
    var price = data.totalCost;
    $('#price-booking').text(price);
    $('#price-p').css({display: ''});



    var name = personalInfoElementValidator(nameElement);
    var mobile = personalInfoElementValidator(mobileElement);
    var address = personalInfoElementValidator(addressElement);

    if(!(name && mobile && address)){
        console.log('wrong value 2');
        return
    }

    var payload = {
        adult : adult,
        child :child,
        name : name,
        mobile :mobile,
        address :address,
        roomAllotted :roomAllotted,
        customerId :customerId,
        checkIn : checkIn,
        checkOut :checkOut,
        price : price,
    }

    return payload;
}


function bookingConfirm(payloadBooking){
    var url = urlBuilder('booking');
    $.post(url,payloadBooking,function(data){
        console.log('Success',data);
    })

}


function validate(standardRooms,deluxRooms,royalRooms,adults,childs,checkIn,checkOut){
    var flag = true;
    standardRooms = selectValidator(standardRooms,0);
    deluxRooms = selectValidator(deluxRooms,0);
    royalRooms = selectValidator(royalRooms,0);
    adults = selectValidator(adults,1);
    childs = selectValidator(childs,0);

    var dateFlag = checkInvalidDateElement(checkIn,checkOut);
    console.log(adults,childs,dateFlag);
    if(standardRooms && deluxRooms && royalRooms && adults && childs && dateFlag){
        if(checkIn.hasClass('incorrect')){
            checkIn.removeClass('incorrect');
        }
        var totalRooms = Number(standardRooms) + Number(deluxRooms) + Number(royalRooms);
        if(totalRooms <=16 && totalRooms >0){
            $(standardRooms).removeClass('incorrect');
            console.log("AllChecked");
            var data = {checkIn: checkIn.val(),
                checkOut: checkOut.val(),
                child: childs,
                adult: adults,
                standard: standardRooms,
                delux: deluxRooms,
                royal: royalRooms}
            return data;
        }else{
            $(standardRooms).addClass('incorrect');
            console.log("wrong");
            return false;
        }


    }else{
        if(!checkIn.hasClass('incorrect')){
            checkIn.addClass('incorrect');
        }
        console.log("main wrong");
        return false;
    }


}


function personalInfoElementValidator(element){
    if(!checkInvalidState(element)){
        if(!element.hasClass("incorrect")){
            element.addClass("incorrect");
        }
    }else{
        element.removeClass("incorrect");
        return checkInvalidState(element);
    }
}

// function for disabling every input field

function disableAll(value){
    if(value){
        var x = $("input");
        $(x).attr("disabled", "disabled");
    }
}

function selectValidator(element,min){
    var optionSelectorString = `${element} option:selected`;
    var selectorString = `${element}`;
    var value = $(optionSelectorString).text();
    if(value == undefined || value == null || value < min){
        $(selectorString).addClass('incorrect');
        return false;
    }else{
        $(selectorString).removeClass('incorrect');
        return value;
    }
}