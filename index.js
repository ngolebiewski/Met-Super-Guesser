const baseURL = `https://collectionapi.metmuseum.org/public/collection/v1/`;
const main = document.querySelector(`main`);
const internalStyle = document.querySelector(`#bg`);


/*
city - string
medium - string
objectDate -string
objectBeginDate - int
artistDisplayName - string
title - string

primaryImage - string - URL to image jpeg
objectID
*/

/* get art from department
Search for something generic + has an image
https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=9&hasImages=true&q=drawing


https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=9&hasImages=true&q=*

Get all object numbers from a Department
https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11
*/

const state = {
  allDepartmentArtworkIds: [],
  fourArtworkIds: [],
  fourArtworkDatasets: [],
  resortedFourArtworkDatasets: [],
  score: 0,
  rightAnswer: ''
}


//return a num in range 0 to one less than max
const getRandomInt = (max) => Math.floor(Math.random() * max); //via mdn @ https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

// choose a department
const metDepartments = [9, 11, 19] 
/* departmentId - displayName
21 -  Modern Art
11 -  European Painting
9 -   Drawings and Prints
19 -  Photographs
*/

const getRandomDept = () =>{
  const randomIndex = getRandomInt(metDepartments.length);
  return metDepartments[randomIndex];
}

const fetchDeptObjects = async () => {
  // const response = await fetch(`${baseURL}objects?departmentIds=${getRandomDept()}`)
  const response = await fetch(`${baseURL}search?departmentId=${getRandomDept()}&hasImages=true&q=*`);
//  const response = await fetch(`${baseURL}objects?departmentIds=21`) //for Testing
  const allDepartmentArtworkIds  = await response.json();
  return allDepartmentArtworkIds;
}

const getRandomIds = () =>{
  const fourArtworkIds = [];
  const numArtworks = state.allDepartmentArtworkIds.objectIDs.length;
  for (let i = 0; i< 4; i++) {
    const randomId = getRandomInt(numArtworks);
    fourArtworkIds.push(state.allDepartmentArtworkIds.objectIDs[randomId]);
  }
  return fourArtworkIds;
}

// const getArtworkDatabyID = async (artID) => {
//   console.log(artID);
//   const response = await fetch(`${baseURL}objects/${artID}`)
//   const artDetails = await response.json();
//   console.log(artDetails);
//   return await artDetails;
// }


// const getArtworkDatasets = async () => {
//   state.fourArtworkIds.map(async (artID) => {
//     console.log(artID);
//     const response = await fetch(`${baseURL}objects/${artID}`)
//     const artDetails = await response.json();
//     console.log(artDetails);
//     return artDetails;
//   });
// }

// const gamePlayerEngine = async () => {
//   state.allDepartmentArtworkIds = await fetchDeptObjects();
//   state.fourArtworkIds = getRandomIds();
//   console.log(state, 'hi');
//   state.fourArtworkDatasets = await getArtworkDatasets();
//   console.log(state.fourArtworkDatasets);
// }

const detailMaker = async (idArray) => {
  const superArray = idArray.map(async (idNum) => {
    const response = await fetch(`${baseURL}objects/${idNum}`)
    return await response.json();
  })
  return superArray;
} 

const renderRightorWrong = (guess) => {
  // console.log(`guess`, guess);
  // const newGuess = guess;
  // const theCorrectArtwork = "art-guesser=one\r";
  // console.log(newGuess == theCorrectArtwork)
  // console.log(newGuess);
  if (guess === state.rightAnswer) {
    alert(`Yes! ${state.rightAnswer} is the Right Answer!`);
    state.score++;
    gamePlayerEngine();
  } else {
      alert(`Sorry ${guess} is wrong, the answer is ${state.rightAnswer}`);
      gamePlayerEngine();
    }
}

//Fisher Yates Algorithm for randomly resorting an array
const resortedChoices = (fourChoicesArray) => {
  const fourChoicesCopy = fourChoicesArray.slice();
  for (i = fourChoicesCopy.length-1; i>0; i--) {
    let j = Math.floor(Math.random() * (i+1));
    let k = fourChoicesCopy[i];
    fourChoicesCopy[i] = fourChoicesCopy[j];
    fourChoicesCopy[j] = k;
  }
  return fourChoicesCopy;
}



const gamePlayerEngine = async () => {
  main.innerHTML = ``;
  // if (state.allDepartmentArtworkIDs.objectIDs[0] === undefined) state.allDepartmentArtworkIds = await fetchDeptObjects();
  if (firstGo) state.allDepartmentArtworkIds = await fetchDeptObjects();
  else if ((state.score+1) % 13 === 0 ) state.allDepartmentArtworkIds = await fetchDeptObjects();
  firstGo = false;
  state.fourArtworkIds = getRandomIds();
  state.fourArtworkDatasets = [];
  state.resortedFourArtworkDatasetsourArtworkDatasets = [];
  
  let response = await fetch(`${baseURL}objects/${state.fourArtworkIds[0]}`);
  const artworkOne = await response.json();
  state.fourArtworkDatasets.push(artworkOne);

  let j = 0;
  // while (((state.fourArtworkDatasets[0] === undefined) || (state.fourArtworkDatasets[0].primaryImage.length < 4)) && (j < 10)) {
  while ((state.fourArtworkDatasets[0] === undefined) && (j < 10)) {
    state.fourArtworkIds = getRandomIds();
    response = await fetch(`${baseURL}objects/${state.fourArtworkIds[0]}`);
    const artworkOne = await response.json();
    state.fourArtworkDatasets[0] = artworkOne;
    j += 1;
    console.log(j)
  }

  response = await fetch(`${baseURL}objects/${state.fourArtworkIds[1]}`)
  const artworkTwo = await response.json();
  state.fourArtworkDatasets.push(artworkTwo);

  response = await fetch(`${baseURL}objects/${state.fourArtworkIds[2]}`)
  const artworkThree = await response.json();
  state.fourArtworkDatasets.push(artworkThree);

  response = await fetch(`${baseURL}objects/${state.fourArtworkIds[3]}`)
  const artworkFour = await response.json();
  state.fourArtworkDatasets.push(artworkFour);

  // RE: the above and how it's the same thing 4 times...
  // I tried a forEach and map loop for hours, but kept on getting a promise back! 

  // const sectionImage = document.createElement(`section`)
  // main.replaceChildren(sectionImage);
  // sectionImage.innerHTML = `<img src=${state.fourArtworkDatasets[0].primaryImage}>`
  // sectionImage.id = `image-zone`;
  // //primaryImageSmall
  // console.log(state)

  // make the Quiz Image really big as the background image on the page
  const theImage = state.fourArtworkDatasets[0].primaryImage;
  internalStyle.innerHTML = `.bg \{background-image: url("${theImage}");\}`;
  ///////
  
  state.rightAnswer = state.fourArtworkDatasets[0].artistDisplayName;

  //resort the choices so that the answer isn't always in slot one

  state.resortedFourArtworkDatasets = resortedChoices(state.fourArtworkDatasets);

  let choiceZero = state.resortedFourArtworkDatasets[0].artistDisplayName;
  let choiceOne = state.resortedFourArtworkDatasets[1].artistDisplayName;
  let choiceTwo = state.resortedFourArtworkDatasets[2].artistDisplayName;
  let choiceThree = state.resortedFourArtworkDatasets[3].artistDisplayName;


  const radioBoxSet = document.createElement(`section`);
  main.appendChild(radioBoxSet);
  radioBoxSet.innerHTML = `  <form>
  <fieldset>
    <legend>Which artist made this?</legend>
  
    <div>
      <input type="radio" id="one" name="art-guesser" value="${choiceZero}" checked />
      <label for="one">${state.resortedFourArtworkDatasets[0].artistDisplayName}</label>
    </div>
  
    <div>
      <input type="radio" id="two" name="art-guesser" value="${choiceOne}" />
      <label for="two">${state.resortedFourArtworkDatasets[1].artistDisplayName}</label>
    </div>
  
    <div>
      <input type="radio" id="three" name="art-guesser" value="${choiceTwo}" />
      <label for="three">${state.resortedFourArtworkDatasets[2].artistDisplayName}</label>
    </div>

    <div>
      <input type="radio" id="four" name="art-guesser" value="${choiceThree}" />
      <label for="four">${state.resortedFourArtworkDatasets[3].artistDisplayName}</label>
    </div>
  </fieldset>
  <button>Submit your Guess</button>
</form>`
radioBoxSet.id = "guess-zone";

internalStyle.innerHTML = `.bg \{background-image: url("${theImage}");\}`;
// radioBoxSet.addEventListener(`submit`, (e) => {
//   e.preventDefault();
//   console.log(e.target)
// })

const form = document.querySelector("form");

form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    const data = new FormData(form);
    let output = "";
    for (const entry of data) {
      // output = `${output}${entry[0]}=${entry[1]}\r`;
      output = entry[1];
    }
    console.log(output);
    renderRightorWrong(output);
    
  },
  false,
);



const footerScore = document.querySelector(`footer`);
footerScore.innerHTML = `
Your Score: <a>${state.score}</a> | Designed by <a href="http://nickgolebiewski.com">Nick Golebiewski</a> | Source on <a href="https://github.com/ngolebiewski/Met-Super-Guesser">GitHub</a>`
internalStyle.innerHTML = `.bg \{background-image: url("${theImage}");\}`;
}





let firstGo = true
gamePlayerEngine();


////GUESSING VIEW//////
//get one of the departments that have a lot of "guessable images"
//get 4 random objects from that department
  //randomly choose one as the 'mainSelection'
  //could be 1, 2, 3 or 4 -- this way the multiple choice is mixed
//display image from the "mainSelection" object
//randomly choose datapoint (i.e. artist name) to guess
  //display that datapoint for each artwork as MC
    //radiobox form with submit button
//if choose right one get a point

///////NEW VIEW///////
//Show all 4 images
  //fade out "wrong selections" with their meta Details overlaid
//click ANYWHERE for next round