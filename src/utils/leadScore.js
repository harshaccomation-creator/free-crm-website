export const LEAD_SCORE_RULES = {
  CALL_CONNECTED: 15,
  DEMO_BOOKED: 20,
  DEMO_DONE: 30,
  WON: 35,
};

const normalize = (value = "") => String(value).trim().toLowerCase();

export function calculateLeadScore(activities = []) {
  const flags = {
    callConnected: false,
    demoBooked: false,
    demoDone: false,
    won: false,
  };

  activities.forEach((activity) => {
    const type = normalize(activity.type || activity.status || activity.stage || activity.title);

    if (["connected", "call connected", "call_connected"].includes(type)) flags.callConnected = true;
    if (["demo booked", "demo_booked", "book demo", "demo scheduled"].includes(type)) flags.demoBooked = true;
    if (["demo done", "demo_done", "demo completed"].includes(type)) flags.demoDone = true;
    if (["won", "lead won", "closed won"].includes(type)) flags.won = true;
  });

  let score = 0;
  if (flags.callConnected) score += LEAD_SCORE_RULES.CALL_CONNECTED;
  if (flags.demoBooked) score += LEAD_SCORE_RULES.DEMO_BOOKED;
  if (flags.demoDone) score += LEAD_SCORE_RULES.DEMO_DONE;
  if (flags.won) score += LEAD_SCORE_RULES.WON;

  return Math.min(100, score);
}

export function getScoreLabel(score = 0) {
  if (score >= 70) return "Hot";
  if (score >= 35) return "Warm";
  return "Cold";
}
