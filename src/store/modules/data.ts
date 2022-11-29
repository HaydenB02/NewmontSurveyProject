//Vue Imports
import Vue from "vue";
import { getStoreBuilder } from "vuex-typex";

//Data Stores
import { RootState } from "../../store";
import App from "./app";

//Three Imports
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface HoleName {
    holeRowId: number,
    holeId: string,
    project: string,
    office: string,
    filename: string,
}

export interface Hole {
    holeRowid: number,
    holeId: string,
    project: string,
    office: string,
    depth: number,
    depthUnits: string,
    source: string,
    startDate: Date,
    endDate: Date,
    description: string,
    x: number,
    y: number,
    z: number,
    lat: number,
    long: number,
    elevation: number,
    status: string,
    surveyGroups: Array<SurveyGroup>,
}

export interface SurveyGroup {
    priority: number,
    surveyType: string,
    surveys: Array<Survey>,
    isSelected: boolean,
    isReference: boolean,
}

export interface Survey {
    surveyRowid: number,
    depth: number,
    inclination: number,
    aziTrueNth: number,
    description: string,
    utcDateAdded: Date,
    utcDateUpdated: Date,
    point: Point,
}

//Interface used for drawing and comparing
export interface Point {
  depth: number,
  x: number,
  y: number,
  z: number,
  inRange: boolean,
}

//Interface used to store necessary components for controling 3D model across classes
export interface ThreeContainer {
  scene: Three.Scene,
  camera: Three.PerspectiveCamera,
  renderer: Three.Renderer,
  moveables: Array<Three.Mesh>,
  orbitControls: OrbitControls
}

export interface DataState {
   holeNames: Array<HoleName>,
   hole: Hole,
   allowedDistance: number,
   surveyGroups: Array<SurveyGroup>,
   surveyGroup: SurveyGroup,
   search_results: Array<HoleName>,
   holes: Array<Hole>,
   threeContainer: ThreeContainer,
}

const initialState: DataState = {
  holeNames: [],
  hole: null,
  allowedDistance: 0,
  surveyGroups: [],
  surveyGroup: null,
  search_results: [],
  holes: [],
  threeContainer: null,
};

async function getHoleNames(state: DataState) {
  state.holeNames = await fetchHoleNames();
  await App.commitSetIsLoading({isLoading: false});
}

async function fetchHoleNames(): Promise<Array<HoleName>> {
  const call = await fetch("../../../Data/holes.json");
  const response = await call.json();
  return response.holes;
}

async function getHole(state: DataState, payload: {filename: string}) {
  App.commitSetIsLoading({isLoading: true});
  state.hole = await fetchHole(payload.filename);
  await updateSurveyGroups(state);
  App.commitSetIsLoading({isLoading: false});
}

async function fetchHole(filename: string): Promise<Hole> {
  const call = await fetch("../../../Data/Holes/" + filename);
  const response = await call.json();
  return response;
}

async function updateSurveyGroups(state: DataState) {
  //Make sure surveys are in descending order
  state.hole.surveyGroups.sort((a, b) => b.priority - a.priority);
  state.surveyGroups = state.hole.surveyGroups;

  //Set initial reference to highest priority
  let surveyGroup = state.surveyGroups[0];
  surveyGroup.isReference = true;
  surveyGroup.isSelected = true;
  Vue.set(state.surveyGroups, 0, surveyGroup);

  //Set every other survey to not reference to make sure it isn't read as null
  for(let i=1; i<state.surveyGroups.length; i++){
    surveyGroup = state.surveyGroups[i];
    surveyGroup.isReference = false;
    surveyGroup.isSelected = false;
    Vue.set(state.surveyGroups, i, surveyGroup);
  }

  //Calculate points for reference survey to allow comparison
  let refSurvey = state.surveyGroups[0];
  calcPoints(refSurvey);

  //Focus camera on middle point of the reference survey
  let midID = Math.floor(refSurvey.surveys.length / 2);
  state.threeContainer.camera.position.set(refSurvey.surveys[midID].point.x + 15, refSurvey.surveys[midID].point.z, refSurvey.surveys[midID].point.y);
  state.threeContainer.camera.lookAt(refSurvey.surveys[midID].point.x, refSurvey.surveys[midID].point.z, refSurvey.surveys[midID].point.y);
  
  //Calculate points for all surveys
  for(let i=0; i<state.surveyGroups.length; i++){
    calcPoints(state.surveyGroups[i]);
  }
}

function calcPoints(survey: SurveyGroup) {
  //Create temporary point variable
  let point: any = {
    x: null,
    y: null,
    z: null,
    depth: null,
    inRange: null
  }

  //Create first point, always the same, always in range
  point.x = 0;
  point.y = 0;
  point.z = 0;
  point.depth = survey.surveys[0].depth;
  point.inRange = true;
  survey.surveys[0].point = JSON.parse(JSON.stringify(point));

  //Find every other point
  for(let i=1; i<survey.surveys.length; i++){
    let lastSurvey = survey.surveys[i-1];
    let diffDepth = survey.surveys[i].depth - lastSurvey.depth;
    let aziRads = lastSurvey.aziTrueNth * Math.PI / 180;
    let inclineRads = lastSurvey.inclination * Math.PI / 180;
    let lastPoint = lastSurvey.point;

    //Calculate new points position
    point.x = lastPoint.x + (diffDepth * Math.sin(aziRads));
    point.y = lastPoint.y + (diffDepth * Math.cos(aziRads));
    point.z = lastPoint.z + (diffDepth * Math.sin(inclineRads));
    point.depth = survey.surveys[i].depth;

    //Check in range
    if(survey.isReference){
      //Reference survey every point in range
      point.inRange = true;
    }
    else if(Data.state.surveyGroups.find(e => e.isReference) != undefined){
      let refSurvey = Data.state.surveyGroups.find(e => e.isReference);

      //If the reference survey has a comparable depth, check difference
      if(refSurvey.surveys.find(e => e.depth == point.depth)){
        let refPoint = refSurvey.surveys.find(e => e.depth == point.depth).point;
        let diffX = point.x - refPoint.x;
        let diffY = point.y - refPoint.y;
        let diffZ = point.z - refPoint.z;

        let diff = Math.sqrt((diffX*diffX) + (diffY*diffY) + (diffZ*diffZ));
        if(diff <= Data.state.allowedDistance){
          point.inRange = true;
        }
        else{
          point.inRange = false;
        }
      }
      //Otherwise, all points that dont have a comparable depth are considered out of range
      else{
        point.inRange = false;
      }
    }
    else{
      //if no reference exists all are in range
      //should never happen but safety first
      point.inRange = true;
    }

    //Set current point to calculated point variable
    survey.surveys[i].point = JSON.parse(JSON.stringify(point));
  }
}

function resetRange(state: DataState) {
  //Loop through each surveyGroup and reset inRange variable for each point
  for(let i=0; i<state.surveyGroups.length; i++){
    let surveyGroup = state.surveyGroups[i];

    for(let j=0; j<surveyGroup.surveys.length; j++){
      let currSurvey = surveyGroup.surveys[j];

      //Reference survey every point in range
      if(surveyGroup.isReference){
        surveyGroup.surveys[j].point.inRange = true;
      }
      else if(state.surveyGroups.find(e => e.isReference)){
        let refSurveyGroup = state.surveyGroups.find(e => e.isReference);
  
        //If the reference survey has a comparable depth, check difference
        if(refSurveyGroup.surveys.find(e => e.depth == currSurvey.depth)){
          let point = currSurvey.point;
          let refPoint = refSurveyGroup.surveys.find(e => e.depth == currSurvey.depth).point;
          let diffX = point.x - refPoint.x;
          let diffY = point.y - refPoint.y;
          let diffZ = point.z - refPoint.z;
  
          let diff = Math.sqrt(diffX*diffX) + (diffY*diffY) + (diffZ*diffZ);
          if(diff <= state.allowedDistance){
            point.inRange = true;
          }
          else{
            point.inRange = false;
          }
        }
        //Otherwise, all points without a comparable depth are out of range
        else{
          currSurvey.point.inRange = false;
        }
      }
      else{
        //if no reference exists all are in range
        //should never happen but safety first
        currSurvey.point.inRange = true;
      }
    }
  }
}

const b = getStoreBuilder<RootState>().module("data", initialState);

const stateGetter = b.state();
const Data = {
   get state() { return stateGetter(); },

   commitGetHoleNames: b.commit(getHoleNames),
   commitGetHole: b.commit(getHole),
   commitResetRange: b.commit(resetRange)
};

export default Data;