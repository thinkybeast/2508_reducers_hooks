import React from "react";
import z from "zod";
import Loading from "./Loading";
import UserError from "./UserError";
import { randomError } from "@/utils";

const userSchema = z.object({
  firstName: z.string(),
  fullName: z.string(),
  jobTitle: z.string(),
  bio: z.string(),
  avatar: z.string(),
});

type User = z.infer<typeof userSchema>;

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: boolean;
}

const User = () => {
  const [userState, setUserState] = React.useState<UserState>({
    user: null,
    isLoading: false,
    error: false,
  });

  async function fetchUser() {
    try {
      // Reset state
      setUserState({ user: null, isLoading: true, error: false });

      // Simulate a delay
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));

      // Randomly throw an error to simulate an API failure
      randomError();

      // Fetch user data from new API
      const result = await fetch(
        "https://cool-fake-data.up.railway.app/api/user"
      );
      const userData = await result.json();

      // Validate API response
      userSchema.parse(userData);
      setUserState({ user: userData, isLoading: false, error: false });
    } catch (error) {
      // Set error state and log error
      setUserState({ user: null, isLoading: false, error: true });
      console.error(error);
    } finally {
      // Reset loading state
      setUserState({ user: null, isLoading: false, error: false });
    }
  }

  React.useEffect(() => {
    // Fetch user data when component mounts
    fetchUser();
  }, []);

  if (userState.isLoading) {
    return <Loading />;
  }

  if (userState.error) {
    return <UserError onRetry={fetchUser} />;
  }

  return (
    <article>
      {userState.user ? (
        <div>
          <div style={{ width: "310px", height: "310px", margin: "0 auto" }}>
            <img src={userState.user.avatar} alt={userState.user.fullName} />
          </div>
          <p>
            Meet <b>{userState.user.firstName}!</b> They are a{" "}
            <b>{userState.user.jobTitle}</b>.
          </p>
          <p>
            <b>Key facts:</b> {userState.user.bio}
          </p>
          <button onClick={fetchUser}>Not cool enough. Give me another.</button>
        </div>
      ) : null}
    </article>
  );
};

export default User;
