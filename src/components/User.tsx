import React from "react";
import z from "zod";
import type { User, UserState } from "@/types/user";
import Loading from "./Loading";
import UserError from "./UserError";
import { randomError } from "@/utils";
import userReducer, { UserAction } from "@/reducers/userReducer";

const userSchema = z.object({
  firstName: z.string(),
  fullName: z.string(),
  jobTitle: z.string(),
  bio: z.string(),
  avatar: z.string(),
});

type SchemaUser = z.infer<typeof userSchema>;

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
      randomError();

      // Fetch user data from new API
      const result = await fetch(
        "https://cool-fake-data.up.railway.app/api/user"
      );
      const userData = await result.json();

      // Validate API response and set user state
      const parsedUser: SchemaUser = userSchema.parse(userData);
      dispatch(UserAction.UserSuccess(parsedUser));
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
            <img src={user.avatar} alt={user.fullName} />
          </div>
          <p>
            Meet <b>{user.firstName}!</b> They are a <b>{user.jobTitle}</b>.
          </p>
          <p>
            <b>Key facts:</b> {user.bio}
          </p>
          <button onClick={fetchUser}>Not cool enough. Give me another.</button>
        </div>
      ) : null}
    </article>
  );
};

export default User;
