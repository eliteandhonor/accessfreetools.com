import type { ToolExample, ToolFaq } from './tools';

export const markdownTableInstructions = [
  'In Headers, enter at least two named columns separated by commas or pipes. The headers choose the separator for every data row.',
  'In Rows, one per line, enter cells in the same column order and use the same separator. Blank lines are ignored; empty body cells are kept.',
  'For comma input, quote a cell containing commas and double quotes inside it: "Doe, Jane","Says ""hello""". For pipe input, write \\| for a literal pipe or put the pipe inside matched inline-code backticks.',
  'Choose Column alignment, then press Generate table. Short rows are padded with empty cells. Extra cells and unnamed headers show an error instead of being dropped.',
  'Check Columns and Rows, then use Copy answer. Preview the table in your publishing editor; cells keep inline Markdown syntax and every column uses the selected alignment.',
];

export const markdownTableInputExplanations = [
  { term: 'Headers', meaning: 'at least two named columns on one line. An unescaped pipe outside quotes or matched inline code selects pipe separators; otherwise the tool uses commas.' },
  { term: 'Rows, one per line', meaning: 'one data row per line, using the separator chosen by Headers. Empty cells are allowed. Comma input supports quoted fields and doubled quotes, with each field kept on one line.' },
  { term: 'Column alignment', meaning: 'Left aligned, Center aligned, or Right aligned for every column. This changes the Markdown delimiter row, not the cell values.' },
  { term: 'Columns and Rows', meaning: 'the number of named columns and nonblank data rows. The header and Markdown delimiter row are not counted as data rows.' },
];

export const markdownTableFaqLanguage = {
  expectedInputs: 'the column names, data rows, separator, and alignment you want',
  examplePhrase: 'Tool table preset or a worked example in the guide',
  doubleCheck: 'Check the column count, row count, chosen separator, and inline Markdown. The helper trims outer cell spaces and does not preserve raw CSV text formatting.',
  privacy: 'Table generation runs in your browser. The site also uses analytics described in the Privacy Policy. Avoid pasting confidential information.',
};

export const markdownTableExamples: ToolExample[] = [
  { label: 'Tool table', expression: 'Headers: Tool, Use, Status. Two rows: UTM Builder, Campaign links, Live / JSON Formatter, Read data, Live. Left aligned.', result: '3 columns, 2 body rows; delimiter: | --- | --- | --- |' },
  { label: 'Feature matrix', expression: 'Headers: Feature | Free | Notes. Two rows: Private browser use | Yes | Runs locally / Copy output | Yes | Check before sharing. Center aligned.', result: '3 columns, 2 body rows; delimiter: | :---: | :---: | :---: |' },
  { label: 'Simple report', expression: 'Headers: Metric, Value. Rows: Tools, 5 / Guides, 5. Right aligned.', result: '2 columns, 2 body rows; delimiter: | ---: | ---: |' },
];

export const markdownTableExtraFaq: ToolFaq[] = [
  {
    question: 'Can Markdown tables have merged cells or line breaks?',
    answer: 'This helper creates a simple GitHub-flavored Markdown table. It has no merged-cell or multiline-cell input. Each data row occupies one line. For a complex layout, use a table editor and check what your publishing platform supports.',
  },
  {
    question: 'How do I include a pipe character inside a cell?',
    answer: 'With pipe-separated headers, write \\| for a literal pipe in a cell. A pipe inside matched inline-code backticks is also kept in that cell and escaped in the output. With comma-separated headers, body pipes are cell content. Existing odd backslash escapes stay unchanged. Preview the result in your Markdown editor.',
  },
  {
    question: 'Can I paste CSV with quoted commas?',
    answer: 'Yes, when Headers uses commas. A row such as "Doe, Jane","Says ""hello""" produces the cells Doe, Jane and Says "hello". Quotes inside quoted fields must be doubled. Each quoted field must stay on one line; malformed or unclosed quotes show an error. This helper does not import CSV files or multiline CSV fields.',
  },
  {
    question: 'What happens when a row has missing or extra cells?',
    answer: 'A short row receives empty cells at the end. A row with more cells than the headers shows an error with its physical line number; the extra text is not discarded. Blank lines are ignored, but empty cells between separators are kept. Every header needs a name.',
  },
  {
    question: 'Can I paste a finished Markdown table?',
    answer: 'Enter its header cells in Headers and only its data rows in Rows, one per line. Paired outer pipes are accepted. Remove the Markdown delimiter row and code fences; the helper rejects these document markers. If a row starts and ends with a pipe, that pair is treated as outer table bars. Keep another separator inside the pair when the first or last cell should be empty.',
  },
  {
    question: 'Will CSV cells keep backslashes and Markdown formatting as plain text?',
    answer: 'Cells retain inline Markdown syntax, and outer spaces are trimmed. For example, the comma-input cell "C:\\|archive" produces C:\\|archive in the Markdown source. Its backslash is a Markdown pipe escape, so a Markdown renderer displays the pipe without that escape backslash. This is not a plain-text CSV export. Check paths, commands, code, and formatting in your target editor.',
  },
];

export const markdownTableGuideEnter = markdownTableInstructions;

export const markdownTableGuideRead = [
  'The main answer is Markdown source, not a rendered table preview. Copy the whole block, including its header and delimiter row.',
  'Columns counts the named headers. Rows counts nonblank data lines; short rows still count once after empty cells are added.',
  'Alignment shows the choice applied to every column. Center uses :---: and right uses ---: in the delimiter row; left uses ---.',
];

export const markdownTableGuideMistakes = [
  'Do not change separators halfway through the input. Headers selects comma or pipe mode once; a pipe in a comma-mode body cell does not switch modes.',
  'Quote a whole comma-input cell if it contains commas or quotes. Double quotes inside the field, and keep the field on one line.',
  'In pipe input, escape literal pipes with \\| or use matched inline-code backticks. An unmatched backtick does not protect a pipe from splitting the row.',
  'Remove code fences and the Markdown delimiter row before pasting data rows. Give every header a name and fix extra cells when an error identifies a row.',
  'Preview the result where you will publish it. Table support, inline Markdown, backslashes, and long mobile tables depend on the target editor.',
];

export const markdownTableGuideLogicNote = 'The headers choose one separator for the whole input. Comma mode handles single-line quoted fields and doubled quotes. Pipe mode keeps escaped pipes and pipes inside matched code spans. Blank data lines are skipped, short rows are padded, and extra cells or empty headers cause an error. Cells keep inline Markdown syntax; this helper does not convert arbitrary text into a literal-text table.';

interface MarkdownTableWorkedExample {
  label: string;
  headers: string;
  rows: string;
  alignment: 'left' | 'center' | 'right';
  output: string;
}

export const markdownTableWorkedExamples: MarkdownTableWorkedExample[] = [
  {
    label: 'Tool table',
    headers: 'Tool, Use, Status',
    rows: 'UTM Builder, Campaign links, Live\nJSON Formatter, Read data, Live',
    alignment: 'left',
    output: '| Tool | Use | Status |\n| --- | --- | --- |\n| UTM Builder | Campaign links | Live |\n| JSON Formatter | Read data | Live |',
  },
  {
    label: 'Quoted CSV',
    headers: 'Name, Note',
    rows: '"Doe, Jane","Says ""hello"""',
    alignment: 'left',
    output: '| Name | Note |\n| --- | --- |\n| Doe, Jane | Says "hello" |',
  },
  {
    label: 'Literal pipes and inline code',
    headers: 'Command | Note',
    rows: '`a | b` | A \\| B',
    alignment: 'left',
    output: '| Command | Note |\n| --- | --- |\n| `a \\| b` | A \\| B |',
  },
  {
    label: 'CSV backslash before a pipe',
    headers: 'Name, Note',
    rows: 'Alice,"C:\\|archive"',
    alignment: 'left',
    output: '| Name | Note |\n| --- | --- |\n| Alice | C:\\|archive |',
  },
];

const exampleBlocks = (example: MarkdownTableWorkedExample) => [
  { label: 'Headers', code: example.headers },
  { label: 'Rows, one per line', code: example.rows },
  { label: 'Expected output with Left aligned', code: example.output },
];

export const markdownTableGuideSections = [
  {
    title: 'A complete table from the Tool table preset',
    paragraphs: ['The Tool table preset contains three headers and two data rows. Choose Left aligned and press Generate table. The result reports 3 columns and 2 rows. Paste the entire output below into a Markdown editor that supports tables.'],
    codeBlocks: exampleBlocks(markdownTableWorkedExamples[0]),
  },
  {
    title: 'Quoted CSV: keep a comma inside a name',
    paragraphs: ['A comma in Doe, Jane belongs inside one cell. Quote that cell, and double each quote inside the next field. With comma-separated headers, this input creates two columns and one data row without dropping the note.'],
    codeBlocks: exampleBlocks(markdownTableWorkedExamples[1]),
  },
  {
    title: 'Literal pipes inside text and inline code',
    paragraphs: ['Here the headers select pipe mode. The matched backticks keep a | b in one command cell; the escaped pipe keeps A | B in the note cell. The output escapes both content pipes because GitHub-flavored Markdown requires this even inside inline code.'],
    codeBlocks: exampleBlocks(markdownTableWorkedExamples[2]),
  },
  {
    title: 'Backslashes remain Markdown syntax',
    paragraphs: ['This comma-input example contains one backslash before a pipe. The tool keeps that existing escape in the source. A Markdown renderer treats \\| as a pipe escape, so it displays the pipe without the escape backslash. The helper keeps inline Markdown rather than preserving every CSV character as visible plain text. Preview paths, commands, and code in your target editor.'],
    codeBlocks: exampleBlocks(markdownTableWorkedExamples[3]),
  },
  {
    title: 'Input limits and row errors',
    paragraphs: ['Use at least two named headers on one line and at least one nonblank data row. Comma mode supports single-line quoted cells, not multiline CSV fields. Pipe mode accepts paired outer bars, but a full pasted Markdown table must have its delimiter row and code fences removed first. Cells are trimmed and can contain inline Markdown.'],
    bullets: [
      'A short row is padded with empty cells; a long row shows its line number and is not truncated.',
      'To leave the first or last pipe-mode cell empty inside outer bars, include another pipe separator: | | middle | |.',
      'Use Column alignment for one alignment across the table. Per-column alignment, merged cells, and rendered preview are not available.',
      'After an invalid submission, the previous valid output stays visible. Fix the error and generate again before using Copy answer.',
    ],
  },
];
