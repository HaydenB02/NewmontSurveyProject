import Vue from "vue";
import { RootState } from "../../store";
import { getStoreBuilder } from "vuex-typex";
import App, { AppState } from "./app";
import Fuse from 'fuse.js';
import * as Three from 'three';

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

export interface Point {
  depth: number,
  x: number,
  y: number,
  z: number,
  inRange: boolean,
}

export interface DataState {
   holeNames: Array<HoleName>,
   hole: Hole,
   allowedDistance: number,
   surveyGroups: Array<SurveyGroup>,
   surveyGroup: SurveyGroup,
   search_results: Array<HoleName>,
   holes: Array<Hole>,
   scene: Three.Scene,
   camera: Three.PerspectiveCamera,
   renderer: Three.Renderer;
}

const initialState: DataState = {
  holeNames: [],
  hole: null,
  allowedDistance: 0,
  surveyGroups: [],
  surveyGroup: null,
  search_results: [],
  holes: [],
  scene: null,
  camera: null,
  renderer: null
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
  state.hole.surveyGroups.sort((a, b) => a.priority - b.priority);
  state.hole.surveyGroups.reverse();
  state.surveyGroups = state.hole.surveyGroups;

  //set initial reference to first
  let surveyGroup = state.surveyGroups[0];
  surveyGroup.isReference = true;
  surveyGroup.isSelected = true;
  Vue.set(state.surveyGroups, 0, surveyGroup);
  for(let i=1; i<state.surveyGroups.length; i++){
    surveyGroup = state.surveyGroups[i];
    surveyGroup.isReference = false;
    surveyGroup.isSelected = false;
    Vue.set(state.surveyGroups, i, surveyGroup);
  }

  //load points
  if(state.surveyGroups.find(e => e.isReference) != undefined){
    let refSurvey = state.surveyGroups.find(e => e.isReference);
    calcPoints(refSurvey);

    //TODO: get camera to correct location and look at lines

    let midID = Math.floor(refSurvey.surveys.length / 2);
    state.camera.position.set(refSurvey.surveys[midID].point.x + 15, refSurvey.surveys[midID].point.z, refSurvey.surveys[midID].point.y);
    state.camera.lookAt(refSurvey.surveys[midID].point.x, refSurvey.surveys[midID].point.z, refSurvey.surveys[midID].point.y);
  }
  
  for(let i=0; i<state.surveyGroups.length; i++){
    calcPoints(state.surveyGroups[i]);
  }
}

function calcPoints(survey: SurveyGroup) {
  let point: any = {
    x: null,
    y: null,
    z: null,
    depth: null,
    inRange: null
  }

  point.x = 0;
  point.y = 0;
  point.z = 0;
  point.depth = survey.surveys[0].depth;
  point.inRange = true;

  survey.surveys[0].point = JSON.parse(JSON.stringify(point));
  for(let i=1; i<survey.surveys.length; i++){
    let lastSurvey = survey.surveys[i-1];
    let diffDepth = survey.surveys[i].depth - lastSurvey.depth;
    let aziRads = lastSurvey.aziTrueNth * Math.PI / 180;
    let inclineRads = lastSurvey.inclination * Math.PI / 180;

    let lastPoint = lastSurvey.point;

    point.x = lastPoint.x + (diffDepth * Math.sin(aziRads));
    point.y = lastPoint.y + (diffDepth * Math.cos(aziRads));
    point.z = lastPoint.z + (diffDepth * Math.sin(inclineRads));
    point.depth = survey.surveys[i].depth;

    //check in range
    if(survey.isReference){
      //reference survey every point in range
      point.inRange = true;
    }
    else if(Data.state.surveyGroups.find(e => e.isReference) != undefined){
      let refSurvey = Data.state.surveyGroups.find(e => e.isReference);

      if(refSurvey.surveys.length > i){
        let diffX = point.x - refSurvey.surveys[i].point.x;
        let diffY = point.y - refSurvey.surveys[i].point.y;
        let diffZ = point.z - refSurvey.surveys[i].point.z;

        let diff = Math.sqrt((diffX*diffX) + (diffY*diffY) + (diffZ*diffZ));
        if(diff <= Data.state.allowedDistance){
          point.inRange = true;
        }
        else{
          point.inRange = false;
        }
      }
      else{
        //TODO: should points past the furthest point of the reference be considered out of range?
        point.inRange = false;
      }
    }
    else{
      //if no reference exists all are in range
      //should never happen but safety first
      point.inRange = true;
    }

    survey.surveys[i].point = JSON.parse(JSON.stringify(point));
  }
}

function resetRange(state: DataState) {
  for(let i=0; i<state.surveyGroups.length; i++){
    let surveyGroup = state.surveyGroups[i];

    for(let j=0; j<surveyGroup.surveys.length; j++){
      let currSurvey = surveyGroup.surveys[j];
      if(surveyGroup.isReference){
        //reference survey every point in range
        surveyGroup.surveys[j].point.inRange = true;
      }
      else if(state.surveyGroups.find(e => e.isReference)){
        let refSurveyGroup = state.surveyGroups.find(e => e.isReference);
        let refSurvey = refSurveyGroup.surveys[j];
  
        if(refSurveyGroup.surveys.length > j){
          let point = currSurvey.point;
          let refPoint = refSurvey.point;
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
        else{
          //points past the furthest point of the reference are considered out of range
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