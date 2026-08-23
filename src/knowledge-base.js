const articles = [
  {
    id: "shipping-policy",
    title: "Shipping policy",
    keywords: ["shipping", "delivery", "arrive", "standard"],
    answer: "Standard shipping arrives in 3–5 business days after your order is processed."
  },
  {
    id: "returns-policy",
    title: "Returns policy",
    keywords: ["return", "refund"],
    answer: "Unused items can be returned within 30 days of delivery."
  }
];

export function findKnowledgeAnswer(message) {
  const normalized = message.toLowerCase();
  const article = articles.find(({ keywords }) => keywords.some((keyword) => normalized.includes(keyword)));

  return article ? { message: article.answer, source: { id: article.id, title: article.title } } : null;
}
