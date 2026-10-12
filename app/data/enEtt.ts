
export type Article = "en" | "ett";

export type EnEttQuestion = {
  id: string;
  word: string;
  correctArticle: Article;
  explanation: string;
  example: string;
};

export const enEttQuestions: EnEttQuestion[] = [
  {
    id: "apple",
    word: "äpple",
    correctArticle: "ett",
    explanation:
      "Äpple är ett-ord. Många ord som slutar på -e är ett-ord, men det finns undantag.",
    example: "Jag äter ett äpple.",
  },
  {
    id: "book",
    word: "bok",
    correctArticle: "en",
    explanation:
      "Bok är ett en-ord. I bestämd form heter det boken.",
    example: "Jag läser en bok.",
  },
  {
    id: "house",
    word: "hus",
    correctArticle: "ett",
    explanation:
      "Hus är ett-ord. I bestämd form heter det huset.",
    example: "Vi bor i ett hus.",
  },
  {
    id: "school",
    word: "skola",
    correctArticle: "en",
    explanation:
      "Skola är ett en-ord. Många ord som slutar på -a är en-ord.",
    example: "Barnen går till en skola.",
  },
  {
    id: "window",
    word: "fönster",
    correctArticle: "ett",
    explanation:
      "Fönster är ett-ord. I bestämd form heter det fönstret.",
    example: "Jag öppnar ett fönster.",
  },
  {
    id: "chair",
    word: "stol",
    correctArticle: "en",
    explanation:
      "Stol är ett en-ord. I bestämd form heter det stolen.",
    example: "Hon sitter på en stol.",
  },
  {
    id: "question",
    word: "fråga",
    correctArticle: "en",
    explanation:
      "Fråga är ett en-ord. I bestämd form heter det frågan.",
    example: "Jag har en fråga.",
  },
  {
    id: "language",
    word: "språk",
    correctArticle: "ett",
    explanation:
      "Språk är ett-ord. I bestämd form heter det språket.",
    example: "Svenska är ett språk.",
  },
  {
    id: "friend",
    word: "vän",
    correctArticle: "en",
    explanation:
      "Vän är ett en-ord. I bestämd form heter det vännen.",
    example: "Jag har en bra vän.",
  },
  {
    id: "message",
    word: "meddelande",
    correctArticle: "ett",
    explanation:
      "Meddelande är ett-ord. Många ord som slutar på -ande är ett-ord.",
    example: "Jag fick ett meddelande.",
  },
];
