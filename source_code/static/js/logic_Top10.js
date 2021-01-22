
// Variable to get population data from JSON URL
// Made global for ease of coding after previous development
var countryPopulations;

// Rounding function to round number to specified number of decimal places
// https://gist.github.com/djD-REK/2e347f5532bb22310daf450f03ec6ad8
const roundOne = (n, d) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d)

// Function to display pie chart of Top 10 countries and their percentage of the
// world population, with ROW being the percentage of the rest of the world
function displayPieChart(populationData) {

    // Country data is in order, so the Top 10 countries by population
    // respresents the first 10 values of populationData
    countriesTop10 = populationData.slice(0,10);

    // Set up empty lists to hold percentages and countries for pie chart
    countriesPercent = [];
    countriesList = [];

    // Loop through Top 10 countries, converting number to percentage and
    // rounding to 2 decimal places
    // Add this number and the country to the lists
    for (let i=0; i<countriesTop10.length; i++) {

        let countryPercent = roundOne(countriesTop10[i].WorldPercentage * 100,2);
        countriesPercent.push(countryPercent);
        countriesList.push(countriesTop10[i].Country);

    }   

    // Calculate the percentage of the world population for the rest of the world's countries
    // Rounded to 2 decimal places
    rowPercent = roundOne(100 - (countriesPercent.reduce((a, b) => a + b)),2);

    // Add the ROW to the lists
    countriesPercent.push(rowPercent);
    countriesList.push("Rest of World");

    // Display lists to console for checking purposes
    // console.log(countriesPercent);
    // console.log(countriesList);

    // Set up data for pie chart, with the values being the percentages
    // and the countries the labels
    var pieData = [{
        values: countriesPercent,
        labels: countriesList,
        hoverinfo: 'label+percent',
        type: 'pie'
    }];
  
    // Give pie chart a title
    var pieLayout = {
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)"
    };
  
    // Use plotly to display pie chart div ID "pie" with pieData and pieLayout
    Plotly.newPlot('pie', pieData, pieLayout);

}

// Initialisation function
function init() {

    // Name and path to JSON file with dataset 
    let countriesURL = "/api/population/countries";

    // Read in JSON from URL
    d3.json(countriesURL).then(function(data) {
    
        // Assign the population data for all countries to variable countryPopulations
        countryPopulations = data[0].data;

        // Display first country's to console for checking
        // Countries are in ranked order of population
        // console.log(countryPopulations[0]);

        displayPieChart(countryPopulations);
        
  });
  
}

// Call initialisation function
init();