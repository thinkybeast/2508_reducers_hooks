export const randomError = (percentChance: number = 0.3) => {
  if (Math.random() <= percentChance) {
    throw new Error("Simulated API error");
  }
  return "";
};
