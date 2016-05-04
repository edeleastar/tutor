
$(document).ready(function()
{
  $("img").addClass ("ui image");
  $('.ui.embed').embed();

  var images = $(".lab img");
  jQuery.each(images, function(i)  {
    if((images[i].alt).length > 0)
    {
      var div_img = $(document.createElement("div")).addClass("ui segment");
      $(images[i]).wrap(div_img);
      var div_label = $(document.createElement("div")).addClass("ui ribbon teal top attached label");
      div_label.append(images[i].alt);
      $(div_label).insertBefore(images[i]);
    }
  });


})
