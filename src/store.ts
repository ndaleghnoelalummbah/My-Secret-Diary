import { createStore } from "redux";

interface AppState {
  // define your app state here
}

const initialState: AppState = {
  // set up your initial state here
};

function rootReducer(state: AppState = initialState, action: any) {
  // handle your actions here and return a new state
  return state;
}

const store = createStore(rootReducer);

export default store;
