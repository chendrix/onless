function notifyTab($el) {
  $el.append("<p>Using TAB will tab inwards, using SHIFT+TAB will tab outwards. To tab out of the textarea, press CTRL+SHIFT+TAB.</p>");
}

jQuery(document).ready(function () {
  $("textarea").tabby();
  notifyTab($("div.text label"), function() {
  	
	 	
  });
	$('#input .text label').css('display', 'block');
	$('#lessresponse label').css("display", "block").height($('#input .text label').height());
	
  
  $('input[type="submit"]').click(function(e){
    e.preventDefault();
    var lessinput = $('#lessinput').val();
    var minify = $('#minify').is(':checked');
    
    $.ajax({
      type: "POST",
      url: "/",
      data: { 'lessinput' : lessinput, 'minify' : minify},
      
      success: function(res) {
      
        var $mydata = $(res).find('#lessresponse');
        
        if($('#lessresponse').length != 0) {
          $('#lessresponse').fadeOut(100, function() {
          	$(this).replaceWith($mydata);
          	$('#input .text label').css('display', 'block');
	 	  			$('#lessresponse label').css("display", "block").height($('#input .text label').height());

          	$(this).fadeIn(1000);
          });
        }
        else { 
        	$self = $('#output');
          $('#output').hide(100, function() {
          	$(this).append($mydata);
          	$('#input .text label').css('display', 'block');
	 	  			$('#lessresponse label').css("display", "block").height($('#input .text label').height());
	 	  			$(this).fadeIn(200);
	 	  			
	 	  		})
        }
        
      }
    });
    
    
  });
  
  
  
  $('#output').height($('#input').height());
  
});