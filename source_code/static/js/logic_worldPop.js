function formatNumber(num) {
    if (num != undefined){
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
  }
  
  
  // World Total Population 2020 to display on top of the page
  //////////////////////////////////////////////////////////
  let urlWorld = "/api/population/world";
  // reading World Api json
  d3.json(urlWorld).then(function(dataWorld){
    let datapop = dataWorld[0].data;
    let worldPop =1234;
    for(let i=0;i<datapop.length;i++){
      if(datapop[i].year == "2020"){
        worldPop = formatNumber(datapop[i].Population);
      }
    }
    d3.select("#total_pop").insert("h3").text(worldPop);
  });
  