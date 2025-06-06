import React from "react";
import z from "zod";
import Loading from "./Loading";
import UserError from "./UserError";
import { randomErrorString } from "@/utils";

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

const User = () => {
  const [user, setUser] = React.useState<UserResponse["data"][0] | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  async function fetchUser() {
    try {
      // Reset state
      setIsLoading(true);
      setUser(null);
      setError(false);

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
      setUser(userData.data[0]);
    } catch (error) {
      // Set error state and log error
      setError(true);
      console.error(error);
    } finally {
      // Reset loading state
      setIsLoading(false);
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
