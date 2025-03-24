export const unshorten = (shortened: string): string => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let num = 0;

  for (const index of shortened) {
    num = num * 36 + chars.indexOf(index);
  }

  const parts: string[] = [];
  for (let i = 0; i < 4; i++) {
    parts.unshift(String(num % 256));
    num = Math.floor(num / 256);
  }

  return parts.join(".");
};
