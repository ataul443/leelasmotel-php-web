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
    /*
   data1 = {
       customerId: 'LMC10001',
       checkIn: '2018-03-22',
       checkOut: '2018-03-23',
       name: 'Shekh Ataul',
       address: '64 Nanakpuri, LPU, Phagwara',
       mobile: '8299729791',
       adult: '3',
       child: '0',
       price: '1380',
       roomAllot: 'L4,L5'
   }
   */

    if(data) {
        var url = window.location.href;
        $.post(url,data,function(data){
            var payload = payloadMakerForBooking(data,name,address,price,checkIn,checkOut,mobile);
            if(!payload){
                return;
            }
            window.localStorage.setItem('bookingPayload',JSON.stringify(payload));
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
        })

    }
})

var bookDetBtn = $("#bookdetbtn");
bookDetBtn.click(function(){
    var payload = JSON.parse(window.localStorage.getItem('bookingPayload'));
    if(!payload){
        alert('Info not complete');
        return;
    }

    bookingConfirm(payload);
    bookDet.css(
        'transform', 'rotateY(90deg)'
    );
    payCon.css(
        'transform' , 'rotateY(0deg)'
    );
    $("#cssmenu ul li:nth-of-type(3)").removeClass("doing").addClass("done");
    $("#cssmenu ul li:nth-of-type(2)").removeClass("nextStep").addClass("doing");
    $('html, body').animate({
        scrollTop: $("#cssmenuCont").offset().top
    }, 500);
});


function payloadMakerForBooking(data,nameElement,addressElement,priceElement,checkInElement,checkOutElement,mobileElement){
    var adult = data.adult;
    var child = data.child;
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

    name = checkInvalidState(nameElement);
    mobile = checkInvalidState(mobileElement);
    address = checkInvalidState(addressElement);

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

/**
function checkInvalidState(element){
    var elementVal = element.val();
    if(elementVal != '' || elementVal != undefined){

        return elementVal;
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
    var today = Date();

    if(checkInDate < today || checkInDate >= checkOutDate || dateDiff(checkInDate,checkOutDate) > 45 ){
        invalidIndicator(checkInElement);
        return false;
    }else{
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

 **/