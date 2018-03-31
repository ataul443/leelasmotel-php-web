$("#price-btn").click(function(){
    /*

    code for extracting data and validation

    put category value in var category;
    put price value in var price;

     */

    var data = { price: 300,category: 'standard'};
    var url = urlBuilder('admin/webedit/setprice');
    $.ajax({
        url:url,
        type: "POST",
        data: data,
        success: function (data) {
            console.log(data);
        }
    })
})