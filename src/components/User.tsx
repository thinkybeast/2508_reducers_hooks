import React from "react";
import z from "zod";
import Loading from "./Loading";
import UserError from "./UserError";
import { randomErrorString } from "@/utils";
import userReducer, { UserAction } from "@/reducers/userReducer";

export const userSchema = z.object({
  data: z.array(
    z.object({
      firstname: z.string(),
      email: z.string(),
      website: z.string(),
    })
  ),
});

export type UserResponse = z.infer<typeof userSchema>;
export type User = UserResponse["data"][0];

// Define the initial state of the component data
export type UserState = {
  user: User | null;
  isLoading: boolean;
  error: boolean;
};

const initialUserState: UserState = {
  user: null,
  isLoading: false,
  error: false,
};

const User = () => {
  const [userState, dispatch] = React.useReducer(userReducer, initialUserState);
  const { user, isLoading, error } = userState; // Destructure the state object

  async function fetchUser() {
    try {
      // Set Loading state
      dispatch(UserAction.UserLoading());

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
      dispatch(UserAction.UserSuccess(userData.data[0]));
    } catch (error) {
      // Set error state and log error
      dispatch(UserAction.UserError());

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
