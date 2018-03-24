var btnn=  document.getElementById('btn');        
            var box = document.getElementById('box');
            var green = document.getElementById('green');
            var red = document.getElementById('red');
                function myfunction()
                    {                   
                        if(box.style.left==='0px'){
                            mySignUp();                       
                        }
                        else{
                            myLogIn();
                        }
                    } 
    
                function mySignUp()
                {
                    box.style.left='60%';
                    green.style.width='0px';
                    btnn.innerHTML='Log In';
                    document.getElementById('head').innerHTML = 'One Of Us?';
                    document.getElementById('para').innerHTML = 'If you already have an account,just log in. We\'ve missed you!';
                    red.style.width='60%';
                }
    
                function myLogIn()
                {
                    btnn.innerHTML = 'Sign Up';
                    document.getElementById('head').innerHTML = 'New Here?';
                    document.getElementById('para').innerHTML = 'Sign up and discover a great amount  of new opportunities.';
                    box.style.left='0px';
                    green.style.width='60%';
                    red.style.width='0px';
                }

$("#login-btn").click(function(){
    var errorIndicator =$("#errorIndicator");
    var emailElement = $("#login-email");
    var passwordElement = $("#login-password");
    var payload = validatorEmailPass(errorIndicator,emailElement,passwordElement);
    if(!payload){
        return;
    }
    var url = urlBuilder('auth/login');
    $.ajax({
        type: 'POST',
        url: url,
        data: payload,
        success: function(data,textStatus,request){
            errorDisplay(errorIndicator,'block','none','');
            var urlRedirect = urlBuilder('')
            window.location.href = urlRedirect;
        },
        error: function(data,request){
            var errorStack = data.responseJSON.messages;
            var error = errorStack[0];
            errorDisplay(errorIndicator,'none','block',error);

        }

    })
})

$("#signup-btn").click(function(){
    var errorIndicator =$("#errorIndicatorSignup");
    var emailElement = $("#InputEmail");
    var passwordElement = $("#InputPassword");
    var usernameElement = $("#InputName");
    var payload = validatorUsernameEmailPass(errorIndicator,emailElement,passwordElement,usernameElement);
    if(!payload){
        return;
    }
    var url = urlBuilder('auth/signup');
    $.ajax({
        type: 'POST',
        url: url,
        data: payload,
        success: function(data,textStatus,request){
            errorDisplay(errorIndicator,'block','none','');
            var urlRedirect = urlBuilder('')
            //window.location.href = urlRedirect;
        },
        error: function(data,request){
            var errorStack = data.responseJSON.messages;
            var error = errorStack[0];
            errorDisplay(errorIndicator,'none','block',error);

        }

    })
})


function validatorUsernameEmailPass(errorElement,emailElement,passwordElement,usernameElement){
         var username = checkInvalidState(usernameElement);
         var usernamePattern = /^[a-zA-Z0-9_]*$/;
         if(!usernamePattern.test(username)){
             var error = 'Invalid Username';
             errorDisplay(errorElement,'none','block',error);
             return false;
         }else{
             console.log('Pass TestUsername');
             errorDisplay(errorElement,'none','block','');
         }
         var payload = validatorEmailPass(errorElement,emailElement,passwordElement);
         if(payload){
             payload.username = username;
             console.log('SignUp',payload);
             return payload;
         }else{
             return false;
         }
}



function validatorEmailPass(errorElement,emailElement,passwordElement){
    var email =emailElement;
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

