
var createLineLegend = function(screen, margins, graph)
{
    var legend = d3.select("svg#lineGraph")
                    .append("g")
                    .classed("legend", true)
                    .attr("transform", "translate("+(margins.left+10)+","+(margins.top+10)+")");
    
    var entries = legend.selectAll("g")
        .data(["No Stay At Home Requirement","Stay At Home Requirement Enacted"])
        .enter()
        .append("g")
        .classed("legendEntry", true)
        .attr("fill", function(d,i)
              {
                if(i==0){
                    return "orange";
                }else{
                    return "purple";
                }
                })
        .attr("transform", function(d,i)
             {
                return "translate("+i*300+", 0)";
                })
              
        entries.append("rect")
                .attr("width",10)
                .attr("height",10)
        entries.append("text")
                .text(function(d){return d})
                .attr("x",15)
                .attr("y",10)
    

    
}




var createLabels = function(screen, margins, graph) //Creates the labels for the line graph
{
    var labels = d3.select("svg#lineGraph")
        .append("g")
        .classed("labels",true);
        
    labels.append("text") //Sets the Title
        .attr("id", "graphTitle")
        .text("")
        .classed("title",true)
        .attr("text-anchor","middle")
        .attr("x",margins.left+(graph.width/2))
        .attr("y",margins.top);
    
    labels.append("text") //Sets the X-Axis Label
        .text("Days")
        .classed("label",true)
        .attr("text-anchor","middle")
        .attr("x",margins.left+(graph.width/2))
        .attr("y",screen.height-15); //Adjusted to get the label off the bottom edge of the "screen"
    
    labels.append("g") //Sets the y-axis label
        .attr("transform","translate(20,"+ 
              (margins.top+(graph.height/2))+")")
        .append("text")
        .text("Case Number")
        .classed("label",true)
        .attr("text-anchor","middle")
        .attr("transform","rotate(90)");
}
    
var updateTitleCountry = function(selectedCountryName)
    {
        d3.select("#graphTitle")
            .text("Covid-19 Cases Over Time in "+selectedCountryName)
    }
    

var recalculateYScale = function(countryCases,graph,margins)
{
    var yScale = d3.scaleLinear()
        .domain([d3.min(countryCases),d3.max(countryCases)])
        .range([graph.height,margins.top]) 
    
    return yScale;
}


var initAxes = function(screen, margins, graph) //Creates the axes for the line graph
{
    
    
    var axes = d3.select("svg#lineGraph")

    axes.append("g")
        .attr("id", "xAxis")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .attr("stroke","black");
    
    axes.append("g")
        .attr("id","yAxis")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .attr("stroke","black");
    
}

var updateAxes = function(xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale); 
    
    d3.select("#xAxis")
        .transition()
        .duration(1000)
        .call(xAxis)
    
    d3.select("#yAxis")
        .transition()
        .duration(1000)
        .call(yAxis)
}

var updateGraph = function(countryCases, graph, margins, xScale, selectedName)
{
    
    
    
    
    
    
    
    updateTitleCountry(selectedName);
    
    var yScale = recalculateYScale(countryCases,graph, margins);
   
    updateAxes(xScale, yScale);
    
    var lineGenerator = d3.line()
                            .x(function (country,i)
                              {return xScale(i);})
                            .y(function (country)
                              {return yScale(country);})
                            .curve(d3.curveCardinal);
    
    var lines = d3.select("svg#lineGraph")
        .select(".graph")
    
    lines.selectAll("path") //remove old lines
         .remove()
        //.selectAll("path")
    lines.append("path")
        .datum(countryCases)

    lines.exit()
        .remove();
    
    //UPDATE - Redecorate
    
    d3.select("svg#lineGraph")
        .select(".graph")
        .selectAll("path")
        .classed("line",true)
        .transition()
        .duration(1000)
        .attr("d",lineGenerator)
        .attr("fill","none")
        .attr("stroke-width",10)

        
        
    
    
}




var drawLines = function(countryCases, graph, xScale, yScale) //Draws the line of the line graph based on the case data for a specific country
{
    var lineGenerator = d3.line()
                            .x(function (country,i)
                              {return xScale(i);})
                            .y(function (country)
                              {return yScale(country);})
                            .curve(d3.curveCardinal);
    
    var lines = d3.select("svg#lineGraph")
        .select(".graph")
//        .selectAll("g")
//        .data(countryCases)
//        .enter()
//        .append("g")
//        .classed("line",true)
//        .attr("fill","none")
//        .attr("stroke","blue")
//        .attr("stroke-width", 1);
        
    
    
    lines.append("path")
        .datum(countryCases)
        .classed("line",true)
        .attr("d",lineGenerator)  
        .attr("fill","none")
        .attr("stroke","blue")
        .attr("stroke-width", 1);
        
    

}





var initGraph = function(selectedName, cases) //Creates the layout and basics for the line graph
{
    //the size of the screen
    var screen = {width:800, height:550};
    
    //how much space will be on each side of the graph
    var margins = {top:40,bottom:50,left:90,right:40};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    
    
    //set the screen size
    var svg = d3.select("svg#lineGraph")
                .attr("width",screen.width)
                .attr("height",screen.height)
                .style("background-color", "white")
    
    
    
    
    
    //create a group for the graph
    var g = d3.select("svg#lineGraph")
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
    
    
    createLabels(screen, margins, graph);
    initAxes(screen, margins, graph);
    createLineLegend(screen, margins, graph);
    
    
    
    //get the headers of the total cases object in order to get the specifc range of dates from the data
    
    //-------------------------------------------------------------------------------
    var headers = Object.getOwnPropertyNames(cases);
    var dates = headers.slice(1,headers.length+1);
    
    var countriesCases = []; //empty array to store the case data for a speciic country
    
    for (var i = 0; i < dates.length; i++) { //stores the case data from an object into an array
        countriesCases[i] = parseInt(cases[dates[i]]);
    }
    
    
    
    //create scales

    var xScale = d3.scaleLinear()
        .domain([0, dates.length])
        .range([0,graph.width])
    
    
    var stayHomePromise = d3.csv("StayAtHomeRequirements.csv"); //----------- Need stay-at-home data ------------------------
        
    
    var staySuccess = function(stayData) {
        
        //Get the stay at home data for the selected country
        var stayHeaders = Object.getOwnPropertyNames(stayData[0]);
        var stayDates = headers.slice(1,stayHeaders.length+1);
        var selectedStayData = {};
        
        for (var k = 0; k < stayData.length; k++) {
            if(stayData[k].CountryName == selectedName){
                selectedStayData = stayData[k];
            }
        }
        
        countryStayData = [] //Store a selected country's data in an array
    
        for (var i = 0; i < stayDates.length; i++) {
            countryStayData[i] = parseInt(selectedStayData[stayDates[i]]);
            
        }
        
        var socialDistDate = 0; //Base variable to mark when a country put a stay at home order in place
    
        for (var j = 0; j < countryStayData.length; j++) {   
            if(countryStayData[j]>0){
                socialDistDate = j;
                console.log("Social Distancing began on day: "+j+" that is "+stayDates[j]);
                break
            }

        }
        
        d3.select("svg#lineGraph linearGradient").remove() //Remove any previous lineGradient info created
        
        //Create a line gradient based on when a country started a stay at home order
        svg.append("linearGradient")
               .attr("id", "line-gradient")
               .attr("gradientUnits", "userSpaceOnUse")
               .attr("x1", xScale(0)).attr("y1", 0)
               .attr("x2", xScale(socialDistDate)).attr("y2", 0)
               .selectAll("stop")
               .data(
                      [
                       {offset: "100%", color: "orange"},
                       {offset: "100%", color: "purple"},
                      ]
                    )
                .enter().append("stop")
                        .attr("offset", function(d) { return d.offset; })
                        .attr("stop-color", function(d) { return d.color; });

        
        
        
        
        
        
        
        updateGraph(countriesCases,graph, margins, xScale,selectedName);
        //drawLines(countriesCases, graph, xScale, yScale)
    
    };
    
    
    
    var stayFailure = function(err) {console.log("There was an error:",err)};
    
    stayHomePromise.then(staySuccess,stayFailure);
    
    
}

var createMapLegend = function(screen, margins, color)  //Source:https://stackoverflow.com/questions/21838013/d3-choropleth-map-with-legend
{
    var legend = d3.select("svg#map")
            .selectAll("g.legendEntry")
            .data(color.range())
            .enter()
            .append("g")
            .classed("legendEntry",true)
    
    legend.append("rect")
        .attr("x", function(d,i){
            return 50+i*190
        })
        .attr("y", screen.height-50)
        .attr("width",10)
        .attr("height", 10)
        .style("fill", function(d){return d;});
    
    legend.append('text')
        .attr("x", function(d,i){
            return 55+i*190
        })
        .attr("y", screen.height-25)
        .text(function(d,i){
        
            var extent = color.invertExtent(d);
            
            if(i==color.range().length-1){
                return "More than "+extent[0]
            }
            else{
                return extent[0]+" - "+extent[1];
            }
            
    })
        .attr("text-anchor","middle")
        .style("fill", function(d){return d;});
    
    
    
}




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
    var svg = d3.select("svg#map")
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

   // countryNames = json.features.map(function(point){return point.properties.NAME})
    //countryNames.sort();
    //console.log(countryNames)
    
    
    //Load in cases data
    
    var countriesPromise = d3.csv("countries_cases.csv");
    

    var countriesSuccess = function(countries) {
        
        
        console.log("Countries Collected: ", countries);

        //sets the color scale
        var color = d3.scaleQuantize()
                        .range(["rgb(237,248,233)","rgb(186,228,179)",
                                "rgb(116,196,118)","rgb(49,163,84)", "rgb(0,109,44)"]);
        
        
        
        //Merge the cases data nd the GeoJSON
        //Loop through once for each country case value
        
        var dataHeaders = Object.getOwnPropertyNames(countries[0]);
        var dateRange = dataHeaders.slice(1,dataHeaders.length);

        var lastDate = dateRange[dateRange.length-1];
        
        //In order to get data that shows interesting distinictions in colors
        var midCountries = [];

        
        for( var c = 0; c < countries.length; c++) {
            if (parseInt(countries[c][lastDate]) < 10000){
                midCountries.push(parseInt(countries[c][lastDate]));
            }  
            
        }
        
        console.log(countries);
//        color.domain([d3.min(countries, function(d){return parseInt(d[lastDate])}),
//                      d3.max(countries, function(d){return parseInt(d[lastDate])})]);
        color.domain([d3.min(midCountries),d3.max(midCountries)]);
        
        d3.select("body h1")
            .text(function(lastDate){return ""})

        for (var i = 0; i < countries.length; i++) {
            
            //Grab the country name
            var countryName = countries[i].CountryName;
            
            //Grab the country case value
            var countryCaseNum = parseInt(countries[i][lastDate]);
            
            //Find the corresponding country inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                var jsonCountry = json.features[j].properties.NAME;
                
                if(countryName == jsonCountry) {
                    
                    //Copy the caseNumber value into the JSON
                    json.features[j].properties.value = countryCaseNum;
                    
                    //console.log(countryName+" has "+countryCaseNum+" cases")
                    
                    //Stop looking through the JSON
                    break;
                }  
            }       
        }
        
        createMapLegend(screen, margins, color);
        
        //Draws the borders and general map
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function(d) {
            
                //Get case value
                var value = d.properties.value;
                
                if (value) {
                    return color(value);
                } else {
                    d.properties.value = "No reported"
                    return "#ccc";
                }
        
        })
            .on("click",function(d){
                //removes current graph !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! prolly will change to make animations smoother later ------------------------------------------------
//                d3.selectAll("svg#lineGraph>g")
//                  .remove();
                var selectedName = d.properties.NAME;
                
                var countryObj = {};

                for (var k = 0; k < countries.length; k++) {
                    if(countries[k].CountryName == selectedName) {
                        countryObj = countries[k];
                        break;
                    }
                }
            
                initGraph(selectedName, countryObj)
        })
            .append("title")
            .text(function(d){return d.properties.NAME+": "+d.properties.value+" cases"});
        
        console.log("New Data: ",json)
        
    
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
    console.log("Data Collected: ");

    initMap(mapData);
    initGraph()
}

var failureFcn = function(errorMsg) //If there was an error
{
    console.log("Something went wrong",errorMsg);
}

geoPromise.then(successFcn,failureFcn);