/** Lower case without accents, so "emaille" finds "Émaillé". */
const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

const words = (text: string) => normalize(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

/** True when `a` and `b` differ by at most one typo: a wrong, missing, extra or swapped letter. */
function isOneTypoApart(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  if (i === a.length && i === b.length) return true;
  const rest = (s: string, from: number) => s.slice(from);
  return (
    rest(a, i + 1) === rest(b, i + 1) ||
    rest(a, i + 1) === rest(b, i) ||
    rest(a, i) === rest(b, i + 1) ||
    (a[i] === b[i + 1] && a[i + 1] === b[i] && rest(a, i + 2) === rest(b, i + 2))
  );
}

/** Typos are forgiven only in words this long: shorter ones would match almost anything. */
const FUZZY_MIN = 4;

/** How well one typed word matches a label: 0 starts a word, 1 is inside it, 2 has a typo; null when it does not. */
function tokenScore(token: string, label: string, labelWords: string[]): number | null {
  if (labelWords.some((word) => word.startsWith(token))) return 0;
  if (label.includes(token)) return 1;
  if (token.length < FUZZY_MIN) return null;
  const close = labelWords.some((word) =>
    [-1, 0, 1].some((extra) => isOneTypoApart(token, word.slice(0, token.length + extra))),
  );
  return close ? 2 : null;
}

/** The options similar to what is typed, best first; every typed word has to match. All of them while blank. */
export function rankOptions<T extends { label: string }>(options: T[], query: string): T[] {
  const typed = normalize(query);
  const tokens = words(query);
  if (!tokens.length) return options;

  return options
    .flatMap((option) => {
      const label = normalize(option.label);
      const labelWords = words(option.label);
      let score = label.startsWith(typed) ? -1 : 0;
      for (const token of tokens) {
        const one = tokenScore(token, label, labelWords);
        if (one === null) return [];
        score += one;
      }
      return [{ option, score }];
    })
    .sort((a, b) => a.score - b.score)
    .map((match) => match.option);
}
