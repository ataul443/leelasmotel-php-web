$("#custname").on('keyup', function(e) {
    var val = $(this).val();
   if (val.match(/[^a-zA-Z ]/g)) {
       $(this).addClass("incorrect");
   }
   else{       
    $(this).removeClass("incorrect");
   }
});

$("#custphno").on('blur', function(e) {
    var val = $(this).val();
   if (val.length != 10) {
       $(this).addClass("incorrect");
   }
   else{       
    $(this).removeClass("incorrect");
   }
});