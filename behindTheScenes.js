

var initMap = function(json)
{
    //the size of the screen
    var screen = {width:900, height:650};
    
    //how much space will be on each side of the graph
    //var margins = {top:15,bottom:40,left:70,right:40};
    var margins = {top:0,bottom:0,left:0,right:0};
    
    //generated how much space the map will take up
    var map = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    //set the screen size
    var svg = d3.select("svg")
                .attr("width",screen.width)
                .attr("height",screen.height)
                .style("background-color", "#1c1c77")
    
    //sets the projection
    var projection = d3.geoEquirectangular()
                        .translate([screen.width/2,screen.height/2])
                        .scale([150]) //Default Equirectangular Scale is 152.63


    //Define the path generator, using the Mercator projection
    //Source: https://github.com/d3/d3-geo-projection

    var path = d3.geoPath(projection);


    //Draws the borders and general map
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill","green");
    
    //Adds points
    var countriesPromise = d3.csv("countries_cases.csv");
    

    var countriesSuccess = function(countries) {
        var svg = d3.select("svg");
        
        var projection = d3.geoEquirectangular()
                            .translate([screen.width/2,screen.height/2])
                            .scale([150]) //Default Equirectangular Scale is 152.63
        
        svg.selectAll("circle")
            .data(countries)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", function(d){
                console.log(d.may022020)
                return Math.sqrt(parseInt(d.may022020)*0.0004)
            })
            .style("fill", "yellow")
            .style("opacity",0.75)
            .append("title")
            .text(function(d) {
                return d.capital+", "+d.CountryName+"\n"+d.may022020+" cases";
            });
    };
    
    var countriesFailure = function(errorMsg) //If there was an error
        {
            console.log("Something went wrong",errorMsg);
        }   
    countriesPromise.then(countriesSuccess, countriesFailure);
        
        
   
    
    
}









//Load in GeoJSON data
var geoPromise = d3.json("ne_10m_admin_0_countries.json");


var successFcn = function(mapData) //If the data is successfully collected
{
    console.log("Data Collected");
    initMap(mapData);
}

var failureFcn = function(errorMsg) //If there was an error
{
    console.log("Something went wrong",errorMsg);
}

geoPromise.then(successFcn,failureFcn);