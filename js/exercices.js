//**
// * Récupération des elements de l'URL et affichage des exercices
// */
let params = new URLSearchParams(window.location.search);

let codex;
let newCodex;
let home;
let index = 0;
const emojis = ["🥳", "🎉"];

if (params.has("code")) {
  codex = params.get("code");
  newCodex = codex.split(".");
}

const fetchData = async () => {
  try {
    const res = await fetch("data/exercice.json");
    let data = await res.json();
    displayData(data);
  } catch (e) {
    console.log("something went wrong!", e);
  }
};

let tabEx = [];
let ocasionRep;
let routineTab = [];
let occasionTab = [];

function displayData(ex) {
  tabEx = Array.from(ex.exercices);

  ocasionRep = newCodex.splice(0, 1);
  console.log(ocasionRep);

  // newCodex est le tableau qui contient chaque éléments de l'URL
  console.log(newCodex);

  const workSelec = document.querySelector('input[id="workSelec"]');
  const homeSelec = document.querySelector('input[id="homeSelec"]');
  const occasionalSelec = document.querySelector('input[id="occasionalSelec"]');

  let workCheck = workSelec.checked;
  let homeCheck = homeSelec.checked;
  let occasionalCheck = occasionalSelec.checked;
  let isPurelyOccasionnal = !workCheck && !homeCheck && occasionalCheck;

  let skip = false;

  for (let i = 0; i < newCodex.length; i++) {
    let exos = newCodex[i];

    if (exos.includes("W")) {
      skip = !workCheck;
    } else if (exos.includes("H")) {
      skip = !homeCheck;

      if (!skip) {
        home = routineTab.length;
      }
    } else if (exos == "B") {
      if (!skip) {
        routineTab.push("-1");
      }
    } else if (exos.includes("E")) {
      if (occasionalCheck) {
        // the if is splitted to force exiting the cases enumerations
        if (!skip || isPurelyOccasionnal) {
          const eIds = exos.replace(/E/g, "");

          for (let ids in tabEx) {
            if (tabEx[ids].id == eIds) {
              routineTab.push(tabEx[ids]);
              occasionTab.push(tabEx[ids]);
            }
          }
        }
      }
    } else {
      if (!skip) {
        for (let ids in tabEx) {
          if (tabEx[ids].id == exos) {
            routineTab.push(tabEx[ids]);
          }
        }
      }
    }
  }

  console.log(occasionTab);
  routineDisplay(routineTab);
}

async function init() {
  // lance la fonction fetchData
  await fetchData();
}

const btnRoutine = document.getElementById("btn-routine");

// au click sur le bouton "Ma séance" appel de la fonction selectDisplay
btnRoutine.addEventListener("click", selectDisplay);

// Fonction d'affichage du formulaire au click sur "Ma Séance"
function selectDisplay() {
  const lightbox = document.createElement("div");
  lightbox.setAttribute("id", "body-form");

  const lightboxContainer = document.createElement("div");
  lightboxContainer.setAttribute("class", "container-form");

  const closeDiv = document.createElement("div");
  closeDiv.setAttribute("class", "container-close");
  const closeBtn = document.createElement("img");
  closeBtn.setAttribute("src", "img/page exercice/closeBtn.svg");

  const formContainer = document.createElement("form");
  const formFieldset = document.createElement("fieldset");
  const formLegend = document.createElement("legend");
  formLegend.textContent = "Quelle sera votre séance du jour ?";
  const legendP = document.createElement("p");
  legendP.textContent = "Veuillez sélectionner une ou plusieurs options.";

  const formDivWork = document.createElement("div");
  formDivWork.setAttribute("class", "work-container")
  formDivWork.style.marginTop = "2em";
  formDivWork.style.marginBottom = "1em";
  const inputWork = document.createElement("input");
  inputWork.setAttribute("type", "checkbox");
  inputWork.setAttribute("id", "workSelec");
  inputWork.setAttribute("name", "workSelec");
  const labelWork = document.createElement("label");
  labelWork.setAttribute("for", "workSelec");
  labelWork.textContent = "Au travail";

  const formDivHome = document.createElement("div");
  formDivHome.setAttribute("class", "home-container");
  formDivHome.style.marginBottom = "1em";
  const inputHome = document.createElement("input");
  inputHome.setAttribute("type", "checkbox");
  inputHome.setAttribute("id", "homeSelec");
  inputHome.setAttribute("name", "homeSelec");
  const labelHome = document.createElement("label");
  labelHome.setAttribute("for", "homeSelec");
  labelHome.textContent = "À la maison";

  const formDivOccasional = document.createElement("div");
  formDivOccasional.setAttribute("class", "occasionnal-container");
  formDivOccasional.style.marginBottom = "3em";
  const inputOccasional = document.createElement("input");
  inputOccasional.setAttribute("type", "checkbox");
  inputOccasional.setAttribute("id", "occasionalSelec");
  inputOccasional.setAttribute("name", "occasionalSelec");
  const labelOccasional = document.createElement("label");
  labelOccasional.setAttribute("for", "occasionalSelec");
  labelOccasional.textContent = "Occasionnelle";

  const formDivBtn = document.createElement("div");
  formDivBtn.style.textAlign = "center";
  const buttonForm = document.createElement("button");
  buttonForm.setAttribute("type", "button");
  buttonForm.setAttribute("id", "button-form");
  buttonForm.textContent = "Commencer 💪";
  buttonForm.style.width = "fit-content";
  buttonForm.style.padding = "1em";
  buttonForm.style.borderRadius = "10px";
  buttonForm.style.color = "#FEFFFF";
  buttonForm.style.fontSize = "1.1em";
  buttonForm.style.border = "none";
  buttonForm.style.background = "linear-gradient(to right,#FFB600, #012840)";
  buttonForm.style.fontWeight = "600";
  buttonForm.style.cursor = "pointer";

  lightbox.appendChild(lightboxContainer);

  lightboxContainer.appendChild(closeDiv);
  closeDiv.appendChild(closeBtn);

  lightboxContainer.appendChild(formContainer);
  formContainer.appendChild(formFieldset);
  formFieldset.appendChild(formLegend);
  formFieldset.appendChild(legendP);

  formFieldset.appendChild(formDivWork);
  formDivWork.appendChild(inputWork);
  formDivWork.appendChild(labelWork);

  formFieldset.appendChild(formDivHome);
  formDivHome.appendChild(inputHome);
  formDivHome.appendChild(labelHome);

  formFieldset.appendChild(formDivOccasional);
  formDivOccasional.appendChild(inputOccasional);
  formDivOccasional.appendChild(labelOccasional);

  formFieldset.appendChild(formDivBtn);
  formDivBtn.appendChild(buttonForm);

  // insertion de la lightbox dans le DOM
  document.body.appendChild(lightbox);

  // event listenner fermeture de la modale
  closeBtn.addEventListener("click", close);

  // event listenner lancemnet de la routine
  const btn = document.getElementById("button-form");
  console.log(btn);

  btn.addEventListener("click", init);
}



// Fonction d'affichage de la lightbox contenant la routine
function routineDisplay(e) {
  const lightbox = document.createElement("div");
  lightbox.setAttribute("id", "body-exercices");

  const lightboxContainer = document.createElement("div");

  const lightboxHeader = document.createElement("header");

  const headerHeadband = document.createElement("img");
  headerHeadband.setAttribute("class", "headband");
  headerHeadband.setAttribute(
    "src",
    "img/page exercice/header/header-yellow.svg"
  );
  

  const headerLogo = document.createElement("div");
  headerLogo.setAttribute("class", "logo-header");

  const logo = document.createElement("img");
  logo.setAttribute("src", "img/logo/logo-omnes.svg");
  logo.setAttribute("alt", "logo matvisio");

  const progressBar = document.createElement("div");
  progressBar.setAttribute("class", "progress-bar");

  const progress = document.createElement("div");
  progress.setAttribute("class", "progress");
  progress.setAttribute("id", "progress");

  const containerBar = document.createElement("div");
  containerBar.setAttribute("class", "container-bar");

  let bar;
  bar = document.createElement("div");
  bar.setAttribute("class", "bar active");

  containerBar.appendChild(bar);

  for (let i = 1; i < e.length; i++) {
    bar = document.createElement("div");
    bar.setAttribute("class", "bar");

    if (e[i] == "-1") {
      let icon = document.createElement("img");
      icon.setAttribute(
        "src",
        "img/page exercice/self_improvement_FILL0_wght400_GRAD0_opsz48.svg"
      );
      icon.setAttribute("class", "icon-pause");
      bar.classList.add("pause");
      bar.appendChild(icon);
    }
    containerBar.appendChild(bar);
  }

  const recommandations = document.createElement("div");
  recommandations.setAttribute("class", "recommandation");

  const recommandationsP = document.createElement("p");
  recommandationsP.textContent =
    "N’oubliez pas de vous hydrater tout au long de la séance.";

  const recommandationsDrink = document.createElement("img");
  recommandationsDrink.setAttribute(
    "src",
    "img/page exercice/header/water.svg"
  );

  let containerMod = document.createElement("section");
  containerMod.setAttribute("id", "container-modif");

  let exerciceVideo;

  let boxTitleExercice = document.createElement("div");
  boxTitleExercice.setAttribute("class", "exercice-title");

  let typeExercice;

  let titleExercice;

  // exerciceVideo = document.createElement("video");
  // exerciceVideo.setAttribute("id", `${e[0].id}`);
  // exerciceVideo.setAttribute("src", `${e[0].video}`);
  // exerciceVideo.setAttribute("controls", "controls");
  // exerciceVideo.setAttribute("class", "exercice-video");

  exerciceVideo = document.createElement("iframe");
  exerciceVideo.setAttribute("id", `${e[0].id}`);
  exerciceVideo.setAttribute("src", `${e[0].video}`);
  exerciceVideo.setAttribute("class", "exercice-video");
  exerciceVideo.setAttribute("allowfullscreen", "allowfullscreen");


  typeExercice = document.createElement("p");
  typeExercice.setAttribute("class", "p-type");
  typeExercice.textContent = `${e[0].type}`;

  titleExercice = document.createElement("p");
  titleExercice.setAttribute("class", " p-title");
  titleExercice.textContent = `${e[0].name}`;

  const divNext = document.createElement("div");
  divNext.setAttribute("class", "arrow-container-next");

  const next = document.createElement("input");
  next.setAttribute("id", "next-btn");
  next.setAttribute("type", "button");
  next.setAttribute("aria-label", "next image");
  next.textContent = "next";

  const nextArrow = document.createElement("img");
  nextArrow.setAttribute("id", "next");
  nextArrow.setAttribute("src", "img/page exercice/arrow.svg");

  const instructionBox = document.createElement("div");
  instructionBox.setAttribute("class", "instructions");

  const whereBox = document.createElement("div");
  whereBox.setAttribute("class", "where");

  const whereImg = document.createElement("img");
  whereImg.setAttribute("src", "img/page exercice/header/work.svg");

  // const whereP = document.createElement("p");
  // whereP.textContent = "Cette session est à réaliser au bureau.";

  const withBox = document.createElement("div");
  withBox.setAttribute("class", "with");

  // const withP = document.createElement("p");
  // withP.textContent = "Pour cet exercice vous aurez besoin :";

  const withImg = document.createElement("img");
  withImg.setAttribute("src", "img/page exercice/Chair.svg");

  if (e[0].equipement == "bouteille") {
    withImg.setAttribute("src", "img/page exercice/bottle.svg");
  } else if (e[0].equipement == "chaise") {
    withImg.setAttribute("src", "img/page exercice/Chair.svg");
  } else {
    withBox.style.display = "none";
  }

  const imgBox = document.createElement("div");
  imgBox.setAttribute("class", "img-container");
  imgBox.setAttribute("role", "img");

  if (index >= home) {
    headerHeadband.setAttribute(
      "src",
      "img/page exercice/header/header-blue.svg"
    );
    // whereP.textContent = "Cette session est à réaliser à la maison.";
    whereImg.setAttribute("src", "img/page exercice/home.svg");
  }

  for(let i = 0; i < e.length; i++){
    if(e[i] == occasionTab[i]){
      headerHeadband.setAttribute(
        "src",
        "img/page exercice/header/header-green.svg"
      );
      whereImg.setAttribute("src", "img/page exercice/sometimes.svg");
      whereImg.setAttribute("class", "occasional-icon");
      whereBox.setAttribute("class", "where occasionnal-box");
    }
  }

  lightbox.appendChild(lightboxContainer);
  lightboxContainer.appendChild(progressBar);
  progressBar.appendChild(progress);
  progressBar.appendChild(containerBar);

  lightboxContainer.appendChild(lightboxHeader);
  lightboxHeader.appendChild(headerHeadband);
  lightboxHeader.appendChild(headerLogo);
  headerLogo.appendChild(logo);

  lightboxContainer.appendChild(containerMod);
  containerMod.appendChild(exerciceVideo);
  lightboxContainer.appendChild(boxTitleExercice);
  boxTitleExercice.appendChild(typeExercice);
  boxTitleExercice.appendChild(titleExercice);

  lightboxContainer.appendChild(instructionBox);
  instructionBox.appendChild(whereBox);
  whereBox.appendChild(whereImg);
  // whereBox.appendChild(whereP);
  instructionBox.appendChild(withBox);
  // withBox.appendChild(withP);
  withBox.appendChild(withImg);

  lightboxContainer.appendChild(recommandations);
  recommandations.appendChild(recommandationsP);
  recommandations.appendChild(recommandationsDrink);

  lightboxContainer.appendChild(divNext);
  divNext.appendChild(next);
  divNext.appendChild(nextArrow);

  // insertion de la lightbox dans le DOM
  document.body.appendChild(lightbox);

  const progBar = document.querySelectorAll(".bar");
  let currentActive = 1;
  const nextMediaBtn = document.getElementById("next");
  nextMediaBtn.addEventListener("click", nextMed);

  // Fonction de passage au média suivant
  function nextMed() {
    index++;
    currentActive++;
    if (currentActive > progBar.length) {
      currentActive = progBar.length;
    }
    load();
    update();
  }

  function prevMed() {
    index--;
    currentActive--;
    if (currentActive < 1) {
      currentActive = 1;
    }
    load();
    update();
  }

  function load() {
    let nextExercice = routineTab[index];

    let tabLenght = routineTab.length;

    if (nextExercice == "-1") {
      const actives = document.querySelectorAll(".active");
      const allBar = document.querySelectorAll(".bar");

      let removeLightbox = document.getElementById("body-exercices");
      removeLightbox.innerHTML = " ";

      lightbox.style.backgroundColor = "#012840";

      const headerLogo = document.createElement("div");
      headerLogo.setAttribute("class", "logo-pause");
      headerLogo.style.width = "100%";
      headerLogo.style.margin = "2em 1em 2em 3em";

      const logo = document.createElement("img");
      logo.setAttribute("src", "img/page exercice/logo-omnes-cmAsset 1.svg");
      logo.setAttribute("alt", "logo matvisio");
      logo.style.width = "20%";

      const divNext = document.createElement("div");
      divNext.setAttribute("class", "arrow-container-next");

      const next = document.createElement("input");
      next.setAttribute("id", "next-btn");
      next.setAttribute("type", "button");
      next.setAttribute("aria-label", "next image");
      
      const nextArrow = document.createElement("img");
      nextArrow.setAttribute("id", "next");
      nextArrow.setAttribute("src", "img/page exercice/arrow.svg");

      const divPrev = document.createElement("div");
      divPrev.setAttribute("class", "arrow-container-prev");

      const previous = document.createElement("input");
      previous.setAttribute("id", "previous-btn");
      previous.setAttribute("type", "button");
      previous.setAttribute("aria-label", "previous image");

      const prevArrow = document.createElement("img");
      prevArrow.setAttribute("id", "prev");
      prevArrow.setAttribute("src", "img/page exercice/arrow.svg");

      const containerPause = document.createElement("div");
      containerPause.setAttribute("class", "container-pause");

      const pEnd = document.createElement("p");
      pEnd.textContent = "Cette session est terminée.";

      const pTime = document.createElement("p");
      pTime.textContent =
        "Vous avait réalisé " +
        Math.round(((actives.length - 1) / (allBar.length - 1)) * 100) +
        "%" +
        " de votre séance pour aujoud’hui !";

      const clap = document.createElement("img");
      clap.setAttribute("src", "img/page exercice/clap.svg");
      clap.setAttribute("class", "clap");

      removeLightbox.appendChild(headerLogo);
      headerLogo.appendChild(logo);

      removeLightbox.appendChild(divNext);
      divNext.appendChild(next);
      divNext.appendChild(nextArrow);
      removeLightbox.appendChild(divPrev);
      divPrev.appendChild(previous);
      divPrev.appendChild(prevArrow);

      removeLightbox.appendChild(containerPause);
      containerPause.appendChild(pEnd);
      containerPause.appendChild(pTime);

      removeLightbox.appendChild(clap);

      const nextMediaBtn = document.getElementById("next");
      const prevMediaBtn = document.getElementById("prev");

      // au clique sur l'un des boutons prev ou next déclenchement de la fonction prevMed ou nextMed
      prevMediaBtn.addEventListener("click", prevMed);
      nextMediaBtn.addEventListener("click", nextMed);
    } else if (index == tabLenght) {
      //console.log("the last", index);
      const removeLightboxEnd = document.getElementById("body-exercices");
      removeLightboxEnd.innerHTML = " ";

      lightbox.style.backgroundColor = "#012840";

      const headerLogo = document.createElement("div");
      headerLogo.setAttribute("class", "logo-pause");
      headerLogo.style.width = "100%";
      headerLogo.style.margin = "2em 1em 2em 3em";

      const logo = document.createElement("img");
      logo.setAttribute("src", "img/page exercice/logo-omnes-cmAsset 1.svg");
      logo.setAttribute("alt", "logo matvisio");
      logo.style.width = "20%";

      const containerP = document.createElement("div");
      containerP.setAttribute("class", "container-end");

      const pEnd = document.createElement("p");
      pEnd.textContent =
        "Félicitation ! Vous avez fini toute vos sessions du jour !";
      pEnd.style.color = "#000000";
      pEnd.style.textAlign = "center";
      pEnd.style.zIndex = "100";

      let containerSlot = document.createElement("div");
      containerSlot.setAttribute("class", "slot");

      removeLightboxEnd.appendChild(headerLogo);
      headerLogo.appendChild(logo);

      removeLightboxEnd.appendChild(containerP);
      containerP.appendChild(pEnd);

      removeLightboxEnd.appendChild(containerSlot);

      // creation des confettis et affichage
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        containerSlot.appendChild(confetti);
      }
      // animation des confettis
      animateConfettis();
    } else {
      const removeLightboxEx = document.getElementById("body-exercices");
      removeLightboxEx.innerHTML = " ";
      // lightboxContainer = document.createElement("div");
      lightbox.style.backgroundColor = "#F9F9FA";

      const lightboxContainer = document.createElement("div");

      const lightboxHeader = document.createElement("header");

      let headerHeadband = document.createElement("img");
      headerHeadband.setAttribute("class", "headband");
      headerHeadband.setAttribute(
        "src",
        "img/page exercice/header/header-yellow.svg"
      );

      const headerLogo = document.createElement("div");
      headerLogo.setAttribute("class", "logo-header");

      const logo = document.createElement("img");
      logo.setAttribute("src", "img/logo/logo-omnes.svg");
      logo.setAttribute("alt", "logo matvisio");

      const progressBar = document.createElement("div");
      progressBar.setAttribute("class", "progress-bar");

      const progress = document.createElement("div");
      progress.setAttribute("class", "progress");
      progress.setAttribute("id", "progress");

      const containerBar = document.createElement("div");
      containerBar.setAttribute("class", "container-bar");

      let bar;
      bar = document.createElement("div");
      bar.setAttribute("class", "bar active");

      containerBar.appendChild(bar);

      for (let i = 1; i < e.length; i++) {
        bar = document.createElement("div");
        bar.setAttribute("class", "bar");

        if (e[i] == "-1") {
          let icon = document.createElement("img");
          icon.setAttribute(
            "src",
            "img/page exercice/self_improvement_FILL0_wght400_GRAD0_opsz48.svg"
          );
          icon.setAttribute("class", "icon-pause");
          bar.classList.add("pause");
          bar.appendChild(icon);
        }

        containerBar.appendChild(bar);
      }

      const recommandations = document.createElement("div");
      recommandations.setAttribute("class", "recommandation");

      const recommandationsP = document.createElement("p");
      recommandationsP.textContent =
        "N’oubliez pas de vous hydrater tout au long de la séance.";

      const recommandationsDrink = document.createElement("img");
      recommandationsDrink.setAttribute(
        "src",
        "img/page exercice/header/water.svg"
      );

      let containerMod = document.createElement("section");
      containerMod.setAttribute("id", "container-modif");

      let exerciceVideo;

      let boxTitleExercice = document.createElement("div");
      boxTitleExercice.setAttribute("class", "exercice-title");

      let typeExercice;

      let titleExercice;

      exerciceVideo = document.createElement("iframe");
      exerciceVideo.setAttribute("id", `${nextExercice.id}`);
      exerciceVideo.setAttribute("src", `${nextExercice.video}`);
      exerciceVideo.setAttribute("controls", "controls");
      exerciceVideo.setAttribute("class", "exercice-video");
      exerciceVideo.setAttribute("allowfullscreen", "allowfullscreen");

      typeExercice = document.createElement("p");
      typeExercice.setAttribute("class", "p-type");
      typeExercice.textContent = `${nextExercice.type}`;

      titleExercice = document.createElement("p");
      titleExercice.setAttribute("class", " p-title");
      titleExercice.textContent = `${nextExercice.name}`;

      const divNext = document.createElement("div");
      divNext.setAttribute("class", "arrow-container-next");

      const next = document.createElement("input");
      next.setAttribute("id", "next-btn");
      next.setAttribute("type", "button");
      next.setAttribute("aria-label", "next image");
      next.textContent = "next";

      const nextArrow = document.createElement("img");
      nextArrow.setAttribute("id", "next");
      nextArrow.setAttribute("src", "img/page exercice/arrow.svg");

      const divPrev = document.createElement("div");
      divPrev.setAttribute("class", "arrow-container-prev");

      const previous = document.createElement("input");
      previous.setAttribute("id", "previous-btn");
      previous.setAttribute("type", "button");
      previous.setAttribute("aria-label", "previous image");

      const prevArrow = document.createElement("img");
      prevArrow.setAttribute("id", "prev");
      prevArrow.setAttribute("src", "img/page exercice/arrow.svg");

      if (index == "0") {
        divPrev.style.display = "none";
      }

      const instructionBox = document.createElement("div");
      instructionBox.setAttribute("class", "instructions");

      const whereBox = document.createElement("div");
      whereBox.setAttribute("class", "where");

      const whereImg = document.createElement("img");
      whereImg.setAttribute("src", "img/page exercice/header/work.svg");

      // const whereP = document.createElement("p");
      // whereP.textContent = "Cette session est à réaliser au bureau.";

      const withBox = document.createElement("div");
      withBox.setAttribute("class", "with");

      // const withP = document.createElement("p");
      // withP.textContent = "Pour cet exercice vous aurez besoin :";

      const withImg = document.createElement("img");
      withImg.setAttribute("src", "img/page exercice/Chair.svg");

      if (nextExercice.equipement == "bouteille") {
        withImg.setAttribute("src", "img/page exercice/bottle.svg");
      } else if (nextExercice.equipement == "chaise") {
        withImg.setAttribute("src", "img/page exercice/Chair.svg");
      } else {
        withBox.style.display = "none";
      }

      if (index >= home) {
        headerHeadband.setAttribute(
          "src",
          "img/page exercice/header/header-blue.svg"
        );
        // whereP.textContent = "Cette session est à réaliser à la maison.";
        whereImg.setAttribute("src", "img/page exercice/home.svg");
      }

      for(let i = 0; i < e.length; i++){
        if(e[i] == occasionTab[i]){
          headerHeadband.setAttribute(
            "src",
            "img/page exercice/header/header-green.svg"
          );
          whereImg.setAttribute("src", "img/page exercice/sometimes.svg");
          whereImg.setAttribute("class", "occasional-icon");
          whereBox.setAttribute("class", "where occasionnal-box");
        }
      }

      const imgBox = document.createElement("div");
      imgBox.setAttribute("class", "img-container");
      imgBox.setAttribute("role", "img");

      // removeLightboxEx.appendChild(lightbox);
      removeLightboxEx.appendChild(lightboxContainer);

      lightboxContainer.appendChild(progressBar);
      progressBar.appendChild(progress);
      progressBar.appendChild(containerBar);

      lightboxContainer.appendChild(lightboxHeader);
      lightboxHeader.appendChild(headerHeadband);
      lightboxHeader.appendChild(headerLogo);
      headerLogo.appendChild(logo);

      lightboxContainer.appendChild(containerMod);
      containerMod.appendChild(exerciceVideo);
      lightboxContainer.appendChild(boxTitleExercice);
      boxTitleExercice.appendChild(typeExercice);
      boxTitleExercice.appendChild(titleExercice);

      lightboxContainer.appendChild(instructionBox);
      instructionBox.appendChild(whereBox);
      whereBox.appendChild(whereImg);
      // whereBox.appendChild(whereP);
      instructionBox.appendChild(withBox);
      // withBox.appendChild(withP);
      withBox.appendChild(withImg);

      lightboxContainer.appendChild(recommandations);
      recommandations.appendChild(recommandationsP);
      recommandations.appendChild(recommandationsDrink);

      lightboxContainer.appendChild(divNext);
      divNext.appendChild(next);
      divNext.appendChild(nextArrow);
      lightboxContainer.appendChild(divPrev);
      divPrev.appendChild(previous);
      divPrev.appendChild(prevArrow);

      const nextMediaBtn = document.getElementById("next");
      const prevMediaBtn = document.getElementById("prev");

      // au clique sur l'un des boutons prev ou next déclenchement de la fonction prevMed ou nextMed
      prevMediaBtn.addEventListener("click", prevMed);
      nextMediaBtn.addEventListener("click", nextMed);
    }
    document.body.appendChild(lightbox);
  }

  function update() {
    const bar = document.querySelectorAll(".bar");

    bar.forEach((bar, idx) => {
      if (idx < currentActive) {
        bar.classList.add("active");
      } else {
        bar.classList.remove("active");
      }
    });
  }
}

// Fonction d'animation des confettis de fin de routine
function animateConfettis() {
  const containerSlot = document.querySelector("slot");
  const TLCONF = gsap.timeline();

  TLCONF.to(".slot div", {
    y: "random(-100, 100)",
    x: "random(-100, 100)",
    z: "random(0, 1000)",
    rotation: "random(-90, 90)",
    duration: 6,
    repeat: 3,
  })
    .to(".slot div", { autoAlpha: 0, duration: 1 }, "-=0.2")
    .add(() => {
      containerSlot.innerHTML = "";
    });
}

// fermeture de la modale
function close(){
  const undisplay = document.getElementById('body-form');
  undisplay.style.display = "none";
  location.reload();
}