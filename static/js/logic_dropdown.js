
let url = "/api/population/countries";
d3.json(url).then(function(response){
    window.country_list = [];
    let data = response[0]["data"];
    for (let i=0; i<data.length; i++) {
        country_list.push(data[i]["Country"]);
    }
    country_list.sort();

    jSuites.dropdown(document.getElementById('dropdown'), {
        data: country_list,
        placeholder: "Country",
        autocomplete: true,
        lazyLoading: true,
        multiple: false,
        width: '200px',
});
});