  // Use d3.json() to fetch data from JSON file
  d3.json("samples.json").then(function updatePlotly(data) {
    // console.log(data);
  
  // Create dropdown menu and Assign the value of its option to a variable 
  var nameData = data.names;
  // console.log(nameData);
  d3.select("#selDataset")
    .selectAll("option")
    .data(nameData)
    .enter().append("option")
    .text(function(d) { return `${d}` });
  var dropdownMenu = d3.select("#selDataset");
  var dataset = dropdownMenu.property("value");
  
  // Create Demographic Panel
  var index = nameData.indexOf(dataset);
  d3.select("#sample-metadata").html("");
  d3.select("#sample-metadata");
  var demographicPanel = d3.select("#sample-metadata");    
  var metaDataInfo = data.metadata[index];
  var metaDataInfoPanel = Object.entries(metaDataInfo).forEach(([key,value]) => {
    demographicPanel.append("p").text(`${key}: ${value}`);
  });   
  
  // Assign plot's information
  var sample_values = data.samples[index].sample_values;
  // console.log(sample_values);
  var otu_ids = data.samples[index].otu_ids;
  // console.log(otu_ids);
  var otu_id = otu_ids.slice(0,10).reverse();
  // console.log(otu_id);
  var otu_labels = data.samples[index].otu_labels;
  // console.log(otu_labels);
  var metaDataWfreq = metaDataInfo.wfreq;
  // console.log(metaDataWfreq);

  function init() {

  // Create Horizontal Bar Chart Trace  
  var trace1 = [{
    x: sample_values.slice(0,10).reverse(),
    y: otu_id.map(function(item){return "OTU " + item}),
    text:otu_labels.slice(0,10).reverse(),
    type: "bar",
    orientation: 'h',
    marker:{
      color:'#3a7e41'
    }
  }];
  
  var layout = {
    title:" Top 10 OTUs(operational taxonomic units) ",
    xaxis: {
    title: "values of samples"},
  };

  Plotly.newPlot("bar", trace1, layout);
  
  // Create Bubble Chart Trace
  var trace2 = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
    color: otu_ids,
    colorscale: "Earth",
    size: sample_values  
  }
  }];

  var layout = {
    title: {text: 'Sample Values of each individual samples by OTUs Id', font:{size:20}},
    xaxis: {
    title: "OTU ID"},
  };
  
  Plotly.newPlot("bubble", trace2, layout);

  // Create Gauge Chart Trace

// needle
var degrees = 180 - 20*metaDataWfreq, radius = 0.47;
// console.log(degrees);
var radians = degrees * Math.PI / 180;
// console.log(radians);
var x = radius * Math.cos(radians);
// console.log(x);
var y = radius * Math.sin(radians);
// console.log(y);

  var trace3 = [
    {
      type: "scatter",
      x:[0],y:[0],
      marker: { size: 12, color: "#830308" },
      showlegend: false
  },
    {
    type: 'pie',
    showlegend: false,
    hole: 0.4,
    rotation: 90,
    values: [9,9,9,9,9,9,9,9,9,81],
    text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
    direction: 'clockwise',
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: ["#f8f3ec","#f4f1e5","#e9e6ca","#e5e7b3","#d5e49d","#b7cc92","#8cbf88","#8abb8f","#85b48a","#ffffff"],
      labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
      hoverinfo: 'label'}
  }];

  var layout = {
    shapes: [
      {
        x0:0,y0:0,
        x1:x,y1:y,
        type: "line",
        line: {
          "color": "#830308",
          "width":4
        }
      }
  ],
    title: {text: 'Belly Button Washing Frequency<br> Scrubs per Week', font:{size:17}},
    xaxis: {visible: false, range: [-1, 1]},
    yaxis: {visible: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', trace3, layout)
  }
  init();
  
  // Call updatePlotly() when a change takes place to the DOM
  d3.selectAll("#selDataset").on("change", optionChanged);

  // This function is called when a dropdown menu item is selected
  function optionChanged() {
    var dropdownMenu = d3.select("#selDataset");
    var dataset = dropdownMenu.property("value");
    updatePlotly(data);
  }
  });
  
  
  