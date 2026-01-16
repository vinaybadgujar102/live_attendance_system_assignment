import { WebSocketServer } from "ws";
import url from "url";
import { verifyToken } from "../../utils/token.utils";

import {
  handleAttendanceMarked,
  handleDone,
  handleMyAttendance,
  handleTodaySummary,
} from "./utilsForWs";

export function initWsServer(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("error", () => {
    wss.close();
  });

  wss.on("connection", (ws, req) => {
    const { query } = url.parse(req.url!, true);
    const token = query.token as string;
    try {
      const decoded = verifyToken(token);
      ws.user = {
        userId: decoded.userId,
        role: decoded.role,
      };
    } catch (error) {
      ws.send(
        JSON.stringify({
          event: "ERROR",
          data: { message: "Unauthorized or invalid token" },
        }),
      );
      ws.close();
      return;
    }
    ws.on("message", async (raw) => {
      let message;
      try {
        message = JSON.parse(raw.toString());
      } catch {
        ws.send(
          JSON.stringify({
            event: "ERROR",
            data: { message: "Invalid JSON" },
          }),
        );
        return;
      }

      const { event, data } = message;
      switch (event) {
        case "ATTENDANCE_MARKED":
          handleAttendanceMarked(ws, data, wss);
          break;

        case "TODAY_SUMMARY":
          handleTodaySummary(ws, wss);
          break;

        case "MY_ATTENDANCE":
          handleMyAttendance(ws);
          break;

        case "DONE":
          await handleDone(ws, wss);
          break;

        default:
          ws.send(
            JSON.stringify({
              event: "ERROR",
              data: { message: "Unknown event" },
            }),
          );
      }
    });
  });

  return wss;
}
