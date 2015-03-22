
$( document ).ready(function() {
  olMapControls.map.center = [7.1942,51.2762]; // adjust Default Values here
  olMapControls.map.zoom = 12;                
  olMapControls.map.div = 'map';
  olMapControls.map.projectionElement = "latlon";

  // init Map 
  olMapControls.init(); 
});

$("#" + olMapControls.map.div).on('initialized', function(){    
    // add Custom Controls 
    addControls();

});


function addControls(){ 

  $('#btnZoomIn').click(function (evt) {
    evt.preventDefault();
    olMapControls.ZoomIn();
  });
  $('#btnZoomOut').click( function (evt) { 
    evt.preventDefault();
    olMapControls.ZoomOut();
  });  
  // Add Tile-Layers
  $.each(olMapControls.Layers.Tiles, function( index, value ) {  
    if(value.isOverlay == false){
      AddButtonToMapStyle("#mapstyles", index, value);
    }
  });
  // Add-Overlays
  $.each(olMapControls.Layers.Tiles, function( index, value ) {  
    if(value.isOverlay == true){
      AddButtonToOverlay("#overlays", index, value);
    }
  });

};

function AddButtonToMapStyle(parent,index, value){ 
  
  var isVisible = value.oTile.get('visible') == true;
  var title = value.oTile.get('title') ;   
   
  $(parent).append('<li><a href="#" data-index="' + index + '">' + title + ' </a></li>');
  $(parent + " li:last-child a").addClass('ol-inactive');
  if(isVisible){
    $(parent + " li:last-child a").removeClass('ol-inactive').addClass('ol-active');
  }
  $(parent + " li:last-child a").click(function (evt) {
    evt.preventDefault(); 
    var index =  $(this).attr("data-index");
    $.each(olMapControls.Layers.Tiles, function( index, value ) { 
      if(value.isOverlay == false){
          value.oTile.setVisible(false); 
      }
    });        
    $(parent + " li a").removeClass("ol-active").addClass("ol-inactive");
    $(this).removeClass("ol-inactive").addClass("ol-active"); 
    olMapControls.Layers.Tiles[index].oTile 
        .setVisible($(this).hasClass("ol-active")); 
  });  

}
 
function AddButtonToOverlay(parent,index, value){ 
  
  var isVisible = value.oTile.get('visible') == true;
  var title = value.oTile.get('title') ;  
  
  $(parent).append('<li><a href="#" data-index="' + index + '">' + title + ' </a></li>');
  $(parent + " li:last-child a").addClass('ol-inactive');
  if(isVisible){
    $(parent + " li:last-child a").removeClass('ol-inactive').addClass('ol-active');
  }
  $(parent + " li:last-child a").click(function (evt) {
    evt.preventDefault(); 
    var index =  $(this).attr("data-index"); 
    if($(this).hasClass("ol-active")){
      $(this).removeClass("ol-active").addClass("ol-inactive");
    }else{ 
      $(this).removeClass("ol-inactive").addClass("ol-active");
    } 
    olMapControls.Layers.Tiles[index].oTile 
        .setVisible($(this).hasClass("ol-active")); 
  });  

}
 

