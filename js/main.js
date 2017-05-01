/* Thomas Harner
main.js
*/

// Order: Buildings, Parks, Roads, Trails (Count)

var AlexandriaOSM = [10685,62,5358,299]
var AlexandriaGovt = [33529,233,5082,0];
var AlexandriaProp = [10685/33529.0, 62/233.0, 5358/5082.0, null];
var HenricoOSM = [2620,43,13378,37];
var HenricoGovt = [200316,69,21996,994];
var HenricoProp = [2620/200316.0, 43/69.0, 13378/21996.0,37/994.0];
var LynchburgOSM = [579,18,3538,53];
var LynchburgGovt = [32491,37,4574,92];
var LynchburgProp = [579/32491.0,18/37.0,3538/4574.0,53/92.0];

var chart = null;

// global chart canvas variable
// var ctx = $("#bar-chartcanvas");


// Format to percentages with 2 decimal places
for (i = 0; i < AlexandriaProp.length; i++){
    AlexandriaProp[i] = parseFloat(Math.round(AlexandriaProp[i] * 100)/100).toFixed(2);
    HenricoProp[i] = parseFloat(Math.round(HenricoProp[i] * 100)/100).toFixed(2);
    LynchburgProp[i] = parseFloat(Math.round(LynchburgProp[i] * 100)/100).toFixed(2);
    
};


function createMap() {
    
    var highlightStyle = "5px solid yellow";
    var unhighlight = "none";
    
    mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzaGFybmVyIiwiYSI6ImNqMXA2dTY2OTAwZnUycnJ3MzhtYWc5NHAifQ.JYDW8uR0odthCOHngoNqUg';
    
    var osmMap = new mapboxgl.Map({
        container: 'osm',
        //center: [-78.111929,38.249980],
        center: [-78.024408,38.155655],
        zoom: 7.5,
        style: 'mapbox://styles/thomasharner/cj1vmsm5e00002sqj13hcdwtm'
    });
    
    bounds = [[-84.67539,36.54076],[-74.16643,39.46601]];
    
    var govMap = new mapboxgl.Map({
        container: 'govt',
        //center: [-78.111929,38.249980],
        center: [-78.024408,38.155655],
        zoom: 7.5,
        style: 'mapbox://styles/thomasharner/cj1vmwd6b00012rp221mlcom4'
        
    });
    
    osmMap.setMaxBounds(bounds);
    govMap.setMaxBounds(bounds);
    
    var map = new mapboxgl.Compare(osmMap, govMap);
    
    $("#flyAlexandria").click(function(){
        clearHighlight();
        var key = document.getElementById("flyAlexandria");
        key.style.border = highlightStyle
        flyToLocation(govMap,osmMap,this.id);
    });
    
    $("#flyHenrico").click(function() {
       clearHighlight();
       var key = document.getElementById("flyHenrico");
        key.style.border = highlightStyle;
        flyToLocation(govMap,osmMap,this.id);

    });
    
    $("#flyLynchburg").click(function() {
        clearHighlight();
        var key = document.getElementById("flyLynchburg");
        key.style.border = highlightStyle;
        flyToLocation(govMap,osmMap,this.id);
    });
    
    document.getElementById('changeBasemap').addEventListener('click',function() {
        
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
    
    function clearHighlight() {
        document.getElementById("flyLynchburg").style.border = unhighlight;
        document.getElementById("flyAlexandria").style.border = unhighlight;
        document.getElementById("flyHenrico").style.border = unhighlight;
        
    }
    
    
    //mapbox://styles/thomasharner/cj1vn4jr300092rpo7dnyxqm2
    //mapbox://styles/thomasharner/cj1vn5pml00002sp9nx799k71
    
    //http://www.petelepage.com/blog/2011/07/showing-hiding-panels-with-html-and-css/
    // Add panel with city info, update legend to include svg colors/symbology, mini map, standard organization.
    // Potential charts - for each city, a graph showing the count of features in each dataset (bar graph?)
    
    
    osmMap.on('load',function(){
                
        var features = ['Parks', 'Building Footprints','Primary Roads', 'Secondary Roads', 'Trails'];
        var hexColors = ['#00CC00','#9933CD','#000','#E0E0E0', '#663300']
        
        for (i = 0; i < features.length; i++){
            var color = hexColors[i];
            var item = document.createElement('div');
            var key = document.createElement('span');
            key.className = 'legend-key' + color;
            key.style.backgroundColor = color;
            // if roads or trails, set to larger width and smaller height
            
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



function flyToLocation(govMap,osmMap,clicked_id){
    
    if (chart != null) {
        chart.destroy();
    };
    
    var bounds = [
            [-80.10757,35.78710],[-74.03844,41.84473]
            ];
        osmMap.setMaxBounds(bounds);
        govMap.setMaxBounds(bounds);
    
    
    if (clicked_id == 'flyAlexandria') {
        govMap.flyTo({
            center:[-77.08628,38.81854],
            zoom: 12
        });
        
        // [-80.10757,35.78710],[-74.03844,41.84473]
        
        var bounds = [
            [-80.10757,35.78710],[-74.03844,41.84473]
            ];
        osmMap.setMaxBounds(bounds);
        govMap.setMaxBounds(bounds);
        
        var colorCodes = ['rgba(238, 138, 101, 0.3)','rgba(238, 138, 101, 1)'];
        
        chart = createChart(colorCodes,AlexandriaProp);
        console.log(chart);


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
        
        /*var bounds = [
            [-77.65398,37.37446],
            [-77.18607,37.7160]
            ];
        osmMap.setMaxBounds(bounds);
        govMap.setMaxBounds(bounds);*/
        
        var colorCodes = ['rgba(102, 102, 153, 0.3)','rgba(102, 102, 153, 1)'];
    
        chart = createChart(colorCodes,HenricoProp);
        console.log(chart);
        
        
             
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
        
        var colorCodes = ['rgba(51, 255, 102, 0.3)','rgba(51, 255, 102, 1)'];
        
        chart = createChart(colorCodes,LynchburgProp);
        console.log(chart);
        
        
        /*"POLYGON((-79.29139289 37.31263692,-79.29139289 37.48936784,-79.06449416 37.48936784,-79.06449416 37.31263692,-79.29139289 37.31263692))"*/
        
       /* var bounds = [
            [-79.29139289,37.31263692],
            [-79.06449416,37.48936784]
            ];
        osmMap.setMaxBounds(bounds);
        govMap.setMaxBounds(bounds);*/
    };
      
    
}

function createChart(colorCode,osmData) {
    //$("#bar-chartcanvas")
    
    var barColor = colorCode[0];
    var borderColor = colorCode[1];
    

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
    
    /*scales: {
        yAxes: [{
            ticks: {
                min: 0
            }
        }]
    }*/
};
    
    var data = {
        labels: ["Buildings", "Parks", "Roads", "Trails"],
        datasets: [
            /*{
                label: "County",
                data: govData,
                backgroundColor: [
                    "rgba(10,20,30,0.3)",
                    "rgba(10,20,30,0.3)",
                    "rgba(10,20,30,0.3)",
                    "rgba(10,20,30,0.3)"
                ],
                borderColor :[
                    "rgba(10,20,30,1)",
                    "rgba(10,20,30,1)",
                    "rgba(10,20,30,1)",
                    "rgba(10,20,30,1)"

                ],
                borderWidth: 1
            },*/

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
    var chart = new Chart(ctx,{
        type: "bar",
        data: data,
        options: options
        
    });
    
    return chart;
    
    
    
}
$(document).ready(createMap);

