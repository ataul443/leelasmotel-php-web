var bookroombtn = $("#bookRoomBtn");
var bookRoom = $("#bookRoom")
var bookDet = $("#bookDet");

bookroombtn.click(function(){
    var rooms = $("#selectRoomNo");
    var standardRooms = $("#selectStdRoom");
    var deluxRooms = $("#selectDeluxRoom");
    var royalRooms = $("#selectSuperRoom");
    var adults = $("#selectGuestAdult");
    var childs = $("#selectGuestChild");


    var checkIn = $("#indate");
    var checkOut = $("#outdate");
    var price = $("#totalPrice");
    var data = validate(rooms,standardRooms,deluxRooms,royalRooms,adults,childs,checkIn,checkOut);

    var name = $("#bookername");
    var address = $("#bookerAdd");
    var mobile = $("#bookerno");

    if(data) {
        var url = window.location.href;
        $.ajax({
            type: 'POST',
            data: data,
            url: url,
            success: function(data){
                if(data.errorStack){
                    alert(data.errorStack);
                    return;
                }
                var payload = payloadMakerForBooking(data,name,address,price,checkIn,checkOut,mobile);
                if(!payload){
                    return;
                }
                var name = personalInfoElementValidator(name);
                var mobile = personalInfoElementValidator(mobile);
                var address = personalInfoElementValidator(address);

                if(!(name && mobile && address)){
                    console.log('wrong value 2');
                    return
                }
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


function payloadMakerForBooking(data,nameElement,addressElement,priceElement,checkInElement,checkOutElement,mobileElement){
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
    var customerId = data.customerData.customerId;
    var checkIn =checkInElement.val();
    var checkOut = checkOutElement.val();
    var price = priceElement.text();

    if(Object.keys(data).length > 2){
        console.log('Running');
        nameElement.val(data.customerData.name);
        mobileElement.val(data.customerData.mobile);
        addressElement.val(data.customerData.address);

    }
    var name = nameElement.val();
    var mobile = mobileElement.val();
    var address = addressElement.val();

    name = personalInfoElementValidator(nameElement);
    mobile = personalInfoElementValidator(mobileElement);
    address = personalInfoElementValidator(addressElement);

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


function validate(rooms,standardRooms,deluxRooms,royalRooms,adults,childs,checkIn,checkOut){
    var flag = true;
    rooms = checkInvalidElement(rooms,1);
    standardRooms = checkInvalidElement(standardRooms,0);
    deluxRooms = checkInvalidElement(deluxRooms,0);
    royalRooms = checkInvalidElement(royalRooms,0);
    adults = checkInvalidElement(adults,1);
    childs = checkInvalidElement(childs,0);

    var dateFlag = checkInvalidDateElement(checkIn,checkOut);
    console.log(adults,childs,dateFlag);
    if(rooms && standardRooms && deluxRooms && royalRooms && adults && childs && dateFlag){
        var totalRooms = Number(standardRooms) + Number(deluxRooms) + Number(royalRooms);
        if(Number(rooms) == totalRooms){
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