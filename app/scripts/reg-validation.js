
var t1 = 'Lösenordet måste innehålla minst tre tecken';
var t2 = 'Lösenorden stämmer inte överrens';
var t3 = 'Du måste vara minst 11 år för att spela Booze Tycoon';
var t4 = 'Ogiltigt förnamn';
var t5 = 'Ogiltigt efternnamn';
var t6 = 'Ogiltig stad';
var t7 = 'Epostadressen används redan';
var t8 = 'Ogiltig epost-adress';
var t9 = 'Nieprawidłowy nick';
var t10 = 'Podany nick istnieje już w bazie';


function setLang(lang) {
  if(lang == 'en')
  {
    t1 = 'The password most consist of atleast three characters';
    t2 = 'The passwords do not match';
    t3 = 'You have to be atleast 11 years old to play Booze Tycoon';
    t4 = 'Invalid firstname';
    t5 = 'Invalid surname';
    t6 = 'Invalid city';
    t7 = 'This email adress is already in use';
    t8 = 'Invalid email';
    t9 = 'Invalid nick';
    t10 = 'This nick is already in use';
  }
  if(lang == 'pl')
  {
    t1 = 'Hasło musis się składać z minimum trzch znaków';
    t2 = 'Hasła się nie zgadzają';
    t3 = 'Musisz mieć przynajmniej 11 lat by grać w Bimber Tycoon';
    t4 = 'Nieprawidłowe Imie';
    t5 = 'Nieprawidłowe Nazwisko';
    t6 = 'Nieprawidłowe Miasto';
    t7 = 'Podany e-mail istnieje już w bazie';
    t8 = 'Nieprawidłowy e-mail';
    t9 = 'Nieprawidłowy nick';
    t10 = 'Podany nick istnieje już w bazie';
  }
}

$.formValidator = function(){
  $('#regForm').find('input[type="text"],input[type="password"]').attr('valid','false').blur(function(){
    validateForm($(this));

  }).each(function(){
    if($(this).attr('name') == 'reg_verif')
    {
      $(this).attr('valid','true');
      setStatus($(this));
    }
  });
  setSubmit();
}
var mailMsg = '';
function validateForm(obj){
  var name = obj.attr('name');
  if(name == 'mail')
  {
    checkMail(obj);
  }
  else if(name == 'nick')
  {
    checkNick(obj);
  }
  else if(name == 'password'){
    if(checkPassword(1))
    {
      setStatus(obj);
    }else{
      setStatus(obj, true, t1);
    }
  }else if(name == 'password2'){
    if(checkPassword(2))
    {
      setStatus(obj);
    }else{
      setStatus(obj, true, t2);
    }
  }
  setSubmit();
}

function checkMail(obj){
  var valid = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(obj.attr('value'));
  if(valid)
  {
    $.post('?p=mail_check&requestType=ajax',$('input[name="mail"]').fieldSerialize(),function(response){
      $('#loading').fadeOut();
      if($('#ajaxHolder').html(response).find('.mailSuccess').html() != '1')
      {
        var mailMsg = t7;
        setStatus($('input[name="mail"]'), true, mailMsg);
        setSubmit();
      }else{
        setStatus($('input[name="mail"]'));
        setSubmit();
      }
    });
  }else{
    mailMsg = t8;
    setStatus(obj, true, mailMsg);
    setSubmit();
  }
}

function checkNick(obj){
  var isValid = checkName(obj);

  if(false === isValid){
    setStatus(obj, true, t9);
    setSubmit();
    return;
  }
  else{
    $.post('?p=nick_check&requestType=ajax',$('input[name="nick"]').fieldSerialize(),function(response){
      $('#loading').fadeOut();
      if($('#ajaxHolder').html(response).find('.nickSuccess').html() == '0')
      {
        setStatus($('input[name="nick"]'), true, t10);
        setSubmit();
      }else{
        setStatus($('input[name="nick"]'));
        setSubmit();
      }
    });
    return;
  }
}

function checkName(obj){
  return /^[---a-zA-Z0-9åäöáéÅÄÖÁÉ_\s]{2,22}$/.test(obj.attr('value'));
}

function checkBorn(ageLimit,day,month,year){
  if(isNaN(day) || isNaN(month) || isNaN(year))
  {
    return false;
  }
  var limitDays = ageLimit*365;
  var limit = new Date();
  limit.setDate(limit.getDate()-limitDays);
  var born = new Date(year,month-1,day);
  if(born < limit)
  {
    return true;
  }else{
    return false;
  }
}

function setSubmit(){
  var error = false;
  $('#regForm').find('input[type="text"],input[type="password"],select,:radio').each(function(i){
    if($(this).attr('valid') == 'false')
    {
      error = true;
    }
    if(i == (parseInt($('#regForm').find('input[type="text"],input[type="password"]').length) - 1))
    {
      if(error == true)
      {
        $('#submit').attr("disabled",true);
      }else{
        $('#submit').removeAttr("disabled");
      }
    }
    return true;
  });
}

function setStatus(obj,err,msg,specName){
  var name = '';
  if(!msg)
  {
    var msg = '<img src="img/design/v.png" />';
  }
  if(err)
  {
    msg = '<img src="img/design/x.png" /> ' + msg;
    obj.attr('valid','false');
  }else{
    obj.attr('valid','true');
  }
  if(specName)
  {
    name = specName;
  }else{
    name = obj.attr('name');
  }
  $('.' + name + 'Status').html(msg);
}

function checkPassword(i){
  if(i == 2)
  {
    if($('input[name="password"]').attr('value') == $('input[name="password2"]').attr('value') && $('input[name="password"]').attr('value') != '')
    {
      return true;
    }else{
      return false;
    }
  }else{
    var val = $('input[name="password"]').attr('value');
    if(val.length > 2)
    {
      return true;
    }else{
      return false;
    }
  }
}
