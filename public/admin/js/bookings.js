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

