import React from "react";
import z from "zod";

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

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const result = await fetch(
          "https://fakerapi.it/api/v2/users?_quantity=1"
        );
        const userData = await result.json();
        userSchema.parse(userData);
        setUser(userData.data[0]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, []);

  return (
    <article>
      {user ? (
        <>
          <div style={{ width: "310px", height: "310px", margin: "0 auto" }}>
            <img src={`https://robohash.org/${user.email}`} />
          </div>
          <p>
            Meet <b>{user.firstname}!</b>
          </p>
          <p>They are passionate about {user.website}</p>
        </>
      ) : null}
    </article>
  );
};

export default User;
