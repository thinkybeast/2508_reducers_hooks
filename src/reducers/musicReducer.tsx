import type { MusicState, Music } from "@/types/music";
/*
Actions: Objects that describe the type of change we want to make to our state

By convention, actions are objects with a type property that describes the type of action we want to take, and an optional payload property that includes some bit of data we want to include in our next state.
 {
  type: string // defines the type of action we want to take
  payload?: any // some bit of data we want to include in our next state
 }
*/

interface FetchMusicStartAction {
  type: "FETCH_MUSIC_LOADING";
}

interface FetchMusicSuccessAction {
  type: "FETCH_MUSIC_SUCCESS";
  payload: Music;
}

interface FetchMusicErrorAction {
  type: "FETCH_MUSIC_ERROR";
}

type MusicAction =
  | FetchMusicStartAction
  | FetchMusicSuccessAction
  | FetchMusicErrorAction;

export const MusicAction = {
  MusicLoading: (): FetchMusicStartAction => ({ type: "FETCH_MUSIC_LOADING" }),
  MusicSuccess: (payload: Music): FetchMusicSuccessAction => ({
    type: "FETCH_MUSIC_SUCCESS",
    payload,
  }),
  MusicError: (): FetchMusicErrorAction => ({ type: "FETCH_MUSIC_ERROR" }),
};

/*
 Key idea: 
 1. Use reducers when you have complex, interdependent state
 2. Where you want to move control of the changes in state from the component to a "state change" function
*/

/*
  Key idea: useReducer is like useState...
  *except*
  ...the argument to the setter function is not the next state,
  ...the argument to the setter function is the argument to the reducer function
*/

/*
  Key idea: 
  The return value of the reducer function will be your next state
*/
const musicReducer = (_currentState: MusicState, action: MusicAction) => {
  const { type } = action;
  switch (type) {
    case "FETCH_MUSIC_LOADING":
      return { music: null, isLoading: true, error: false };
    case "FETCH_MUSIC_SUCCESS":
      return { music: action.payload, isLoading: false, error: false };
    case "FETCH_MUSIC_ERROR":
      return { music: null, isLoading: false, error: true };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export default musicReducer;
