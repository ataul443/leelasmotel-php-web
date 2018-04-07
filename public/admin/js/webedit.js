$("#price-btn").click(function(){
    /*

    code for extracting data and validation

    put category value in var category;
    put price value in var price;


     */
    var priceBtn = $('#price-btn');
    var priceCategory = '#status-selector';
    var price = $('#price-input');
    price = checkInvalidState(price);
    var category = selectValidator(priceCategory,'Category');
    if(price && category){
        var data = { price: price,category: category};
        var url = urlBuilder('admin/webedit/setprice');
        priceBtn.text('Setting Price...');
        $.ajax({
            url:url,
            type: "POST",
            data: data,
            success: function (data) {
                alert('Price successfully updated.');
                priceBtn.text('Set Price');
                console.log(data);
            }
        });
    }
})

var uploadFile  = $("input[type=file]");

// if(uploadFile[0].val()!=""){
//     $("#upload-btn").hide(200);
// }

$(uploadFile[0]).change(function(e) {
    var val = $(this).val();
   if (val != "") {
    $("#upload-btn").show();
   }
   else{
    $("#upload-btn").hide();       
   }
});


function selectValidator(element,min){
    var optionSelectorString = `${element} option:selected`;
    var selectorString = `${element}`;
    var value = $(optionSelectorString).val();
    if(value == undefined || value == null || value == min){
        $(selectorString).addClass('incorrect');
        return false;
    }else{
        $(selectorString).removeClass('incorrect');
        return value;
    }
}