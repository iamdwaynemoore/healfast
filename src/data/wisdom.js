export const DAILY_WISDOM = [
  "My body knows how to heal itself.",
  "I move through life with grace and intention.",
  "Stillness reveals my inner strength.",
  "Each moment of hunger is a moment of healing.",
  "I am becoming the best version of myself.",
  "My willpower grows stronger with each passing hour.",
  "I trust my body's ancient wisdom.",
  "Peace flows through me like a gentle river.",
  "I am worthy of this transformation.",
  "My mind is clear, my purpose is strong.",
  "I embrace this journey with courage and compassion.",
  "Every cell in my body is renewing itself.",
  "I am patient with my progress and gentle with myself.",
  "My spirit is unshakeable, my resolve is firm.",
  "I choose wellness, I choose vitality, I choose life.",
  "This temporary discomfort leads to lasting wellness.",
  "I am discovering reserves of strength I never knew I had.",
  "My body is my temple, and I honor it with rest.",
  "I am present, I am powerful, I am healing.",
  "Each breath brings me closer to my goals.",
  "I trust the process and surrender to the journey.",
  "My dedication today shapes my tomorrow.",
  "I am capable of amazing things.",
  "This moment of discipline is a gift to my future self.",
  "I listen to my body with wisdom and respect.",
  "My journey is unique, and I honor my own pace.",
  "I am transforming from the inside out.",
  "Clarity emerges from the quiet spaces within.",
  "I am stronger than any craving.",
  "My commitment to myself is unbreakable.",
  "Today, I choose progress over perfection."
];

export function getDailyAffirmation() {
  // Use the day of the year to select an affirmation consistently for each day
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  return DAILY_WISDOM[dayOfYear % DAILY_WISDOM.length];
}