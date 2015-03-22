// global namespace
var olMapControls = {  
  map: {
    projectionElement: "latlon", 
    positionformat: "Lat/Lon: {y}°, {x}°", 
    positiondigits: 4, 
    center: [7.1942,51.2762],
    zoom: 13,
    div: "map",
    olmap: {}
  }, 
  setCenter: function(lon,lat,zoom){
    this.map.olmap.getView().setCenter( ol.proj.transform([lon,lat], 'EPSG:4326', 'EPSG:3857'));
    this.setZoom(zoom); 
  },
  setZoom: function(zoom){ 
    this.map.olmap.getView().setZoom(zoom); 
  },
  Zoom: function(value){
     this.setZoom(this.map.olmap.getView().getZoom() + value); 
  },
  ZoomIn: function(){ 
    this.Zoom(+1);
  },
  ZoomOut: function(){
    this.Zoom(-1); 
  },
  init: function() {  
    this.Layers.Prepare();  
    this.map.olmap = new ol.Map({
      target: document.getElementById(this.map.div),
      controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.MousePosition({
            coordinateFormat: function(coord) {
              return ol.coordinate.format(
                coord,                    // the coordinates Object
                olMapControls.map.positionformat,    // Format of String
                olMapControls.map.positiondigits    // round Coordinates to 4 digits
              );
            },
            projection: 'EPSG:4326',      // use this Projection for Display 
            undefinedHTML: '&nbsp;',
            target: olMapControls.map.projectionElement // id of html Element to recieve the coordinates
        })
      ]),
      layers: [],
      view: new ol.View({
        center: ol.proj.transform(this.map.center, 'EPSG:4326', 'EPSG:3857'),
        zoom: this.map.zoom
      }),
      loadTilesWhileInteracting: true 
    });
    $.each(olMapControls.Layers.Tiles, function( index, value ) {  
      olMapControls.map.olmap.addLayer(value.oTile);
    });
    // Raise event
    $("#" + this.map.div).trigger({
      type: "initialized",
      message: "Map sucessfully initialized",
      time: new Date()
    }); 

  },
  Layers: {
    /*
      you will need to get your own Key from 
      https://msdn.microsoft.com/en-us/library/ff428642.aspx
      https://www.bingmapsportal.com
    */
    Bing: {
      Key: "AskuFMXzSnezf6lrcXux-WErjYT0NVSlwSRbe9oNTn7jsXzMVwt0hROxDw09zVLc", 
      Styles: ['Road','Aerial','AerialWithLabels']
    },
    Tiles: [],
    addTile: function(tile){
      this.Tiles.push(tile);
      olMapControls.map.olmap.addLayer(tile.oTile);
    },
    Prepare: function(){   
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "OpenStreetMap: Standard",
          preload: Infinity,
          visible: false,
          source: new ol.source.OSM() 
        })
      }); 
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "OpenStreetMap: OpenCycleMap", 
          visible: false,    // Default
          preload: Infinity,
          source: new ol.source.OSM({
            attributions: [
              new ol.Attribution({
                html: 'All maps &copy; ' +
                '<a href="http://www.opencyclemap.org/">OpenCycleMap</a>'
              }),
              ol.source.OSM.ATTRIBUTION
            ],
            url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
          })
        })
      }); 
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "OpenStreetMap: OpenCycleMap Transport", 
          visible: false,
          preload: Infinity,
          source: new ol.source.OSM({
            attributions: [
              new ol.Attribution({
                html: 'All maps &copy; ' +
                '<a href="http://www.opencyclemap.org/">OpenCycleMap</a>'
              }),
              ol.source.OSM.ATTRIBUTION
            ],
            url: 'http://{a-c}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png'
          }) 
        })
       });
   

      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "OpenStreetMap: MapQuest osm",
          visible: true,
          preload: Infinity,
          source: new ol.source.MapQuest({
            layer: 'osm',
            maxZoom: 19
          }) 
        })
      });

      // only for certain Zoom Levels
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "OpenStreetMap: MapQuest sat",
          visible: false,
          preload: Infinity,
          source: new ol.source.MapQuest({
            layer: 'sat',
            maxZoom: 11
          })
        })
       });
   

      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "OpenStreetMap: Stamen-Watercolor",
          visible: false,
          preload: Infinity,
          source: new ol.source.Stamen({
            layer: 'watercolor',
            maxZoom: 18
          }) 
        }) 
      }); 
      if(this.Bing.Key.length>0){
        for(i = 0; i< this.Bing.Styles.length; i++){ 
          this.Tiles.push({
            isOverlay: false,
            oTile: new ol.layer.Tile({
              title: "BingMaps: " + this.Bing.Styles[i],
              visible: false,
              preload: Infinity, 
              maxZoom: 19,
              source: new ol.source.BingMaps({
                key: this.Bing.Key,
                imagerySet: this.Bing.Styles[i],
                maxZoom: 18
              })
            })
          });  
        }
      } 

     // is an overlay -- if this is checked, the active layer must(!) stay turned on
      this.Tiles.push({
        isOverlay: true,
        oTile: new ol.layer.Tile({
          title: "OpenstreetMap: OpenSeaMap",
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({
            url: 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
            crossOrigin: 'null'
          })
        })
      }); 

    }
  }
};
