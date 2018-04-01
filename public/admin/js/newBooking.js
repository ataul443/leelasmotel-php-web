var bookroombtn = $("#book-btn");
var bookRoom = $("#bookRoom")
var bookDet = $("#bookDet");


bookroombtn.click(function(){
    var standardRooms = $("#custStandardRooms");
    var deluxRooms = $("#custDeluxRooms");
    var royalRooms = $("#custRoyalRooms");
    var adults = $("#custAdult");
    var childs = $("#custChild");
    var checkIn = $("#custCheckIn");
    var checkOut = $("#custCheckOut");
    var data = validate(standardRooms,deluxRooms,royalRooms,adults,childs,checkIn,checkOut);



    if(data) {
        var url = urlBuilder('roomAllot');
        $.ajax({
            type: 'POST',
            data: data,
            url: url,
            success: function(data){
                if(data.errorStack){
                    alert(data.errorStack);
                    return;
                }
                var name = $("#custBookingFormName");
                var address = $("#custBookingFormAddress");
                var mobile = $("#custBookingFormContact");
                var payload = payloadMakerForBooking(data,name,address,checkIn,checkOut,mobile);
                if(!payload){
                    alert('Info not complete');
                    return;
                }

                bookingConfirm(payload);



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
        return
    }
    var roomAllotted = (data.roomAllotted).toString();
    var customerId = data.customerId;
    var checkIn =checkInElement.val();
    var checkOut = checkOutElement.val();
    var price = data.totalCost;


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

    standardRooms = checkInvalidElement(standardRooms,0);
    deluxRooms = checkInvalidElement(deluxRooms,0);
    royalRooms = checkInvalidElement(royalRooms,0);
    adults = checkInvalidElement(adults,1);
    childs = checkInvalidElement(childs,0);

    var dateFlag = checkInvalidDateElement(checkIn,checkOut);
    console.log(adults,childs,dateFlag);
    if(standardRooms && deluxRooms && royalRooms && adults && childs && dateFlag){
        var totalRooms = Number(standardRooms) + Number(deluxRooms) + Number(royalRooms);
        if(totalRooms > 0){
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
            console.log("wrong");
            return false;
        }


    }else{
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