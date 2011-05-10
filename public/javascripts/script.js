function notifyTab($el) {
  $el.append("<p>Using TAB will tab inwards, using SHIFT+TAB will tab outwards. To tab out of the textarea, press CTRL+SHIFT+TAB.</p>");
}

jQuery(document).ready(function () {
  $("textarea").tabby();
  notifyTab($("div.text label"));
  
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
          $('#lessresponse').fadeOut(200, function() {
          	$(this).replaceWith($mydata).fadeIn(1000, notifyTab($('#lessresponse label')));
          });
         
        }
        else { 
          $('#output').append($mydata).hide().fadeIn(200, notifyTab($('#lessresponse label'))); 
        }
        
      }
    });
    
    
  });
  
  
  
  $('#output').height($('#input').height());
  
});