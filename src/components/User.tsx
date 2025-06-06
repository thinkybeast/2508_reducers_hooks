import React from "react";
import z from "zod";
import Loading from "./Loading";
import UserError from "./UserError";
import { randomErrorString } from "@/utils";

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

const userSchema = z.object({
  data: z.array(
    z.object({
      firstname: z.string(),
      email: z.string(),
      website: z.string(),
    })
  ),
});

type UserResponse = z.infer<typeof userSchema>;

// Define the initial state of the component data
type UserState = {
  user: UserResponse["data"][0] | null;
  isLoading: boolean;
  error: boolean;
};

const initialUserState: UserState = {
  user: null,
  isLoading: false,
  error: false,
};

// Define the reducer function. It takes the current state and an action, and returns the next state
/*
Actions:
 {
  type: string // defines the type of action we want to take
  payload?: any // some bit of data we want to include in our next state
 }
*/

interface FetchUserStartAction {
  type: "FETCH_USER_START";
}

interface FetchUserSuccessAction {
  type: "FETCH_USER_SUCCESS";
  payload: UserResponse["data"][0];
}

interface FetchUserErrorAction {
  type: "FETCH_USER_ERROR";
}

type UserAction =
  | FetchUserStartAction
  | FetchUserSuccessAction
  | FetchUserErrorAction;

const userReducer = (_currentState: UserState, action: UserAction) => {
  const { type } = action;
  switch (type) {
    case "FETCH_USER_START":
      return { user: null, isLoading: true, error: false };
    case "FETCH_USER_SUCCESS":
      return { user: action.payload, isLoading: false, error: false };
    case "FETCH_USER_ERROR":
      return { user: null, isLoading: false, error: true };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

const User = () => {
  const [userState, setUserState] = React.useReducer(
    userReducer,
    initialUserState
  );
  const { user, isLoading, error } = userState; // Destructure the state object

  async function fetchUser() {
    try {
      // Set Loading state
      setUserState({ type: "FETCH_USER_START" });

      // Simulate a delay
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));

      // Randomly throw an error to simulate an API failure
      randomErrorString();

      // Fetch user data from API
      const result = await fetch(
        "https://fakerapi.it/api/v2/users?_quantity=1"
      );
      const userData = await result.json();

      // Validate API response
      userSchema.parse(userData);

      // Set user state
      setUserState({ type: "FETCH_USER_SUCCESS", payload: userData.data[0] });
    } catch (error) {
      // Set error state and log error
      setUserState({ type: "FETCH_USER_ERROR" });

      console.error(error);
    }
  }

  React.useEffect(() => {
    // Fetch user data when component mounts
    fetchUser();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <UserError onRetry={fetchUser} />;
  }

  return (
    <article>
      {user ? (
        <div>
          <div style={{ width: "310px", height: "310px", margin: "0 auto" }}>
            <img
              src={`https://robohash.org/${user.email}`}
              key={`https://robohash.org/${user.email}`}
            />
          </div>
          <p>
            Meet <b>{user.firstname}!</b>
          </p>
          <p>They are passionate about {user.website}</p>
          <button onClick={fetchUser}>Not cool enough. Give me another.</button>
        </div>
      ) : null}
    </article>
  );
};

export default User;
