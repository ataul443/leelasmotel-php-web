

function validate(nameElement,mobileElement,addressElement){
    var name = personalInfoElementValidator(nameElement);
    if (name.match(/^[a-zA-Z0-9_]*$/)) {
        $(nameElement).removeClass("incorrect");
    }
    else{
        $(nameElement).addClass("incorrect");
        return;
    }

    var mobile = personalInfoElementValidator(mobileElement);
    if (mobile.length != 10) {
        $(mobileElement).addClass("incorrect");
        return;
    }
    else{
        $(mobileElement).removeClass("incorrect");

    }
    var address = personalInfoElementValidator(addressElement);



    return {name: name, mobile: mobile,address: address};




}

$("#update-btn").click(function(){
    var name = $("#custname");
    var address = $("#custaddress");
    var mobile = $("#custphno");
    var data = validate(name,mobile,address);
    var url = urlBuilder('account/update');
    $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function (data) {
            var url = urlBuilder('account');
            window.location.href = url;
        },
        error: function (data) {
            console.log(data);
        }
    })
})