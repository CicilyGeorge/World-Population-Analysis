// Function to plot line graph of country's population over time
function displayLineGraph(populationData, countryName) {

    // Filter populationData to return only data for matching country name
    // i.e. Only returns data for the desired country for line graph
    let countryPopulation = populationData.filter(country => country.Country == countryName);

    // Display population data to console for checking
    // Should be array of length 1
    console.log(countryPopulation);

    // Extract years (keys) and populations (values) from data 
    populationYears = Object.keys(countryPopulation[0]);
    populationAmounts = Object.values(countryPopulation[0]);

    // console.log(populationYears);
    // console.log(populationAmounts);

    // Select the first 10 years of data for the actual population graph
    // Convert year string to number
    // Plot with both lines and markers for each data point
    let lineData_actual = {
        x: populationYears.slice(0,10).map(i => Number(i)),
        y: populationAmounts.slice(0,10),
        name: "Actual",
        type: "scatter",
        mode: "lines+markers"
    };
      
    // console.log(populationYears.slice(0,10).map(i => Number(i)));
    // console.log(populationAmounts.slice(0,10));

    // Select the last three years of data for the predicted population graph
    // Need to select the last data point of the actual population so graphs
    // are continuous
    // Make colour orange and with dotted line to visually differentiate between data sets
    // Plot with both lines and markers for each data point
    let lineData_predicted = {
        x: populationYears.slice(9,12).map(i => Number(i)),
        y: populationAmounts.slice(9,12),
        color: "orange",
        line: { dash: "dot", width: 4 },
        name: "Predicted",
        type: "scatter",
        mode: "lines+markers"
    };

    // console.log(populationYears.slice(9,12).map(i => Number(i)));
    // console.log(populationAmounts.slice(9,12));

    // Place both data sets together in array
    lineData = [lineData_actual, lineData_predicted];

    // Set title for line graph and x and y axes
    let lineLayout = {
         title: countryName + " - Population Actual and Predicted 1970 to 2050",
         xaxis: { title: "Years" },
         yaxis: { title: "Population (thousands (k) / millions (M) / billions (B))" }
    };
    
    // Use plotly to display line graph at div ID "line" with lineData and lineLayout
    Plotly.newPlot('line', lineData, lineLayout);
}

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
        title: "Percentage of World Population - Top 10 Countries and ROW"
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
        console.log(countryPopulations[0]);

        displayLineGraph(countryPopulations, "United States");
        displayPieChart(countryPopulations);

        // Select the ID of the dropdown menu
        // let dropdownMenu = d3.select("#selDataset");

        // Populate the dropdown list with the names/IDs of the subjects
        // Set with HTML tag <option>, attribute of the name/ID and text display of the name/ID
        // data.names.forEach(nameID => {
        //     dropdownMenu.append("option").attr("value", nameID).text(nameID);
        // });
        
    // Initialise page with demographic information and plots for first subject in dataset    
    // displayDemoInfo(data.names[0]);
    // displayPlots(data.names[0])

  });
  
}

// Call initialisation function
init();