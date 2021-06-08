$(document).ready(function(){
  $(window).scroll(function(){
  	var scroll = $(window).scrollTop();
	  if (scroll > 300) {
	    $(".navbar").css("background" , "#0F1C70");
	  }

	  else{
		  $(".navbar").css("background" , "transparent");  	
	  }
  })
})