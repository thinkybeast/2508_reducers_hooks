import React from "react";
import z from "zod";

const userSchema = z.object({
  firstName: z.string(),
  fullName: z.string(),
  jobTitle: z.string(),
  bio: z.string(),
  avatar: z.string(),
});

type User = z.infer<typeof userSchema>;

const User = () => {
  const [user, setUser] = React.useState<User | null>(null);

  async function fetchUser() {
    try {
      // Simulate a delay
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));

      // Fetch user data from new API
      const result = await fetch(
        "https://cool-fake-data.up.railway.app/api/user"
      );
      const userData = await result.json();

      // Validate API response
      userSchema.parse(userData);
      setUser(userData);
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    // Fetch user data when component mounts
    fetchUser();
  }, []);

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
