import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import useFetch from "@/hooks/useFetch";
import { userSchema, type User } from "@/types/user";

const User = () => {
  const [{ data: user, isLoading, error }, fetchData] = useFetch<User>(
    "https://cool-fake-data.up.railway.app/api/user",
    userSchema
  );

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
