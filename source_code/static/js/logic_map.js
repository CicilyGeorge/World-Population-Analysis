// inside tab
!(function (d3) {

  $("acontent").empty();
  var content = d3.select("acontent");
  // Map
  content.append("div")
         .attr("class", "map")
         .attr("id", "map");
         
  // Countries List
  var topCountries = content.append("div")
                            .attr("class","topCountries");                            
                                    
  var list_heading1 = topCountries.append("h3")
                                 .text("Top 10 Countries in Population");
  var top_lists1 = topCountries.append("div")
                              .attr("class","list-type5")
                              .append("ol");

  // Cities List
  var topCities = content.append("div")
                         .attr("class","topCities");                            
                                      
  var list_heading2 = topCities.append("h3")
                                 .text("Top 10 Cities in Population");
  var top_lists2 = topCities.append("div")
                            .attr("class","list-type4")
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

      // creating a list of Top 10 Countries in population
      for(let i=0; i<10; i++){
        top_lists1.append("li")
                  .html("<span class='cname'>" + popCountriesData[i]["Country"] + " :</span> " + formatNumber(popCountriesData[i]["2020"]));
      }

    });


    // Top 10 Cities markers
    d3.json(urlCity).then(function(cityData){  
    // An array which will be used to store created cityMarkers
    var cityMarkers = [];
    var cityCircleMarkers = [];

    // getting data from cities json API
    var cities = cityData[0]["data"];
    // Loop through top 10 cities and create city markers
    for (let i = 0; i < 10; i++) {
      let coordinates = [cities[i].Latitude, cities[i].Longitude];
      let population = cities[i]["2020"];
      // create a new marker, push it to the cityMarkers array
      cityMarkers.push(
        L.marker(coordinates).bindPopup("<h3>" + cities[i].City + "</h3> <hr> <h4>Population: " + formatNumber(population) + "</h4>")
      );
      // cityCircleMarkers.push(
      //   L.circle(coordinates, {
      //     fillOpacity: 1,
      //     color: "black",
      //     fillColor: "black",
      //     radius: population/50
      // }).bindPopup("<h3>" + cities[i].City + "</h3> <hr> <h4>Population: " + formatNumber(population) + "</h4>")); 


      // creating a list of Top 10 Cities in population
      top_lists2.append("li")
               .html("<span class='cname'>" + cities[i]["City"] + " , " + cities[i]["Country"] + " :</span> " + formatNumber(population));

    }

    // Add all the cityMarkers to a new layer group.
    var cityLayer = L.layerGroup(cityMarkers);
    // var cityCircleLayer = L.layerGroup(cityCircleMarkers);
    // cityLayer.addLayer(cityCircleLayer);





    

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
    // Overlays that may be toggled on or off
    var overlayMaps = {
      "Top 10 Cities": cityLayer
    };

    // to clear container of map before initializing if already exists
    var container = L.DomUtil.get('map');
    if(container != null){
        console.log(container);
        container._leaflet_id = null;
    }  

    // Creating map object
    var myMap = L.map("map", {
      center: [34.0522, 10.2437],
      zoom: 2,
      layers: [light]
    });
    // Add the layer control to the map
    L.control.layers(null, overlayMaps, {
      collapsed: false
    }).addTo(myMap);



    

    function getColor(d) {
      return d > 1000000000 ? '#034E7B' :
             d > 200000000  ? '#0570B0' :
             d > 100000000  ? '#3690C0' :
             d > 10000000  ? '#74A9CF' :
             d > 1000000   ? '#A6BDDB' :
             d > 100000  ? '#D0D1E6' :
             d > 10000   ? '#ECE7F2' :
                        '#FFF7FB';
    }
    function style(feature) {
      return {
          fillColor: getColor(feature.properties["2020"]),
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
      this._div.innerHTML = '<h4>2020 Population</h4>' +  (props ?
              '<b> Country: ' + props.name + '<br>Population: ' + formatNumber(props["2020"]) + '</b><br>Density: ' + props.Density + 
              ' /km²<br>Growth rate: ' + props.GrowthRate + '% <br>Rank: ' + props.rank + '<br>'
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

    var geojson;

    function resetHighlight(e) {
          geojson.resetStyle(e.target);
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
    geojson = L.geoJson(data, {style: style, onEachFeature: onEachFeature}).addTo(myMap);
    info.addTo(myMap);
    
      var  show = ["< 10,000","10,000 +", "100,000 +", "1M +", "10M +","100M +","200M +","1B +"];
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (myMap) {
          var div = L.DomUtil.create('div', 'info legend'),
              popul = [0, 10000, 100000, 1000000, 10000000, 100000000, 200000000, 1000000000],
              labels = [],
              from, to;
          for (var i = 0; i < popul.length; i++) {
              from = popul[i];

              to = popul[i + 1];
              labels.push(
                  '<i style="background:' + getColor(from + 1) + '"></i> ' +
                  show[i] ); // + (to ? '&ndash;' + to : '+')
          }
          div.innerHTML = labels.join('<br>');
          return div;
      };
      legend.addTo(myMap);  
      
  });

});

})(d3);