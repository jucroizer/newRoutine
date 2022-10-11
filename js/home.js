let params = new URLSearchParams(window.location.search);

let codex;
let newCodex;

if (params.has("code")) {
  codex = params.get("code");
  newCodex = codex.split(".");
}

const fetchData = async () => {
  try {
    const res = await fetch("data/exercice.json");
    let data = await res.json();
    displayData(data);
    displayCit(data);
  } catch (e) {
    console.log("something went wrong!", e);
  }
};

let tabEx = [];
let tabCit = [];
let ocasionRep;
let totalTime = 0;
let currentRoutine = [];
let afficheTime;
let trueChair;
let trueBottle;

function displayData(ex) {
  tabEx = Array.from(ex.exercices);

  ocasionRep = newCodex.splice(0, 1);
  // console.log(ocasionRep);

  newCodex.forEach((e) => {
    for (let ids in tabEx) {
      if (tabEx[ids].id == e) {

        currentRoutine.push(tabEx[ids]);
       // console.log(tabEx[ids]);

        if (tabEx[ids].time == undefined) {
          totalTime += 0;
        } else {
          totalTime += tabEx[ids].time;
        }
        //console.log("je suis le temps total", totalTime);
        for (let equipement in currentRoutine) {
          //console.log(tabEx[equipement].equipement);
          if (currentRoutine[equipement].equipement == "chaise") {
            trueChair = 1;
          } else if (currentRoutine[equipement].equipement == "bouteille") {
          //  console.log(tabEx[equipement].equipement)
            trueBottle = 1;
          }
        }
      }
    }
  });

  // Affichage du temps de la routine sur la page d'accueil
  afficheTime = Math.floor((totalTime % 3600) / 60);

  const heading = document.getElementById("illustration");

  const affichage = document.createElement("div");
  affichage.setAttribute("id", "affichage-totaux");

  const bottleContainer = document.createElement("div");
  bottleContainer.setAttribute('class', 'equipement bottle');

  let bottle;

  if(trueBottle == 1){
    bottle = document.createElement("img");
    bottle.setAttribute('src', 'img/header/bottle-home.svg');
    bottle.setAttribute('class', 'bottle');

    bottleContainer.appendChild(bottle);
  }else{
    bottleContainer.style.display = "none";
  }

  const chairContainer = document.createElement("div");
  chairContainer.setAttribute('class', 'equipement chair');

  let chair;

  if(trueChair == 1){
    chair = document.createElement("img");
    chair.setAttribute('src', 'img/header/chair.-home.svg');
    chair.setAttribute('class', 'chair');

    chairContainer.appendChild(chair);
  }else{
    chairContainer.style.display = "none";
  }

  const timeContainer = document.createElement("div");
  timeContainer.setAttribute("class", "time-container");

  const timeStyle = document.createElement("img");
  timeStyle.setAttribute("src", "img/time.svg");

  const time = document.createElement("p");
  time.setAttribute("class", "time");
  time.innerHTML = afficheTime + '"';

  heading.appendChild(affichage);
  affichage.appendChild(bottleContainer);
  affichage.appendChild(chairContainer);
  affichage.appendChild(timeContainer);
  timeContainer.appendChild(timeStyle);
  timeContainer.appendChild(time);


  let illustration = document.getElementById("phone-illu");
  const totaux = document.getElementById("affichage-totaux");
  let parentDiv = illustration.parentNode;

  parentDiv.insertBefore(totaux, illustration);
}

async function init() {
  // lance la fonction fetchData
  await fetchData();
}

init();

//**
// * Récupération de la date du jour
// */

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();
document.getElementById("current_date").innerHTML =
  day + "/" + month + "/" + year;

let dDate = day + "/" + month + "/" + year;

let tabDateCit = [];
let tabOnlyCit = [];

function getRandomNumber(min, max){
  let step1 = max - min + 1;
  let step2 = Math.random() * step1;
  let result = Math.floor(step2) + min;

  return result;
}

function displayCit(cit){
      
  tabCit = Array.from(cit.citations);

  tabCit.forEach((sent) => {
    //console.log(sent);
    if(sent.date){
      tabDateCit.push(sent);
    }else{
      tabOnlyCit.push(sent.sentence);
    }
  })

  let index = getRandomNumber(0, tabOnlyCit.length - 1);
  console.log(index);

  let titleHeader = document.getElementById('title');

  for(let date = 0; date < tabDateCit.length; date++){
    if(tabDateCit[date].date == dDate){
      titleHeader.textContent = tabDateCit[date].sentence;
    }else{
      titleHeader.textContent = tabOnlyCit[index];
    }
  }
}
