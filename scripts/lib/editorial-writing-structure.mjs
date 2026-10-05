// These are wording checks, not verification of ownership, authorship, or sources.
export function inspectEditorialWritingStructure({ opening = '', paragraphs = [] } = {}) {
  const visibleText = paragraphs.join(' ');
  const topic = /\b(?:Access Free Tools|browser|repository|tool|page|site|draft|image|text|model|install\w*)\b/i;
  const practicalDetail = /\b(?:check\w*|compar\w*|choos\w*|read\w*|load\w*|build\w*|run\w*|us(?:e|es|ing)|edit\w*|review\w*|install\w*|recogn\w*|risk\w*|mistake\w*|limit\w*|cannot|does not|need\w*|result\w*|stay\w*|keep\w*)\b/i;
  const concreteOpening = topic.test(opening) && practicalDetail.test(opening);
  const ownerDisclosure = /\b(?:I own Access Free Tools|Brendan Chambers owns Access Free Tools|Access Free Tools is owned by Brendan Chambers)\b/i.test(visibleText);
  const aiAssistance = /\b(?:AI[-\s]+assisted|AI assistance|AI (?:helped|assisted|was used|supported))\b/i;
  const processScope = /\b(?:research|draft\w*|source\w*|code|fact\w*|revision\w*|revis\w*|edit\w*|check\w*)\b/i;
  const processDisclosure = paragraphs.some((paragraph) => aiAssistance.test(paragraph) && processScope.test(paragraph));

  return {
    concreteOpening,
    ownerDisclosure,
    processDisclosure,
    contextAndDisclosure: (concreteOpening ? 4 : 0) + (ownerDisclosure ? 3 : 0) + (processDisclosure ? 3 : 0),
  };
}
