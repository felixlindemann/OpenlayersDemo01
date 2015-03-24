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
      if(value.isOverlay){}else{
        olMapControls.map.olmap.addLayer(value.oTile);
      }
    });
    $.each(olMapControls.Layers.Tiles, function( index, value ) {  
      if(value.isOverlay){ 
        olMapControls.map.olmap.addLayer(value.oTile);
      }
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
          title: "OpenStreetMap: OpenCycleMap Landscape", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-c}.tile.opencyclemap.org/landscape/{z}/{x}/{y}.png'
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
          title: "OpenStreetMap: Mapnik", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }) 
        })
       });
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "OpenStreetMap: Mapnik (Black/White)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-c}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
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
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "OpenStreetMap: Stamen-Terrain (America only)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.OSM({ 
            url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
          }) 
        })
       });

      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "OpenStreetMap: Stamen-Toner", 
          visible: false,
          preload: Infinity,
          source: new ol.source.OSM({ 
            url: 'http://tile.stamen.com/toner/{z}/{x}/{y}.jpg'
          }) 
        })
       });

      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "Carto DB - Positron", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-d}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            attributions: [new ol.Attribution({ html: ['&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'] })]
          })
        })
       });
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "Carto DB - Positron (no labels)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-d}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
            attributions: [new ol.Attribution({ html: ['&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'] })]
          })
        })
       });

      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "Carto DB - DarkMatter", 
          visible: false,
          preload: Infinity,
           source: new ol.source.XYZ({ 
            url: 'http://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            attributions: [new ol.Attribution({ html: ['&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'] })]
          })
        })
       }); 
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "Carto DB - DarkMatter (no labels)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-d}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
            attributions: [new ol.Attribution({ html: ['&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'] })]
          })
        })
       });
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "ESRI",
          visible: false,
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
      });
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "4U Maps EU", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://4umaps.eu/{z}/{x}/{y}.png'
          }) 
        })
       });
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "MTB map Europe (http://mtbmap.cz)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png'
          }) 
        })
       });
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "Reit- und Wanderkarte (http://www.wanderreitkarte.de/)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://topo2.wanderreitkarte.de/topo/{z}/{x}/{y}.png'
          }) 
        }) 
       }); 
 


      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "Mapbox-Terrain", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'https://{a-c}.tiles.mapbox.com/v3/dennisl.map-dfbkqsr2/{z}/{x}/{y}.png'
          }) 
        })
       });

      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "Mapbox-Outdoors", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'https://{a-c}.tiles.mapbox.com/v3/aj.um7z9lus/{z}/{x}/{y}.png'
          }) 
        })
       });

      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "WMF-Labs - Hike-Bike (http://hikebikemap.org/)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-c}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png'
          }) 
        })
       });
      this.Tiles.push({
        isOverlay: true,
        oTile: new ol.layer.Tile({
          title: "WMF-Labs - Hill-Shadings (http://hikebikemap.org/)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-c}.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png'
          }) 
        })
       }); 

      this.Tiles.push({
        isOverlay: true,
        oTile: new ol.layer.Tile({
          title: "WMF-Labs - Hill-Shadings 2 (http://hikebikemap.org/)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-c}.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png'
          }) 
        })
       }); 

      this.Tiles.push({
        isOverlay: true,
        oTile: new ol.layer.Tile({
          title: "WMF-Labs - Hill-Shadings 3 (http://hikebikemap.org/)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-c}.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png'
          }) 
        })
       }); 
      this.Tiles.push({
        isOverlay: true,
        oTile: new ol.layer.Tile({
          title: "WMF-Labs - Hill-Shadings 4 (http://hikebikemap.org/)", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://{a-c}.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png'
          }) 
        })
       }); 

      this.Tiles.push({
        isOverlay: true,
        oTile: new ol.layer.Tile({
          title: "Waymarked Trails: Cycling", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png'
          }) 
        })
       });
      this.Tiles.push({
        isOverlay: true,
        oTile: new ol.layer.Tile({
          title: "Waymarked Trails: MTB", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://tile.waymarkedtrails.org/mtb/{z}/{x}/{y}.png'
          }) 
        })
       });
      this.Tiles.push({
        isOverlay: true,
        oTile: new ol.layer.Tile({
          title: "Waymarked Trails: Inline Skating", 
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({ 
            url: 'http://tile.waymarkedtrails.org/skating/{z}/{x}/{y}.png'
          }) 
        })
       }); 

      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "OpenTopoMap",
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({
            url: 'http://opentopomap.org/{z}/{x}/{y}.png'
          })
        }) 
      }); 
      
      this.Tiles.push({
        isOverlay: false,
        oTile: new ol.layer.Tile({
          title: "Natural Earth",
          visible: false,
          preload: Infinity,
          source: new ol.source.XYZ({
            url: 'http://{a-d}.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/{z}/{x}/{y}.png'
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
