// Javascript kodi per te bere passwordin te dukshem

// per passwordin
function viewPassword()
{
  var passwordInput = document.getElementById('passw');
  var passEye = document.getElementById('passeye');
 
  if (passwordInput.type == 'password'){
    passwordInput.type='text';
    passEye.className='fas fa-eye-slash';
    
  }
  else{
    passwordInput.type='password';
    passEye.className='far fa-eye';
  }
}

// per te perseritur passwordin
function repeatPass()
{
  var repeatedPass = document.getElementById('repeat-passw');
  var repeatEye = document.getElementById('repeat-eye');
 
  if (repeatedPass.type == 'password'){
    repeatedPass.type='text';
    repeatEye.className='fas fa-eye-slash';
    
  }
  else{
    repeatedPass.type='password';
    repeatEye.className='far fa-eye';
  }
}