
  $('#btnAddDemo').click(function (evt) {
    evt.preventDefault();
    addCustomLayer();
  }); 


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
  olMapControls.Layers.addTile(tile);

  if(tile.isOverlay){
    AddButtonToMapStyle(olMapControls.Layers.Tiles.length-1, tile);
  }else{
    AddButtonToOverlay(olMapControls.Layers.Tiles.length-1, tile);
  }
  olMapControls.setCenter(-121.1, 47.5, 7);
};

