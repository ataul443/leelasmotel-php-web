var size = 0;

$(document).ready(function(){
    getBookingList(1);
    $('.pagination').pagination({
        items: size,
    itemsOnPage: 10,
    cssStyle: 'light-theme',
        currentPage : 1,
        onPageClick : function(pageNumber) {
        getBookingList(Number(pageNumber));
    }
});

});

$("#search-btn").click(function (){
    searchByName();
}

)


function getBookingList(offset){
    var url = urlBuilder('admin/bookings');
    $.ajax({
        url: url,
        type: 'POST',
        data: {offset: (offset-1)*10},
        success: function(data){
            console.log(data.bookingsList);
            dataMapper(data.bookingsList);
            size = data.size;
        },
        error: function (data) {
            alert('Error: Bookings Not found!');
            return;
        }
    })
}

function dataMapper(data){
    var tbody = $("#tBody")
    tbody.html("");
    tbody.append(data);
}

function searchByName(offset){
    var searchTextFull = $("#search").val();
    var searchTerm = searchTextFull;
    searchTextFull = searchTextFull.split(" ");
    var searchText = searchTextFull.join("");
    var pattern = /^[a-z0-9]+$/i;
    if(searchText == undefined || searchText == null || !pattern.test(searchText)){
        $("#search").css({border: "1px solid red"});
        return;
    }else{
        $("#search").css({border: ""});
        var url = urlBuilder('admin/bookings/search');
        $.ajax({
            url: url,
            type: 'POST',
            data: {searchTerm: searchTerm},
            success: function (data) {
                dataMapper(data.bookingsList);
                var size = data.size;
                $('.pagination').pagination({
                    items: size,
                    itemsOnPage: size,
                    cssStyle: 'light-theme',
                    currentPage : 1,
                    onPageClick : function(pageNumber) {
                        searchByName(Number(pageNumber));
                    }
            })
            },
            error: function (data) {
                $("#tBody").html("");
                $("#tBody").append("<h4>No Data Found!</h4>");
            }
    })
    }
}

function actionManager() {
    var action = $("#action-selector option:selected").val();

    if (action == "What to do?") {
        return null;
    } else if (action == "Check Out") {
        action = "checkout";
    } else if (action == "Cancel") {
        action = "canceled";
    }
    return action;
}

function selectedId() {
    var selectedRows = $("tr input[name='actionBox']:checked");
        mobiles = {};

    for (var item of selectedRows) {
        var temp = item.id.split(" --");
        var id = temp[1];
        var mobile = $('#mobile-'+id).text();
        var customerName = $('#name-'+id).text();
        mobiles[customerName] = [mobile];
        console.log(mobiles);
    }
    return  mobiles;
}


$("#action-btn").click(function() {
    var mobilesArray = selectedId();
    var names = Object.keys(mobiles);

    checkOut(mobilesArray,names);
    return;
});

function checkOut(mobilesArray,names){
    $("#action-btn").text("Submitting");
    for(var name of names){
        // noinspection JSAnnotator
        var mobile = mobilesArray[`${name}`][0];
        var msgCheckout = `Dear ${name}\n\nThank you for your stay.\n\nLeelas Motel`;
        var action = actionManager();
        if (action != "checkout") {
            //var msg = Canceled;
            return;
        } else {
            msg = msgCheckout;
        }
        msg = encodeURI(msg);
        makeCorsRequest(mobile, msg);
        $("#action-btn").text("Submit");
    }
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
    return text.match("<title>(.*)?</title>")[1];
}

// Make the actual CORS request.
function makeCorsRequest(mobile, msg) {
    // This is a sample server that supports CORS.
    // noinspection JSAnnotator
    var url = `http://203.129.225.68/API/WebSMS/Http/v1.0a/index.php?username=recentopt&password=123456&sender=LEELASMOTEL&to=${mobile}&message=${msg}&reqid=1&format={json|text}&route_id=334`;

    var xhr = createCORSRequest("GET", url);
    if (!xhr) {
        alert("CORS not supported");
        return;
    }

    // Response handlers.
    xhr.onload = function() {
        var text = xhr.responseText;
        var title = getTitle(text);
    };

    xhr.onerror = function() {};

    xhr.send();
}