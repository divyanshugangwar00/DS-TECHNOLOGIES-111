/** Notifications helper.
 *  WhatsApp auto-open is OFF by default (was opening tab on every attendance mark).
 *  Backend email (SMTP) is preferred. Pass { openWhatsApp: true } only when admin explicitly wants WA share.
 */

export function notifyWhatsApp(phone, message, { open = false } = {}) {
  if (!phone) return null;
  const num = String(phone).replace(/\D/g, '');
  const normalized = num.length === 10 ? `91${num}` : num;
  const url = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  if (open) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    console.log('[notify] WhatsApp link (not opened):', url);
  }
  return url;
}

export function notifyEmail(email, subject, body, { open = false } = {}) {
  if (!email) return null;
  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (open) window.open(url, '_blank');
  else console.log('[notify] mailto (not opened):', email, subject);
  return url;
}

/** Attendance: do NOT open WhatsApp — server email handles alerts when SMTP is set */
export function notifyAttendance({ name, phone, email, status, date, openWhatsApp = false }) {
  const msg = `DS-TECHNOLOGIES Attendance\n\nHello ${name || 'Team member'},\nYour attendance for ${date || 'today'} is marked: ${status}.\n\n— HR, DS-TECHNOLOGIES`;
  if (openWhatsApp && phone) notifyWhatsApp(phone, msg, { open: true });
  // no mailto popup either
  return { phone, email, status };
}

export function notifyJobSelected({ name, phone, email, jobTitle, openWhatsApp = false }) {
  const msg = `DS-TECHNOLOGIES — Application Update\n\nHello ${name || 'Candidate'},\nCongratulations! Your application for "${jobTitle || 'the role'}" has been selected / shortlisted.\n\n— Talent Team, DS-TECHNOLOGIES`;
  if (openWhatsApp && phone) notifyWhatsApp(phone, msg, { open: true });
}

export function notifyJobRejected({ name, phone, email, jobTitle, openWhatsApp = false }) {
  const msg = `DS-TECHNOLOGIES — Application Update\n\nHello ${name || 'Candidate'},\nThank you for applying for "${jobTitle || 'the role'}". We are unable to proceed at this time.\n\n— Talent Team, DS-TECHNOLOGIES`;
  if (openWhatsApp && phone) notifyWhatsApp(phone, msg, { open: true });
}
