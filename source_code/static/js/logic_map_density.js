
var format_Number = function(num) { 
  return parseFloat((num).toFixed(3)).toLocaleString(); 
};

// inside tab
!(function (d3) {

  $("bcontent").empty();
  var content = d3.select("bcontent");
  // Map
  content.append("div")
         .attr("class", "map")
         .attr("id", "map_density");
         
  // Countries List
  var topCountries = content.append("div")
                            .attr("class","topCountriesOnly");                            
                                    
  var list_heading1 = topCountries.append("h3")
                                 .text("Top 10 Countries in Population Density");
  var top_lists1 = topCountries.append("div")
                              .attr("class","list-type5")
                              .append("ol");




// Population 2020 Map
/////////////////////////////////////////////////////////
let urlCity = "/api/population/cities";
let urlPop = "/api/population/countries";
// Load in geojson data for marking Countries
let geoDataURL = "static/data/countries.geojson";



  // Grab Countries geo data with d3 from countries geojson
  d3.json(geoDataURL).then(function(data) {

    // reading Api json to merge data with geojson
    d3.json(urlPop).then(function(dataPop){
      // Adding Population data into the geojson data
      let popCountriesData = dataPop[0]["data"];
      data.features.forEach(val => {
        for( let i=0; i<popCountriesData.length; i++){
          if(val.id == popCountriesData[i]["Country_Code"]){
            let { properties } = val
            let newProps = { "2020": popCountriesData[i]["2020"], 
                             "Density": popCountriesData[i]["Density"], 
                             "GrowthRate": popCountriesData[i]["GrowthRate"],
                             "rank": popCountriesData[i]["rank"]
                           }
            val.properties = { ...properties, ...newProps }            
          }  
        }
      })

      // creating a list of Top 10 Countries in population Growth Rate
      popCountriesData.sort(function(a, b) {
          return b.Density - a.Density;
      }); // Sort by density (descending)
      for(let i=0; i<10; i++){
        top_lists1.append("li")
                  .html("<span class='cname'>" + popCountriesData[i]["Country"] + " :</span> " + format_Number(popCountriesData[i]["Density"]) + " /km²");
      }
      
    // Define variables for our tile layers
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 6,
      minZoom: 2,
      id: "light-v10",
      accessToken: API_KEY
    });

    // Only one base layer can be shown at a time
    var baseMaps = {
      Light: light
    };

    // to clear container of map before initializing if already exists
    var container = L.DomUtil.get('map_density');
    if(container != null){
        container._leaflet_id = null;
    }

      // Creating map object
    var dMap = L.map("map_density", {
      center: [34.0522, 10.2437],
      zoom: 2,
      layers: [light]
    });



    function getColor(d) {
      return d > 5000 ? '#8c2d04' :
             d > 1000  ? '#cc4c02' :
             d > 100  ? '#ec7014' :
             d > 80  ? '#fe9929' :
             d > 40   ? '#fec44f' :
             d > 20  ? '#fee391' :
             d > 10   ? '#fff7bc' :
                        '#ffffe5';
    }
    function style(feature) {
      return {
          fillColor: getColor(feature.properties["Density"]),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
    }
    // control that shows state info on hover
    var info = L.control();
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };
    info.update = function (props) {
      this._div.innerHTML = '<h4>2019 Population Growth Rate</h4>' +  (props ?
              '<b> Country: ' + props.name + '<br>Density: ' + props.Density + ' /km²</b><br>Population: ' + formatNumber(props["2020"]) + 
              '<br>Growth rate: ' + props.GrowthRate + '%<br>Total Population Rank: ' + props.rank + '<br>'
              : 'Hover over a Country');
    };
    function highlightFeature(e) {
          var layer = e.target;
          layer.setStyle({
              weight: 5,
              color: '#616161',
              dashArray: '',
              fillOpacity: 0.7
          });
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
          }
          info.update(layer.feature.properties);
    }

    var geojsonDensity;

    function resetHighlight(e) {
          geojsonDensity.resetStyle(e.target);
          info.update();
    }
    function zoomToFeature(e) {
          map.fitBounds(e.target.getBounds());
    }
    function onEachFeature(feature, layer) {
          layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: zoomToFeature
          });
    }
    geojsonDensity = L.geoJson(data, {style: style, onEachFeature: onEachFeature}).addTo(dMap);
    info.addTo(dMap);

      var  show = ["< 10","10 +", "20 +", "40 +", "80 +","100 +","1000 +","5000 +"];
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (dMap) {
          var div = L.DomUtil.create('div', 'info legend'),
              popul = [0, 10, 20, 40, 80, 100, 1000, 5000],
              labels = [],
              from, to;
          for (var i = 0; i < popul.length; i++) {
              from = popul[i];

              to = popul[i + 1];
              labels.push(
                  '<i style="background:' + getColor(from + 1) + '"></i> ' +
                  show[i] ); 
          }
          div.innerHTML = labels.join('<br>');
          return div;
      };
      legend.addTo(dMap);  
      
  });

});

})(d3);