import z from "zod";

export const musicSchema = z.object({
  songName: z.string(),
  album: z.string(),
  artist: z.string(),
});

export type Music = z.infer<typeof musicSchema>;
