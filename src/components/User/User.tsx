import z from "zod";
import Loading from "./UserLoading";
import UserError from "./UserError";
import useFetch from "@/hooks/useFetch";

export const userSchema = z.object({
  firstName: z.string(),
  fullName: z.string(),
  jobTitle: z.string(),
  bio: z.string(),
  avatar: z.string(),
});

export type User = z.infer<typeof userSchema>;

const User = () => {
  const [{ data: user, isLoading, error }, fetchData] = useFetch<User>(
    "https://cool-fake-data.up.railway.app/api/user",
    userSchema
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <UserError onRetry={fetchData} />;
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
          <button onClick={fetchData}>Not cool enough. Give me another.</button>
        </div>
      ) : null}
    </article>
  );
};

export default User;
