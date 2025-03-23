const ip = "localhost";
const url = `http://${ip}:4000/weatherforecast`;
//substituir o ip de localhost para o ip da maquina onde está o servidor para poder funcionar com
//outros dispositivos na rede também

var isHideSearch = true;



async function main() {
  try {
    //enviar o local como parametro
    var querry = {city: getInput()}


    const data = await Get(url, querry);

    const element = document.getElementById("searchSection");
    element.style.display = "none";
    
    update(data);
    updateTable(data);

  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);

    showError();
  }
}

function showError(){
  const div = document.getElementById("error");
  div.innerHTML = "";

  const element = document.getElementById("searchSection");
  element.style.display = "none";
  isHideSearch = true;

  const erro = document.createElement("p");

  div.style.maxWidth = "900px";
  div.style.textAlign = "center";
  div.style.backgroundColor = "#3e3e3e1a";
  div.style.borderRadius = '15px';
  div.style.margin = "7px";
  div.style.padding = "10px";


  erro.style.margin = "0px";

  erro.textContent = "Erro, não foi possivel conectar ao servidor.";

  div.appendChild(erro);
}

function update(data) {
  const elementsMap = {
    temperatureC: "temperature",
    summary: "summary",
    minTmperature: "min-temp",
    maxTmperature: "max-temp",
    indexUV : "indexUV",
    humidity : "humidity",
    thermalSensation : "thermalSensation"
  };

  for (const [key, id] of Object.entries(elementsMap)) {
    const element = document.getElementById(id);
    if (element && data["today"][key] !== undefined) {
      element.textContent = data["today"][key];
    }
  }

  const erro = document.getElementById("error");
  erro.innerHTML = "";
  erro.style = "none";

  const city = document.getElementById("address");
  const weekDay = document.getElementById("weekDay");

  city.textContent = data["place"]["city"];
  weekDay.textContent = data["today"]["dayOfWeek"];
}

function updateTable(data){
  const elementsMap = {
    dayOfWeek : "dayOfWeek",
    temperatureC: "temperature",
    summary: "summary",
    indexUV : "indexUV",
    humidity : "humidity"
  };

  const tbody = document.getElementById("forecasts");
  tbody.innerHTML = "";

  data["nextDays"].forEach(element => {
    const tRow = document.createElement("tr");
    const svg = document.createElement("img");
    
    for (let key in elementsMap) {
      const tData = document.createElement("td");

      if (key == "temperatureC") {
        tData.textContent = `${element[key]}°`;
      }
      else if (key == "humidity") {
        tData.textContent = `${element[key]}%`;
      }
      else if (key == "summary") {
        svg.src = `./icons/${element[key]}.svg`;
        tData.appendChild(svg);
      }
      
      else{
        tData.textContent = element[key];
      }

      tRow.appendChild(tData);
      
    }

    tbody.appendChild(tRow);
    
  });
  
}

async function Get(url , querry = null) {
  let querryString = "";

  if (querry != null){
    const params = new URLSearchParams(querry);
    querryString = `?${params.toString()}`;
  
}
  const response = await fetch(url+querryString);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}

function ShowSearchSection(){
  if(isHideSearch == false){
    const element = document.getElementById("searchSection");
    element.style.display = "inline-flex";

    isHideSearch = true;
  }
  else{
    const element = document.getElementById("searchSection");
    element.style.display = "none";

    isHideSearch = false;
  }

}

function getInput(){
  const inputValue = document.getElementById("input");
  return inputValue.value;
}

main();
