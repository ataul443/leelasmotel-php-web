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
            if(element.hasClass('incorrect')){
                element.removeClass('incorrect');
            }
            return elementVal;
        }else{
            invalidIndicator(element);
            return false;
        }
    }else{
        element.addClass('incorrect');
        return false;
    }
}

function checkInvalidDateElement(checkInElement,checkOutElement){
    var checkIn = checkInElement.val();
    var checkOut = checkOutElement.val();
    if( checkIn == "" || checkOut == "" || checkIn == "Arrival Date" || checkOut == "Arrival Date" ){
        return false;
    }
    var checkInDate = new Date(checkIn);
    var checkOutDate = new Date(checkOut);
    var today = new Date();

    if((checkInDate.getDate() < today.getDate() || checkInDate >= checkOutDate || dateDiff(checkInDate,checkOutDate) > 45 )){
        invalidIndicator(checkInElement);
        return false;
    }else{
        console.log(checkInDate,checkOutDate);
        if(checkInElement.hasClass('incorrect')){
            checkInElement.removeClass('incorrect');
        }
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
        //element.removeClass('incorrect');
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

function dateFormatter(dateObject){
                var dateString = dateObject.getDate() + '-' + dateObject.getMonth() + '-' + dateObject.getFullYear();
                return dateString;
}