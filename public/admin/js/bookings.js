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