$("#auth-btn").click(function(){
  var errorIndicator =$("#errorIndicator");
  var emailElement = $("#auth-email");
  var passwordElement = $("#auth-password");
  var payload = validatorEmailPass(errorIndicator,emailElement,passwordElement);
  if(!payload){
      return;
  }
  var url = urlBuilder('admin/auth');
  $.ajax({
      type: 'POST',
      url: url,
      data: payload,
      success: function(data,textStatus,request){
          errorDisplay(errorIndicator,'block','none','');
          var urlRedirect = urlBuilder('admin/dashboard')
          window.location.href = urlRedirect;
      },
      error: function(data,request){
          var errorStack = data.responseJSON.messages;
          var error = errorStack[0];
          errorDisplay(errorIndicator,'none','block',error);

      }

  })
})

function validatorEmailPass(errorElement,emailElement,passwordElement){
  var email = emailElement;
  var password = passwordElement;

  email = checkInvalidState(email);
  password = checkInvalidState(password);

  var emailRegexPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if(!emailRegexPattern.test(email)){
      var error = 'Entered an Invalid Email';
      errorDisplay(errorElement,'none','block',error);
      return false;
  }else if(password == ''){
      var error = 'Entered an Invalid Password';
      errorDisplay(errorElement,'none','block',error);
      return false;
  }
  else{
      errorDisplay(errorElement,'block','none','');
  }
  return {email:email,password: password};
}