jQuery(document).ready(function () {
  $("textarea").tabby();
  $("form div.text label").append("<p>Using TAB will shift inwards, using SHIFT+TAB will tab outwards. To tab out of the textarea, press CTRL+SHIFT+TAB.</p>");
  
  $('input[type="submit"]').click(function(e){
    e.preventDefault();
    var lessinput = $('#lessinput').val();
    var minify = $('#minify').val();
    
    
    $.ajax({
      type: "POST",
      url: "/",
      data: { 'lessinput' : lessinput, 'minify' : minify},
      
      success: function(res) {
        
      }
      
    });
  });
});