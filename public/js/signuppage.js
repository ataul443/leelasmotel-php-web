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