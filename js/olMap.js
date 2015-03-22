
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
  $('#btnAddDemo').click(function (evt) {
    evt.preventDefault();
    addCustomLayer();
  }); 
  $.each(olMapControls.Layers.Tiles, function( index, value ) {  
    if(value.isOverlay == false){
      AddButtonToMapStyle(index, value);
    }
  });
  $.each(olMapControls.Layers.Tiles, function( index, value ) {  
    if(value.isOverlay == true){
      AddButtonToOverlay(index, value);
    }
  });

};

function AddButtonToMapStyle(index, value){ 
  var parent = "#mapstyles"; // The Bootstrap-DropDown

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
 
function AddButtonToOverlay(index, value){ 
  var parent = "#overlays"; // The Bootstrap-DropDown

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
 

function addCustomLayer(){

  // http://erilem.net/ol3/master/examples/xyz-esri.js
  // add own tiles 
  var tile = {
    isOverlay: false,
    oTile: new ol.layer.Tile({
      title: "ESRI",
      source: new ol.source.XYZ({
        attributions: [
          new ol.Attribution({
            html: 'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/' +
                'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
          })
        ],
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
      })
    })
  };
  olMapControls.Layers.Tiles.push(tile);
  if(tile.isOverlay){
    AddButtonToMapStyle(olMapControls.Layers.Tiles.length, tile);
  }else{
    AddButtonToOverlay(olMapControls.Layers.Tiles.length, tile);
  }
  olMapControls.setCenter(-121.1, 47.5, 7);
};


