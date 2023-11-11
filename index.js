const baseURL = `https://collectionapi.metmuseum.org/public/collection/v1/`;
const main = document.querySelector(`main`);


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
  score: 0
}


//return a num in range 0 to one less than max
const getRandomInt = (max) => Math.floor(Math.random() * max); //via mdn @ https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

// choose a department
const metDepartments = [9, 11, 19, 21] 
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
  // const response = await fetch(`${baseURL}search?departmentId=${getRandomDept()}&hasImages=true&q=*`);
 const response = await fetch(`${baseURL}objects?departmentIds=21`) //for Testing
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

const gamePlayerEngine = async () => {
  state.allDepartmentArtworkIds = await fetchDeptObjects();
  state.fourArtworkIds = getRandomIds();

  let response = await fetch(`${baseURL}objects/${state.fourArtworkIds[0]}`)
  const artworkOne = await response.json();
  state.fourArtworkDatasets.push(artworkOne);

  response = await fetch(`${baseURL}objects/${state.fourArtworkIds[1]}`)
  const artworkTwo = await response.json();
  state.fourArtworkDatasets.push(artworkTwo);

  response = await fetch(`${baseURL}objects/${state.fourArtworkIds[2]}`)
  const artworkThree = await response.json();
  state.fourArtworkDatasets.push(artworkThree);

  response = await fetch(`${baseURL}objects/${state.fourArtworkIds[3]}`)
  const artworkFour = await response.json();
  state.fourArtworkDatasets.push(artworkFour);

  //I tried a forEach and map loop for hours, but kept on getting a promise back! so this was old school one by one stuff.

  const sectionImage = document.createElement(`section`)
  main.replaceChildren(sectionImage);
  sectionImage.innerHTML = `<img src=${state.fourArtworkDatasets[0].primaryImage}>`
  sectionImage.id = `image-zone`;
  //primaryImageSmall
  console.log(state)

  ///////

  const radioBoxSet = document.createElement(`section`);
  sectionImage.id = "guess-zone";
  main.appendChild(radioBoxSet);
  radioBoxSet.innerHTML = `  <form>
  <fieldset>
    <legend>What artist made this?:</legend>
  
    <div>
      <input type="radio" id="one" name="art-guesser" value="one" checked />
      <label for="one">${state.fourArtworkDatasets[0].artistDisplayName}</label>
    </div>
  
    <div>
      <input type="radio" id="two" name="art-guesser" value="two" />
      <label for="two">${state.fourArtworkDatasets[1].artistDisplayName}</label>
    </div>
  
    <div>
      <input type="radio" id="three" name="art-guesser" value="three" />
      <label for="three">${state.fourArtworkDatasets[2].artistDisplayName}</label>
    </div>

    <div>
      <input type="radio" id="four" name="art-guesser" value="four" />
      <label for="four">${state.fourArtworkDatasets[3].artistDisplayName}</label>
    </div>
  </fieldset>
  <button>Submit your choice</button>
</form>`

}







  
 


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


