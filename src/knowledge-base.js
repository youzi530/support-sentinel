const articles = [
  {
    id: "shipping-policy",
    title: "Shipping policy",
    keywords: ["shipping", "delivery", "arrive", "standard", "long"],
    answer: "Standard shipping arrives in 3–5 business days after your order is processed."
  },
  {
    id: "returns-policy",
    title: "Returns policy",
    keywords: ["return", "refund", "window"],
    answer: "Unused items can be returned within 30 days of delivery."
  },
  {
    id: "cancellation-policy",
    title: "Order cancellation policy",
    keywords: ["cancel", "cancellation", "processing", "shipped"],
    answer: "Orders can only be cancelled while they are still processing."
  }
];

export function findKnowledgeAnswer(message) {
  const normalized = message.toLowerCase();
  const ranked = articles
    .map((article) => ({ article, score: article.keywords.filter((keyword) => normalized.includes(keyword)).length }))
    .sort((left, right) => right.score - left.score);
  const { article, score } = ranked[0];

  return score > 0
    ? {
        message: article.answer,
        evidence: article.answer,
        confidence: score / article.keywords.length,
        source: { id: article.id, title: article.title }
      }
    : null;
}
