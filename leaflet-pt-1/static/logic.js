var url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`;

d3.json(url).then(function(response) {

    console.log(response);

    createFeatures(response.features);

});

function createFeatures(earthquakedata) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    console.log("Earthquake", earthquakedata)

    var earthquakes = L.geoJSON(earthquakedata, {
        pointToLayer: function (feature, location) {
            return new L.circleMarker(location, {
              radius: feature.properties.mag,
              fillColor: colordepth(feature.geometry.coordinates[2]),
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            });
        },
        onEachFeature: onEachFeature
    });
    console.log(earthquakes)

    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        0, 0
      ],
      zoom: 4,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  

  

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        console.log("Legend", earthquakes);
        var div = L.DomUtil.create("div", "info legend");
        var dmin = ["-50-50", "50-100", "100-175", "175-300", "300+"];
        var colors = ["#ADFF2F", "#00FF00", "#32CD32", "#228B22", "#006400"];
        var labels = [];
        var legendInfo = `<p style=\"font-size:15px"> Earthquake Depth: </p>`

        div.innerHTML = legendInfo;

        colors.forEach(function(limit, index) {
        labels.push("<ul style=\"background-color: " + colors[index]+ "\">" + dmin[index] + "</ul>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        console.log("Inner HTML", div.innerHTML);
        return div;

    };
  legend.addTo(myMap);

}


function colordepth(dmin) {
    if (dmin >= -50 && dmin < 50 ) {
        return '#ADFF2F';
      }
      else if (dmin >= 50 && dmin < 100) {
        return '#00FF00';
      }
      else if (dmin >= 100 && dmin < 175) {
        return '#32CD32';
      }
      else if (dmin >= 175 && dmin < 300) {
        return '#228B22';
      }
      else {
        return '#006400';
      }
    }

