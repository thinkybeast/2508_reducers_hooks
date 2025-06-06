import z from "zod";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import useFetch from "@/hooks/useFetch";

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
  const [{ data: userResponse, isLoading, error }, fetchData] =
    useFetch<UserResponse>(
      "https://fakerapi.it/api/v2/users?_quantity=1",
      userSchema
    );

  const user = userResponse?.data[0];

  if (isLoading) {
    return <Loading>🔎 Finding the coolest of users...</Loading>;
  }

  if (error) {
    return (
      <Error onRetry={fetchData}>
        We seem to have some trouble finding a cool user at the moment.
      </Error>
    );
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
          <button onClick={fetchData}>Not cool enough. Give me another.</button>
        </div>
      ) : null}
    </article>
  );
};

export default User;
