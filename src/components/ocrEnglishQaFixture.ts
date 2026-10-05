// The existing BrowserOcrOffline test defined this synthetic image before the
// downloadable file was added. It is a workflow fixture, not an accuracy corpus.
export const ocrEnglishQaFixture = {
  path: '/samples/ocr-synthetic-english.png',
  filename: 'ocr-synthetic-english.png',
  text: 'ACCESS FREE TOOLS 12345',
  width: 1200,
  height: 220,
  background: 'white',
  foreground: 'black',
  font: '64px Arial',
  x: 40,
  y: 130,
} as const;
