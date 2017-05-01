/* Thomas Harner
main.js
Script that works with JQuery and Mapbox-GL to generate a swipe map using Mapbox-derived vector tilesets. Functionality includes swiping between two different sources of geospatial data, comparing them via bar chart based on coverage, and panning to three unique county/city regions across the state of Virginia. Credits to OpenStreetMap for OSM data and to the ESRI Open Data Portal for hosting the necessary crowd-sourced data. 
*/

// Global Variables depicting the arrays of data for each AOI.

var AlexandriaOSM = [10685,62,5358,299]
var AlexandriaGovt = [33529,233,5082,0];
// Proportional data used for bar chart (Alexandria OSM / Alexandriva Gov)
var AlexandriaProp = [10685/33529.0, 62/233.0, 5358/5082.0, null];
var HenricoOSM = [2620,43,13378,37];
var HenricoGovt = [200316,69,21996,994];
// Proportional data used for bar chart (Henrico OSM / Henrico Gov)
var HenricoProp = [2620/200316.0, 43/69.0, 13378/21996.0,37/994.0];
var LynchburgOSM = [579,18,3538,53];
var LynchburgGovt = [32491,37,4574,92];
// Proportional data used for bar chart (Lynchburg OSM / Lynchburg Gov)
var LynchburgProp = [579/32491.0,18/37.0,3538/4574.0,53/92.0];

// Universal variable to store chart object
var chart = null;



// Format to percentages with 2 decimal places
for (i = 0; i < AlexandriaProp.length; i++){
    AlexandriaProp[i] = parseFloat(Math.round(AlexandriaProp[i] * 100)).toFixed(2);
    HenricoProp[i] = parseFloat(Math.round(HenricoProp[i] * 100)).toFixed(2);
    LynchburgProp[i] = parseFloat(Math.round(LynchburgProp[i] * 100)).toFixed(2);
    
};

// Set up the map
function createMap() {
    
    // Set variables to change the appearance of toggled interface buttons
    var highlightStyle = "5px solid yellow";
    var unhighlight = "none";
    
    // Connect to Mapbox account
    mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzaGFybmVyIiwiYSI6ImNqMXA2dTY2OTAwZnUycnJ3MzhtYWc5NHAifQ.JYDW8uR0odthCOHngoNqUg';
    
    // Declare map object containing the OSM tileset
    var osmMap = new mapboxgl.Map({
        container: 'osm',
        center: [-78.024408,38.155655],
        zoom: 7.5,
        style: 'mapbox://styles/thomasharner/cj1vmsm5e00002sqj13hcdwtm'
    });
    
    bounds = [[-84.67539,36.54076],[-74.16643,39.46601]];
    
    // Declare map object containing Gov tileset
    var govMap = new mapboxgl.Map({
        container: 'govt',
        center: [-78.024408,38.155655],
        zoom: 7.5,
        style: 'mapbox://styles/thomasharner/cj1vmwd6b00012rp221mlcom4'
        
    });
    
    // Confine the map to roughly the state of Virginia
    osmMap.setMaxBounds(bounds);
    govMap.setMaxBounds(bounds);
    
    // Create the comparison slider for the map divs
    var map = new mapboxgl.Compare(osmMap, govMap);
    
    // Upon clicking on Alexandria, highlight the button and fly to area
    $("#flyAlexandria").click(function(){
        clearHighlight();
        var key = document.getElementById("flyAlexandria");
        key.style.border = highlightStyle
        flyToLocation(govMap,osmMap,this.id);
    });
    
    // Upon clicking on Henrico, highlight the button and fly to area
    $("#flyHenrico").click(function() {
       clearHighlight();
       var key = document.getElementById("flyHenrico");
        key.style.border = highlightStyle;
        flyToLocation(govMap,osmMap,this.id);

    });
    
    // Upon clicking on Lynchburg, highlight the button and fly to area
    $("#flyLynchburg").click(function() {
        clearHighlight();
        var key = document.getElementById("flyLynchburg");
        key.style.border = highlightStyle;
        flyToLocation(govMap,osmMap,this.id);
    });
    
    // Toggle the vector and basemap layers
    document.getElementById('changeBasemap').addEventListener('click',function() {
        
        // Set the new styles and change the button label
        if(this.firstChild.nodeValue == 'View Imagery'){
            osmMap.setStyle('mapbox://styles/thomasharner/cj1vn4jr300092rpo7dnyxqm2');
            govMap.setStyle('mapbox://styles/thomasharner/cj1vn5pml00002sp9nx799k71');
            this.firstChild.nodeValue = 'View Vector';
        }
        else {
            osmMap.setStyle('mapbox://styles/thomasharner/cj1vmsm5e00002sqj13hcdwtm');
            govMap.setStyle('mapbox://styles/thomasharner/cj1vmwd6b00012rp221mlcom4');
            this.firstChild.nodeValue = 'View Imagery';
        }
        
    });
    
    // Clears the highlight when another AOI is selected
    function clearHighlight() {
        document.getElementById("flyLynchburg").style.border = unhighlight;
        document.getElementById("flyAlexandria").style.border = unhighlight;
        document.getElementById("flyHenrico").style.border = unhighlight;
        
    }
    
    
    osmMap.on('load',function(){
        // Features and corresponding hex colors to build the legend        
        var features = ['Parks', 'Building Footprints','Primary Roads', 'Secondary Roads', 'Trails'];
        var hexColors = ['#00CC00','#9933CD','#000','#E0E0E0', '#663300']
        
        for (i = 0; i < features.length; i++){
            var color = hexColors[i];
            var item = document.createElement('div');
            var key = document.createElement('span');
            key.className = 'legend-key' + color;
            key.style.backgroundColor = color;
            // if roads or trails, set to larger width and smaller height than CSS
            
            if (i == 2 || i == 3 || i == 4){
                
                key.style.display = "inline-block";
                key.style.height = "0.1px";
                key.style.width = "25px";
           
            }
            else {
                item.innerHTML= "&nbsp&nbsp";
            }
            
            var value = document.createElement('span');
            if (i == 2 || i == 3 || i == 4){
                value.innerHTML = features[i];
            }
            else {
                value.innerHTML = "&nbsp&nbsp" + features[i];
            }
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
            
        };
        
        
        
    });
    

};


// Gets passed the selected AOI and pans each map to the selected region
function flyToLocation(govMap,osmMap,clicked_id){
    
    // Destroy the canvas contents of the previous chart
    if (chart != null) {
        chart.destroy();
    };
    
    var bounds = [
            [-80.10757,35.78710],[-74.03844,41.84473]
            ];
        osmMap.setMaxBounds(bounds);
        govMap.setMaxBounds(bounds);
    
    // Fly to Alexandria
    if (clicked_id == 'flyAlexandria') {
        govMap.flyTo({
            center:[-77.08628,38.81854],
            zoom: 12
        });
        
        
        var bounds = [
            [-80.10757,35.78710],[-74.03844,41.84473]
            ];
        osmMap.setMaxBounds(bounds);
        govMap.setMaxBounds(bounds);
        
        // Set color codes for the chart
        var colorCodes = ['rgba(238, 138, 101, 0.3)','rgba(238, 138, 101, 1)'];
        
        // Generate a new chart with the color codes of the border
        chart = createChart(colorCodes,AlexandriaProp);


    }
    else if (clicked_id == 'flyHenrico') {
        var bounds = [
            [-80.10757,35.78710],[-74.03844,41.84473]
            ];
        osmMap.setMaxBounds(bounds);
        govMap.setMaxBounds(bounds);
        
        
        govMap.flyTo({
            center:[-77.39478,37.58435],
            zoom:10
        });
        
        // Set color codes for the chart
        var colorCodes = ['rgba(102, 102, 153, 0.3)','rgba(102, 102, 153, 1)'];
        
        // Generate a new chart with the color codes of the border
        chart = createChart(colorCodes,HenricoProp);
             
    }
    else {
        var bounds = [
            [-80.10757,35.78710],[-74.03844,41.84473]
            ];
        osmMap.setMaxBounds(bounds);
        govMap.setMaxBounds(bounds);
        
        govMap.flyTo({
            center:[-79.18038,37.40087],
            zoom: 10
            
        });
        
        // Set the color codes for the chart
        var colorCodes = ['rgba(51, 255, 102, 0.3)','rgba(51, 255, 102, 1)'];
        // Generate a new chart with the color codes of the border
        chart = createChart(colorCodes,LynchburgProp);
        
    };
      
    
}

// Creat the chart within the canvas
function createChart(colorCode,osmData) {
    
    // Set the bar color and chart based on what was passed
    var barColor = colorCode[0];
    var borderColor = colorCode[1];
    
    // obtain the bar chart canvas
    var ctx = $("#bar-chartcanvas");
    
    //options
    var options = {
    responsive: true,
    title: {
        display: true,
        position: "top",
        text: "OSM Coverage (%)",
        fontSize: 18,
        fontColor: "#111"
    },
    legend: {
        display: true,
        position: "bottom",
        labels: {
            fontColor: "#333",
            fontSize: 10
        }
    }
    
};
    
    var data = {
        labels: ["Buildings", "Parks", "Roads", "Trails"],
        datasets: [
            {
                label: "OpenStreetMap",
                data: osmData,
                backgroundColor: [
                    barColor,
                    barColor,
                    barColor,
                    barColor
                ],
                borderColor :[
                    borderColor,
                    borderColor,
                    borderColor,
                    borderColor

                ],
                borderWidth: 1
            }
            ]
        
    };
    
    // Declare and initialize new chart
    var chart = new Chart(ctx,{
        type: "bar",
        data: data,
        options: options
        
    });
    
    // return the chart
    return chart;
    
    
    
}
$(document).ready(createMap);

