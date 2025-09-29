import React from "react";
import type { Music, MusicState } from "@/types/music";
import { musicSchema } from "@/types/music";
import Loading from "./Loading";
import UserError from "./UserError";
import { randomError } from "@/utils";
import musicReducer, { MusicAction } from "@/reducers/musicReducer";

// Schema is defined in types and imported; infer User from schema there

const initialUserState: MusicState = {
  music: null,
  isLoading: false,
  error: false,
};

const Music = () => {
  const [musicState, dispatch] = React.useReducer(
    musicReducer,
    initialUserState
  );
  const { music, isLoading, error } = musicState; // Destructure the state object

  async function fetchMusic() {
    try {
      // Set Loading state
      dispatch(MusicAction.MusicLoading());

      // Simulate a delay
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));

      // Randomly throw an error to simulate an API failure
      randomError();

      // Fetch user data from new API
      const result = await fetch(
        "https://cool-fake-data.up.railway.app/api/music"
      );
      const musicData = await result.json();

      // Validate API response and set user state
      const parsedUser = musicSchema.parse(musicData);
      dispatch(MusicAction.MusicSuccess(parsedUser as Music));
    } catch (error) {
      // Set error state and log error
      dispatch(MusicAction.MusicError());

      console.error(error);
    }
  }

  React.useEffect(() => {
    // Fetch music data when component mounts
    fetchMusic();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <UserError onRetry={fetchMusic} />;
  }

  return (
    <article>
      {music ? (
        <div>
          <p>
            {music.songName} by {music.artist}
          </p>
          <p>{music.album}</p>
          <button onClick={fetchMusic}>
            Not hype enough. Give me another.
          </button>
        </div>
      ) : null}
    </article>
  );
};

export default Music;
