import { LiveClassSession } from '../types';

/**
 * Automatically computes whether a live class session is:
 * - 'live_now': Current time is within [startTime, startTime + duration]
 * - 'scheduled': Current time is before startTime
 * - 'expired': Current time has passed [startTime + duration] -> Auto Removed
 */
export function getLiveSessionDynamicStatus(session: LiveClassSession): 'live_now' | 'scheduled' | 'expired' {
  if (!session.date || !session.time) return 'scheduled';
  
  try {
    const [year, month, day] = session.date.split('-').map(Number);
    const [hours, minutes] = session.time.split(':').map(Number);

    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
      return 'scheduled';
    }

    const startDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    const startTime = startDate.getTime();
    
    // Duration in minutes (default 90 mins)
    const durationMinutes = session.durationMinutes && session.durationMinutes > 0 ? session.durationMinutes : 90;
    const endTime = startTime + durationMinutes * 60 * 1000;
    const now = Date.now();

    if (now < startTime) {
      return 'scheduled';
    } else if (now >= startTime && now <= endTime) {
      return 'live_now';
    } else {
      // Time and duration have elapsed -> Automatically expired / removed
      return 'expired';
    }
  } catch (e) {
    return 'scheduled';
  }
}

/**
 * Filter only active live classes (removes expired ones) and sorts:
 * 1. Live Now sessions first
 * 2. Upcoming scheduled sessions sorted chronologically by start date/time
 */
export function getActiveLiveSessions(sessions: LiveClassSession[]): LiveClassSession[] {
  if (!Array.isArray(sessions)) return [];

  const active = sessions.filter(session => {
    const status = getLiveSessionDynamicStatus(session);
    return status !== 'expired';
  });

  return active.sort((a, b) => {
    const statusA = getLiveSessionDynamicStatus(a);
    const statusB = getLiveSessionDynamicStatus(b);

    if (statusA === 'live_now' && statusB !== 'live_now') return -1;
    if (statusB === 'live_now' && statusA !== 'live_now') return 1;

    const timeA = new Date(`${a.date}T${a.time || '00:00'}:00`).getTime() || 0;
    const timeB = new Date(`${b.date}T${b.time || '00:00'}:00`).getTime() || 0;
    return timeA - timeB;
  });
}

/**
 * Helper to format date & time into friendly Bengali strings
 */
export function formatBanglaLiveSchedule(dateStr: string, timeStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-');
    const [hh, mm] = (timeStr || '20:00').split(':');
    const hourNum = parseInt(hh, 10);
    const minuteNum = parseInt(mm, 10);
    
    const isPm = hourNum >= 12;
    const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    const period = hourNum >= 5 && hourNum < 12 ? 'সকাল' : hourNum >= 12 && hourNum < 16 ? 'দুপুর' : hourNum >= 16 && hourNum < 19 ? 'বিকাল' : 'রাত';
    
    const bnDate = `${d}/${m}/${y}`;
    const bnTime = `${period} ${displayHour.toLocaleString('bn-BD')}:${minuteNum < 10 ? '০' : ''}${minuteNum.toLocaleString('bn-BD')} মি.`;
    
    return `${bnDate} (${bnTime})`;
  } catch (e) {
    return `${dateStr} ${timeStr}`;
  }
}
