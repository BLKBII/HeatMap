
var data; // a global

d3.json("https://s3.amazonaws.com/blackrockblog-blanktemplate-assets/data/GrowthData.js", function(json) {
//d3.json("datafile.json", function(json) {
  
 var  data = json;
 
 run(data);
});

function run(data) {
var margin = { top: 50, right: 0, bottom: 100, left: 70 },
          width = 750 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 33),
          legendElementWidth = gridSize*2,
          buckets = 9,
          cornerRounding = 6,
          colors = ["#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4"], // alternatively colorbrewer.YlGnBu[9]
          countries =["US","Canada","Mexico","Brazil","UK","Germany","France","Spain","Italy","Ireland","Portugal","S Africa","India","China","Japan","Australia"],
          dates = ["2006", "", "", "", "2007", "", "", "", "2008", "", "", "", "2009", "", "", "", "2010", "", "", "", "2011", "", "", "","2012","","","","2013","","","","2014"];

          var colorScale = d3.scale.quantile()
              .domain([d3.min(data, function (d) { return d.value; }), d3.max(data, function (d) { return d.value; })])
              .range(colors);

          var svg = d3.select("#chart").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

             svg.append("line")
               .attr("x1", -margin.left)
              .attr("y1",4 * gridSize)
               .attr("x2", width - gridSize)
               .attr("y2", 4 * gridSize)
              .attr("stroke-width", 0.5)
              .attr("stroke", "rgb(80,80,80)");

              svg.append("line")
                 .attr("x1", -margin.left)
                .attr("y1",11 * gridSize)
                 .attr("x2", width - gridSize)
                 .attr("y2", 11 * gridSize)
                 .attr("stroke-width", 0.5)
                 .attr("stroke", "rgb(80,80,80)");
                      
              svg.append("line")
                 .attr("x1", -margin.left)
                  .attr("y1",13 * gridSize)
                 .attr("x2", width - gridSize)
                 .attr("y2", 13 * gridSize)
                  .attr("stroke-width", 0.5)
                  .attr("stroke", "rgb(80,80,80)");

//countrylabels
          var countryLabels = svg.selectAll(".countryLabel")
              .data(countries)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
               .attr("class", function(d,i){ return "mono label_" + i; });
//x axis labels
          var timeLabels = svg.selectAll(".timeLabel")
              .data(dates)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });
//create boxes
          var heatMap = svg.selectAll(".boxes")
              .data(data)
              .enter().append("rect")
              .attr("x", function(d) { return (d.quarter - 1) * gridSize; })
              .attr("y", function(d) { return (d.country - 1) * gridSize; })
              .attr("rx", cornerRounding)
              .attr("ry", cornerRounding)
              .attr("class", function(d,i){ return "bordered row_" + d.country; })
              .attr("width", gridSize)
              .attr("height", gridSize)
             
//handle the mouseover              
              .on('mouseover', function(d){
    //              d3.selectAll(".row_" + d.country).transition().duration(150).style({stroke:'rgb(127, 127, 127)'});
     d3.selectAll(".row_" + d.country).style({stroke:'rgb(127, 127, 127)'});
                          d3.selectAll(".label_" + (d.country-1)).style("font-size","15px");
                })
              .on('mouseout', function(d){
                  d3.selectAll(".row_" + d.country).style({stroke:'#E6E6E6',});
                  d3.selectAll(".label_" + (d.country-1)).style("font-size","12px");
                })
              .style("fill", "#ffffff")
           

//fill in colours after initial delay - if statement checks for NaNs
          heatMap.transition().duration(1500)
              .style("fill", function(d) { if (isNaN(d.value))
              {return "#FFFFFF";}
              else{return colorScale(d.value);} 
                });
//tooltip
          heatMap.append("title").text(function(d) { return d.value; });
//set up legend              
          var legend = svg.selectAll(".legend")
              //.data([0].concat(colorScale.quantiles()), function(d) { return d; })
              .data([0].concat(colorScale.quantiles()))
              .enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "legendText")
            .text(function(d) { return "> " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize + 3);
//  
//Top Panel selection - handle the buttons first			   
//
          $(".hbutton").click(function() {
          $(".hbutton").removeClass( 'selected' );
            $(this).addClass( 'selected' );

//Check which button was pressed
          var hbuttonID = this.id;

          switch (hbuttonID) {
              case "PMI":
                data.forEach(function(d) {
                d.Nvalue = d.value;
                });
                break;
                
                 case "Inflation":
                data.forEach(function(d) {
                d.Nvalue = d.value2;
                });
                break;
                              }

//update scale for new data 
          var colorScale = d3.scale.quantile()
              .domain([d3.min(data, function (d) { return d.Nvalue; }), d3.max(data, function (d) { return d.Nvalue; })])
              .range(colors);
//transition box colours  
          heatMap.transition()
          .delay(function(d, i) {
        return i * 3;
        })
.duration(1000)
              .style("fill", function(d) { if (isNaN(d.Nvalue))
              {return "#FFFFFF";}
              else{return colorScale(d.Nvalue);} 
                });

//update tooltips                
          svg.selectAll("title").text(function(d) { return d.Nvalue; });          
             svg.selectAll(".legendText")
            .data([0].concat(colorScale.quantiles()))
            .text(function(d) { return "> " + Math.round(+d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height + gridSize + 3);
});
}

