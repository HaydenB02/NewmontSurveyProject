import Vue from "vue";
import { RootState } from "../../store";
import { getStoreBuilder } from "vuex-typex";
import App, { AppState } from "./app";
import Fuse from 'fuse.js';

export interface HoleName {
    holeRowId: number,
    holeId: string,
    project: string,
    office: string,
    filename: string
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
    surveyGroups: Array<SurveyGroup>
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
   surveyGroups: Array<SurveyGroup>,
   surveyGroup: SurveyGroup,
   search_results: Array<HoleName>,
   holes: Array<Hole>
   scene: THREE.Scene;
}

const initialState: DataState = {
  holeNames: [],
  hole: null,
  surveyGroups: [],
  surveyGroup: null,
  search_results: [],
  holes: [],
  scene: null
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
  state.hole = await fetchHole(payload.filename);
  await updateSurveyGroups(state);
  await App.commitSetIsLoading({isLoading: false});
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
}

const b = getStoreBuilder<RootState>().module("data", initialState);

const stateGetter = b.state();
const Data = {
   get state() { return stateGetter(); },

   commitGetHoleNames: b.commit(getHoleNames),
   commitGetHole: b.commit(getHole)
};

export default Data;