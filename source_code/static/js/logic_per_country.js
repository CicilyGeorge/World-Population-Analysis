
// Variables to get population data, birth rates, death rates, sex ratios from JSON URLs
// Made global for ease of coding after previous development
var countryPopulations;
var countryBirthRates;
var countryDeathRates;
var countrySexRatios;

// Rounding function to round number to specified number of decimal places
// https://gist.github.com/djD-REK/2e347f5532bb22310daf450f03ec6ad8
const roundOne = (n, d) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d)

// Function to plot line graph of country's population over time
function displayLineGraph_Population(populationData, countryName) {

    // Filter populationData to return only data for matching country name
    // i.e. Only returns data for the desired country for line graphs
    let countryPopulation = populationData.filter(country => country.Country == countryName);

    // Display population data to console for checking
    // Should be array of length 1
    // console.log(countryPopulation);

    // Extract years (keys) and populations (values) from data 
    populationYears = Object.keys(countryPopulation[0]);
    populationAmounts = Object.values(countryPopulation[0]);
    // Converting 0 values to null
    if(populationAmounts.indexOf(0) !== -1) {
        for (let j=0; j < populationAmounts.length; j++) {
            populationAmounts.splice(populationAmounts.indexOf(0), 1, null);
        }
    }
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

    // Place both data sets together in array
    let lineData = [lineData_actual, lineData_predicted];

    // Set title for line graph and x and y axes
    let lineLayout = {
         title: countryName + " - Population Actual and Predicted 1970 to 2050",
         xaxis: { title: "Years" },
         yaxis: { title: "Population (thousands(k)/ millions(M)/ billions(B))" }
    };
    
    // Use plotly to display line graph at div ID "line2" with lineData and lineLayout
    Plotly.newPlot('line1', lineData, lineLayout);
}


// Function to plot line graph of country's birth rates over time
function displayLineGraph_BirthRates(birthRatesData, countryName) {

    // Filter birthRatesData to return only data for matching country name
    // i.e. Only returns data for the desired country for line graphs
    let countryBirthRate = birthRatesData.filter(country => country.Country == countryName);

    // Display birth rate data to console for checking
    // Should be array of length 1
    // If array is of length 0, no data recorded for this country
    // Set lists to be empty
    // Results in empty plot
    if (countryBirthRate.length == 0) {
        birthRatesYears = [];
        birthRatesAmounts = [];
    }
    else {
        // console.log(countryBirthRate);
        // Extract years (keys) and birth rates (values) from data 
        birthRatesYears = Object.keys(countryBirthRate[0]);
        birthRatesAmounts = Object.values(countryBirthRate[0]);
        // Converting 0 values to null
        if(birthRatesAmounts.indexOf(0) !== -1) {
            for (let j=0; j < birthRatesAmounts.length; j++) {
                birthRatesAmounts.splice(birthRatesAmounts.indexOf(0), 1, null);
            }
        }
        // console.log(birthRatesAmounts);

    }
    
    // Select the first 10 elements of data for the birth rates
    // Convert year string to number
    // Plot with both lines and markers for each data point
    let lineData_birthRates = {
        x: birthRatesYears.slice(0,10).map(i => Number(i)),
        y: birthRatesAmounts.slice(0,10),
        line: { color: "green"},
        markers: { color: "green" },
        name: "Birth Rate",
        type: "scatter",
        mode: "lines+markers"
    };
      
    // Place data set in array
    let lineData = [lineData_birthRates];

    // Set title for line graph and x and y axes
    let lineLayout = {
         title: countryName + " - Birth Rates 1960 to 2018",
         xaxis: { title: "Years" },
         yaxis: { title: "Birth Rate (per 1000 people)" }
    };
    
    // Use plotly to display line graph at div ID "line2" with lineData and lineLayout
    Plotly.newPlot('line2', lineData, lineLayout);
}

// Function to plot line graph of country's death rates over time
function displayLineGraph_DeathRates(deathRatesData, countryName) {

    // Filter deathRatesData to return only data for matching country name
    // i.e. Only returns data for the desired country for line graphs
    let countryDeathRate = deathRatesData.filter(country => country.Country == countryName);

    // Display death rate data to console for checking
    // Should be array of length 1
    // If array is of length 0, no data recorded for this country
    // Set lists to be empty
    // Results in empty plot
    if (countryDeathRate.length == 0) {
        deathRatesYears = [];
        deathRatesAmounts = [];
    }
    else {
        // console.log(countryDeathRate);
        // Extract years (keys) and death rates (values) from data 
        deathRatesYears = Object.keys(countryDeathRate[0]);
        deathRatesAmounts = Object.values(countryDeathRate[0]);
        // Converting 0 values to null
        if(deathRatesAmounts.indexOf(0) !== -1) {
            for (let j=0; j < deathRatesAmounts.length; j++) {
                deathRatesAmounts.splice(deathRatesAmounts.indexOf(0), 1, null);
            }
        }
    }

    // Select the first 10 elements of data for the death rates
    // Convert year string to number
    // Plot with both lines and markers for each data point
    let lineData_deathRates = {
        x: deathRatesYears.slice(0,10).map(i => Number(i)),
        y: deathRatesAmounts.slice(0,10),
        line: { color: "gray"},
        markers: { color: "gray" },
        name: "Death Rate",
        type: "scatter",
        mode: "lines+markers"
    };
      
    // Place data set in array
    let lineData = [lineData_deathRates];

    // Set title for line graph and x and y axes
    let lineLayout = {
         title: countryName + " - Death Rates 1960 to 2018",
         xaxis: { title: "Years" },
         yaxis: { title: "Death Rate (per 1000 people)" }
    };
    
    // Use plotly to display line graph at div ID "line3" with lineData and lineLayout
    Plotly.newPlot('line3', lineData, lineLayout);
}

// Function to plot line graph of country's death rates over time
function displayLineGraph_SexRatios(sexRatiosData, countryName) {

    // Filter sexRatiosData to return only data for matching country name
    // i.e. Only returns data for the desired country for line graphs
    let countrySexRatio = sexRatiosData.filter(country => country.Country == countryName);

    // Display sex ratio data to console for checking
    // Should be array of length 1
    // If array is of length 0, no data recorded for this country
    // Set lists to be empty
    // Results in empty plot
    if (countrySexRatio.length == 0) {
        sexRatiosYears = [];
        sexRatiosAmounts = [];
    }
    else {
        // console.log(countrySexRatio);
        // Extract years (keys) and sex ratios (values) from data 
        sexRatiosYears = Object.keys(countrySexRatio[0]);
        sexRatiosAmounts = Object.values(countrySexRatio[0]);
        // Converting 0 values to null
        if(sexRatiosAmounts.indexOf(0) !== -1) {
            for (let j=0; j < sexRatiosAmounts.length; j++) {
                sexRatiosAmounts.splice(sexRatiosAmounts.indexOf(0), 1, null);
            }
        }
    }
    
    // Select the first 10 elements of data for the sex ratios
    // Convert year string to number
    // Plot with both lines and markers for each data point
    let lineData_sexRatios = {
        x: sexRatiosYears.slice(0,10).map(i => Number(i)),
        y: sexRatiosAmounts.slice(0,10),
        line: { color: "pink"},
        markers: { color: "pink" },
        name: "Sex Ratio",
        type: "scatter",
        mode: "lines+markers"
    };
      
    // Place data set in array
    let lineData = [lineData_sexRatios];

    // Set title for line graph and x and y axes
    let lineLayout = {
         title: countryName + " - Biological Sex Ratios 1962 to 2018",
         xaxis: { title: "Years" },
         yaxis: { title: "Sex Ratio (females at birth per 1 male at birth)" }
    };
    
    // Use plotly to display line graph at div ID "line4" with lineData and lineLayout
    Plotly.newPlot('line4', lineData, lineLayout);
}

// Call function to update displays of plots
// when the dropdown menu selection is changed
d3.selectAll("dropdown").on("change", optionChanged);

// Function to display plots from a country from dropdown menu selection
function optionChanged() {

    // Assign dropdown menu to variable using D3 and ID for menu given in HTML
    let dropdownMenu = d3.select("#dropdown");

    // Assign the value of the country dropdown menu option to a variable
    let country = dropdownMenu.property("value");
    
    // Clear the already displayed country
    d3.select("#country").html("");

    // Display the selected country in the countries page using header tag h3
    d3.select("#country").insert("h3").text(country);

    // Display the country selected from the dropdown menu to console
    // console.log(dropdownMenu.property("value"));

    // Display the graphs for the desired country
    displayLineGraph_Population(countryPopulations, country);
    displayLineGraph_BirthRates(countryBirthRates, country);
    displayLineGraph_DeathRates(countryDeathRates, country);
    displayLineGraph_SexRatios(countrySexRatios, country)

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

        // Display line graph of actual and predicted population for Australia
        displayLineGraph_Population(countryPopulations, "Australia");

    });

    // Name and path to JSON file with dataset for countries birth rates
    let birthrateURL = "/api/population/birth";

    // Read in JSON from URL
    d3.json(birthrateURL).then(function(data) {
    
        // Assign the birth rate data for all countries to variable countryBirthRates
        countryBirthRates = data[0].data;

        // Display first country's birth rates to console for checking
        // Countries are in ranked order of population
        // console.log(countryBirthRates[0]);

        // Display line graph of birth rates for Australia
        displayLineGraph_BirthRates(countryBirthRates, "Australia");

    });

    // Name and path to JSON file with dataset for countries death rates
    let deathrateURL = "/api/population/death";

    // Read in JSON from URL
    d3.json(deathrateURL).then(function(data) {
        
        // Assign the death rate data for all countries to variable countryDeathRates
        countryDeathRates = data[0].data;
    
        // Display first country's death rates to console for checking
        // Countries are in ranked order of population
        // console.log(countryDeathRates[0]);
    
        // Display line graph of death rates for Australia
        displayLineGraph_DeathRates(countryDeathRates, "Australia");
    
    });
    
    // Name and path to JSON file with dataset for countries sex ratios
    let sexratioURL = "/api/population/sex-ratio";

    // Read in JSON from URL
    d3.json(sexratioURL).then(function(data) {
        
        // Assign the sex ratio data for all countries to variable countrySexRatios
        countrySexRatios = data[0].data;
    
        // Display first country's sex ratios to console for checking
        // Countries are in ranked order of population
        // console.log(countrySexRatios[0]);
    
        // Display line graph of sex ratios for Australia
        displayLineGraph_SexRatios(countrySexRatios, "Australia");
    
    });

}

// Call initialisation function
init();