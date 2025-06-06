import React from "react";
import z from "zod";
import Loading from "./Loading";
import UserError from "./UserError";
import { randomError } from "@/utils";

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
const userReducer = (_currentState: UserState, arg: UserState) => {
  return arg;
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
      setUserState({ isLoading: true, error: false, user: null });

      // Simulate a delay
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));

      // Randomly throw an error to simulate an API failure
      randomError();

      // Fetch user data from API
      const result = await fetch(
        "https://fakerapi.it/api/v2/users?_quantity=1"
      );
      const userData = await result.json();

      // Validate API response
      userSchema.parse(userData);

      // Set user state
      setUserState({ user: userData.data[0], isLoading: false, error: false });
    } catch (error) {
      // Set error state and log error
      setUserState({ user: null, isLoading: false, error: true });

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
          <p>Check out their work at {user.website}!</p>
          <button onClick={fetchUser}>Not cool enough. Give me another.</button>
        </div>
      ) : null}
    </article>
  );
};

export default User;
