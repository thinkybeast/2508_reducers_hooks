import useFetch from "@/hooks/useFetch";
import { musicSchema, type Music } from "@/types/music";
import Loading from "@/components/shared/Loading";
import ErrorView from "@/components/shared/Error";

const Music = () => {
  const [{ data: music, isLoading, error }, fetchData] = useFetch<Music>(
    "https://cool-fake-data.up.railway.app/api/music",
    musicSchema
  );

  if (isLoading) return <Loading>🎧 Finding a great track...</Loading>;
  if (error)
    return (
      <ErrorView onRetry={fetchData}>
        We couldn't cue up a track right now. Try again?
      </ErrorView>
    );

  return music ? (
    <article>
      <h2>
        🎵 Now playing: <strong>{music.songName}</strong>
      </h2>
      <p>Artist: {music.artist}</p>
      <p>Album: {music.album}</p>
      <button onClick={fetchData}>Play something else</button>
    </article>
  ) : null;
};

export default Music;
