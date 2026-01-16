type IAttendanceSession = {
  classId: string;
  startedAt: string;
  attendance: Record<string, "present" | "absent" | undefined>;
};

export let activeSession: IAttendanceSession | null = null;

export function createActiveAttendanceSession(session: IAttendanceSession) {
  if (activeSession) {
    activeSession = null;
  }
  activeSession = session;
  return activeSession;
}

export function setActiveSessionToNull() {
  activeSession = null;
}
