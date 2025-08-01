export const DAILY_WISDOM = [
  {
    quote: "The best of all medicines is resting and fasting.",
    author: "Benjamin Franklin"
  },
  {
    quote: "Fasting is the first principle of medicine.",
    author: "Rumi"
  },
  {
    quote: "A little starvation can really do more for the average sick man than can the best medicines and the best doctors.",
    author: "Mark Twain"
  },
  {
    quote: "He who eats until he is sick must fast until he is well.",
    author: "English Proverb"
  },
  {
    quote: "When the body is hungry, it eats itself, it cleanses itself.",
    author: "Socrates"
  },
  {
    quote: "Fasting is the soul's nourishment, it clears the mind and body.",
    author: "Ancient Wisdom"
  },
  {
    quote: "The light of the world will illuminate within you when you fast and purify yourself.",
    author: "Mahatma Gandhi"
  },
  {
    quote: "Fasting is a shield, it will protect you from the hellfire and prevent you from sins.",
    author: "Prophet Muhammad"
  },
  {
    quote: "Through fasting, let your mind depend on its own power.",
    author: "Buddha"
  },
  {
    quote: "Fasting cleanses the soul, raises the mind, subjects one's flesh to the spirit.",
    author: "Saint Augustine"
  },
  {
    quote: "The philosophy of fasting calls upon us to know ourselves, to master ourselves, and to discipline ourselves.",
    author: "Tariq Ramadan"
  },
  {
    quote: "Fasting is not just about food; it's about breaking patterns and creating space for growth.",
    author: "Modern Wisdom"
  },
  {
    quote: "In a fast, the body tears down its defective parts and then builds anew.",
    author: "Herbert Shelton"
  },
  {
    quote: "Fasting is the greatest remedy—the physician within.",
    author: "Paracelsus"
  },
  {
    quote: "When you fast, your body heals, your mind clears, and your spirit soars.",
    author: "Unknown"
  },
  {
    quote: "The hunger you feel is your body healing itself.",
    author: "Dr. Jason Fung"
  },
  {
    quote: "Fasting is the reset button for your body and mind.",
    author: "Modern Science"
  },
  {
    quote: "Every cell in your body benefits from the rest that fasting provides.",
    author: "Dr. Valter Longo"
  },
  {
    quote: "Fasting turns on the body's natural healing mechanisms.",
    author: "Dr. Mark Hyman"
  },
  {
    quote: "The absence of food is the presence of healing.",
    author: "Health Wisdom"
  },
  {
    quote: "Fasting: because sometimes the best thing you can do for your body is nothing.",
    author: "Wellness Proverb"
  },
  {
    quote: "Your body is designed to heal itself; fasting gives it the opportunity.",
    author: "Natural Health"
  },
  {
    quote: "In emptiness, we find fullness. In hunger, we find satisfaction.",
    author: "Zen Wisdom"
  },
  {
    quote: "Fasting sharpens the mind and strengthens the will.",
    author: "Ancient Philosophy"
  },
  {
    quote: "The body's wisdom emerges in the silence of fasting.",
    author: "Holistic Health"
  },
  {
    quote: "Fasting is not about deprivation; it's about liberation.",
    author: "Spiritual Teaching"
  },
  {
    quote: "When we stop consuming, we start transforming.",
    author: "Transformation Coach"
  },
  {
    quote: "Fasting teaches us that we need much less than we think we do.",
    author: "Minimalist Philosophy"
  },
  {
    quote: "The power to heal lies within you; fasting awakens it.",
    author: "Natural Medicine"
  },
  {
    quote: "Embrace the hunger, for it is the feeling of your body healing.",
    author: "Fasting Community"
  },
  {
    quote: "Fasting is the art of letting go to gain more.",
    author: "Wellness Wisdom"
  }
];

export function getDailyWisdom() {
  // Use the day of the year to select a quote consistently for each day
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  return DAILY_WISDOM[dayOfYear % DAILY_WISDOM.length];
}