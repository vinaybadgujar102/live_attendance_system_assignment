import { WebSocketServer, WebSocket } from "ws";
import { UserRoles } from "../models/User.model";
import { activeSession, setActiveSessionToNull } from "./attendanceState";
import { Class } from "../models/Class.model";
import { Attendance } from "../models/Attendance.model";

type AttendanceMarkedPayload = {
  studentId: string;
  status: "present" | "absent";
};

export function checkRole(ws: WebSocket, role: UserRoles) {
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

export function handleAttendanceMarked(
  ws: WebSocket,
  data: AttendanceMarkedPayload,
  wss: WebSocketServer,
) {
  try {
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
    const payload = {
      event: "ATTENDANCE_MARKED",
      data: { studentId, status },
    };
    wss.clients.forEach((client) => {
      if (client === ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            event: "ATTENDANCE_MARKED",
            data: { studentId, status },
          }),
        );
        console.log("semt");
      }
    });
    return payload;
  } catch (error) {
    ws.send(
      JSON.stringify({
        event: "ERROR",
        data: { message: "No active attendance session" },
      }),
    );
    return;
  }
}

export function handleTodaySummary(ws: WebSocket, wss: WebSocketServer) {
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
          total: total,
        },
      }),
    );
  });
}

export async function handleDone(ws: WebSocket, wss: WebSocketServer) {
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
      activeSession.attendance[student._id] = "absent";
    }
  }
  await Attendance.create(activeSession);
  const totalPresent = Object.values(activeSession.attendance).filter(
    (ele) => ele === "present",
  ).length;
  const totalAbsent = Object.values(activeSession.attendance).filter(
    (ele) => ele === "absent",
  ).length;
  const total = totalAbsent + totalPresent;
  setActiveSessionToNull();
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        event: "DONE",
        data: {
          message: "Attendance persisted",
          present: totalPresent,
          absent: totalAbsent,
          total: total,
        },
      }),
    );
  });
}

export function handleMyAttendance(ws: WebSocket) {
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
