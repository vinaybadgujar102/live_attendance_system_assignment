import { WebSocketServer } from "ws";
import url from "url";
import { verifyToken } from "../../utils/token.utils";
import { activeSession } from "./attendanceState";
import type { WebSocket } from "ws";
import { UserRoles } from "../models/User.model";
import { Attendance } from "../models/Attendance.model";
import { Class } from "../models/Class.model";

type AttendanceMarkedPayload = {
  studentId: string;
  status: "present" | "absent";
};

function checkRole(ws: WebSocket, role: UserRoles) {
  if (ws.user.role !== role) {
    ws.send(
      JSON.stringify({
        event: "ERROR",
        data: { message: `Forbidden, ${role} event only` },
      }),
    );
    return false;
  }
  return true;
}

function handleAttendanceMarked(
  ws: WebSocket,
  data: AttendanceMarkedPayload,
  wss: WebSocketServer,
) {
  if (!checkRole(ws, UserRoles.TEACHER)) {
    return;
  }

  if (!activeSession) {
    ws.send(
      JSON.stringify({
        event: "ERROR",
        data: { message: "No active attendance session" },
      }),
    );
    return;
  }

  const { studentId, status } = data;
  activeSession.attendance[studentId] = status;
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        event: "ATTENDANCE_MARKED",
        data: { studentId, status },
      }),
    );
  });
}

function handleTodaySummary(ws: WebSocket, wss: WebSocketServer) {
  if (!checkRole(ws, UserRoles.TEACHER)) {
    return;
  }

  if (!activeSession) {
    ws.send(
      JSON.stringify({
        event: "ERROR",
        data: { message: "No active attendance session" },
      }),
    );
    return;
  }

  const totalPresent = Object.values(activeSession.attendance).filter(
    (ele) => ele === "present",
  ).length;
  const totalAbsent = Object.values(activeSession.attendance).filter(
    (ele) => ele === "absent",
  ).length;
  const total = totalAbsent + totalPresent;

  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        event: "TODAY_SUMMARY",
        data: {
          present: totalPresent,
          absent: totalAbsent,
          total,
        },
      }),
    );
  });
}

function async handleDone(ws: WebSocket) {
  if (!checkRole(ws, UserRoles.STUDENT)) {
    return;
  }
  if (!activeSession) {
    ws.send(
      JSON.stringify({
        event: "ERROR",
        data: { message: "No active attendance session" },
      }),
    );
    return;
  }
  const classId = activeSession.classId;
  const currentClass = await Class.findById(classId).populate("studentIds");
  const students = currentClass?.studentIds!;
  for (const student of students) {
    if (!activeSession.attendance[student._id]) {
      activeSession.attendance[student._id] = "absent"
    }
  }
  await Attendance.create(activeSession)
  const totalPresent = Object.values(activeSession.attendance).filter(
    (ele) => ele === "present",
  ).length;
  const totalAbsent = Object.values(activeSession.attendance).filter(
    (ele) => ele === "absent",
  ).length;
  const total = totalAbsent + totalPresent;
  activeSession = null;

}

function handleMyAttendance(ws: WebSocket) {
  if (!checkRole(ws, UserRoles.STUDENT)) {
    return;
  }
  if (!activeSession) {
    ws.send(
      JSON.stringify({
        event: "ERROR",
        data: { message: "No active attendance session" },
      }),
    );
    return;
  }

  const checkAttendance =
    activeSession.attendance[ws.user.userId] ?? "not updated yet";

  ws.send(
    JSON.stringify({
      event: "MY_ATTENDANCE",
      data: { checkAttendance },
    }),
  );
}

export function initWsServer(server: any) {
  const wss = new WebSocketServer({ server });

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
    console.log("client connected");

    ws.on("message", (raw) => {
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
          handleDone(ws, wss);
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
