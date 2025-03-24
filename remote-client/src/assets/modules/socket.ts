import { unshorten } from "./shorten";

export const connectSocket = (code: string): Promise<WebSocket | any> => {
  return new Promise((resolve) => {
    try {
      // const timeout = () => {} - later
      const hostIp = unshorten(code);
      const wsUrl = `ws://${hostIp}:6969`;

      resolve(new WebSocket(wsUrl));
    } catch (err) {
      console.error("Failed to connect:", err);
      resolve(null);
    }
  });
};
