export interface AiInstructionRepair {
  instructions: string[];
  trustNotes: string[];
  guidePrivacyParagraphs: string[];
  faqAnswers: {
    privacy: string;
    firstRun: string;
  };
}

export const aiInstructionRepairs: Partial<Record<string, AiInstructionRepair>> = {
  'image-to-text-ocr-tool': {
    instructions: [
      'Choose a sharp PNG, JPEG, or WebP image in Image file. Use typed or printed text with good contrast.',
      'Keep the image within 10 MiB, 8 million pixels, and 8,192 pixels on either side.',
      'Choose the matching OCR language: English, Spanish, French, German, Italian, or Portuguese.',
      'Press Read text. The browser loads the OCR files after this action. Use Cancel OCR if you need to stop.',
      'Compare the extracted text with the image, especially names, totals, dates, and codes. Then use Copy result or select the text.',
    ],
    trustNotes: [
      'The OCR operation processes the selected image in this browser tab without uploading it to Access Free Tools.',
      'Tesseract.js worker, WebAssembly core, and selected language files load from Access Free Tools after you press Read text.',
      'OCR reads printed text shapes. Blur, glare, columns, handwriting, and similar characters can produce mistakes. Check the original before using the output.',
      'These notes describe OCR processing. See the Privacy Policy for the site\'s separate analytics and session-replay handling.',
    ],
    guidePrivacyParagraphs: [
      'The tool decodes the selected image and runs OCR in this browser tab without uploading the image to Access Free Tools.',
      'Tesseract.js worker, WebAssembly core, and selected language files load from Access Free Tools after you press Read text. The first run can take longer while those files load.',
      'This describes OCR processing. The Privacy Policy explains separate site analytics and session-replay handling.',
    ],
    faqAnswers: {
      privacy: 'The OCR operation reads the selected image in your browser tab without uploading it to Access Free Tools. The Tesseract.js worker, core, and selected language files load from Access Free Tools after you press Read text. See the Privacy Policy for separate site analytics and session-replay handling.',
      firstRun: 'After you press Read text, the browser loads the OCR worker, WebAssembly core, and selected language data. Later runs may reuse cached files. A large or unclear image can still take longer, and Cancel OCR stops the current run.',
    },
  },
  'sentiment-analyzer': {
    instructions: [
      'Paste one focused review, comment, or short paragraph into Text to analyze. Enter at least 12 characters after trimming spaces at the ends.',
      'Press Analyze sentiment. Model and runtime files load after this action when the browser needs them.',
      'Read Likely positive, Likely negative, or Neutral or mixed with the positive, neutral, and negative model scores.',
      'If the result says Local fallback result, read Positive clues and Negative clues as word counts. These counts are not model confidence scores.',
      'Check sarcasm, mixed feelings, slang, and context yourself before changing or sending a message.',
    ],
    trustNotes: [
      'Sentiment analysis processes the pasted text in this browser tab without uploading it to Access Free Tools or a model host for analysis.',
      'After Analyze sentiment, Transformers.js loads the quantized Xenova/mobilebert-uncased-mnli model from Access Free Tools. Its browser runtime may load from jsDelivr.',
      'If the model is unavailable, a local fallback counts positive and negative word clues. A tied clue count returns Likely positive, so inspect both counts.',
      'Model scores compare the supplied positive, neutral, and negative labels. They do not prove the writer\'s feelings or intent.',
      'These notes describe sentiment processing. See the Privacy Policy for the site\'s separate analytics and session-replay handling.',
    ],
    guidePrivacyParagraphs: [
      'Sentiment analysis processes the pasted text in this browser tab without uploading it to Access Free Tools or a model host for analysis.',
      'After Analyze sentiment, Transformers.js loads the quantized Xenova/mobilebert-uncased-mnli model from Access Free Tools. The browser runtime may load from jsDelivr. Those hosts receive asset requests, rather than your pasted text.',
      'If model loading or analysis fails, the tool counts local positive and negative word clues. Read the Local fallback result label and clue counts before interpreting that simpler estimate.',
      'This describes sentiment processing. The Privacy Policy explains separate site analytics and session-replay handling.',
    ],
    faqAnswers: {
      privacy: 'Sentiment analysis runs in this browser tab without uploading the text to Access Free Tools or a model host for analysis. Model files load from Access Free Tools and the runtime may load from jsDelivr. Those asset requests expose normal connection information to the host, without including the pasted text. See the Privacy Policy for separate site analytics and session-replay handling.',
      firstRun: 'After Analyze sentiment, the browser may need to load the quantized Xenova/mobilebert-uncased-mnli model and its runtime. Later runs may reuse cached files. If the model is unavailable, Local fallback result shows word-clue counts instead of model confidence scores.',
    },
  },
  'text-summarizer': {
    instructions: [
      'Paste a passage into Text to summarize. Use 80 to 6,000 characters after trimming spaces at the ends.',
      'Press Summarize text. The browser attempts to load the summarization model after this action.',
      'Read the draft and compare it with the original passage. Check names, numbers, dates, exceptions, and quoted wording.',
      'If the result says Extractive fallback summary, it contains the first three sentences or fewer from your input. A short passage may remain unchanged.',
      'Edit and verify the summary before using Copy result or selecting the output.',
    ],
    trustNotes: [
      'Summarization processes the pasted passage in this browser tab without uploading it to Access Free Tools or a model host for analysis.',
      'After Summarize text, Transformers.js may fetch Xenova/distilbart-cnn-6-6 model files from Hugging Face and browser runtime files from jsDelivr.',
      'If the model is unavailable, the local fallback copies the first three sentences or fewer. It does not rank which sentences matter most.',
      'Check the original passage. Generated summaries can omit details or change meaning, and fallback text can miss points that appear later.',
      'These notes describe summarization. See the Privacy Policy for the site\'s separate analytics and session-replay handling.',
    ],
    guidePrivacyParagraphs: [
      'Summarization processes the pasted passage in this browser tab without uploading it to Access Free Tools or a model host for analysis.',
      'After Summarize text, Transformers.js may fetch Xenova/distilbart-cnn-6-6 model files from Hugging Face and browser runtime files from jsDelivr. Those hosts receive asset requests, rather than your passage.',
      'If the model is unavailable, the local fallback copies the first three sentences or fewer. It can return a short passage unchanged and does not select sentences by importance.',
      'This describes summarization. The Privacy Policy explains separate site analytics and session-replay handling.',
    ],
    faqAnswers: {
      privacy: 'Summarization runs in this browser tab without uploading the passage to Access Free Tools or a model host for analysis. Model files may load from Hugging Face and runtime files from jsDelivr. Those asset requests expose normal connection information to the hosts, without including the passage. See the Privacy Policy for separate site analytics and session-replay handling.',
      firstRun: 'After Summarize text, the browser attempts to load Xenova/distilbart-cnn-6-6 and its runtime. These files may require a download from Hugging Face and jsDelivr. If the model is unavailable, Extractive fallback summary copies the first three sentences or fewer from your input.',
    },
  },
  'keyword-extractor': {
    instructions: [
      'Paste at least 60 characters into Text to inspect, after trimming spaces at the ends. Use English text with repeated topics.',
      'Press Extract keywords. The browser counts the text without loading an AI model.',
      'Read Top words and Top phrases. The lists show up to eight repeated words and six repeated two-word pairs with their counts.',
      'The tool lowercases text, removes punctuation, listed common words, and tokens shorter than three characters. Pairs join the remaining neighboring tokens.',
      'Check each pair against your draft. Removing words or punctuation can join tokens that were not an exact phrase in the original.',
      'Use the counts to spot repetition and topics. They do not measure search demand, keyword difficulty, or ranking potential.',
    ],
    trustNotes: [
      'Keyword extraction counts text in this browser tab without uploading it to Access Free Tools. It needs no model download.',
      'This tool uses English-oriented word filtering and counts. Its character filter keeps a-z, digits, spaces, and hyphens, so accented and non-Latin text can lose characters.',
      'Only terms that occur more than once appear. Two-word pairs use filtered neighboring tokens and can bridge words or punctuation removed from the original.',
      'These notes describe keyword extraction. See the Privacy Policy for the site\'s separate analytics and session-replay handling.',
    ],
    guidePrivacyParagraphs: [
      'Keyword extraction counts text in this browser tab without uploading it to Access Free Tools for analysis.',
      'This tool needs no AI model or OCR files. After Extract keywords, it lowercases the text, filters words, and counts repeated tokens and neighboring token pairs.',
      'The English-oriented filter can remove accented or non-Latin characters. Removing common words and punctuation can also produce a two-word pair that was not a verbatim phrase in your draft.',
      'This describes keyword extraction. The Privacy Policy explains separate site analytics and session-replay handling.',
    ],
    faqAnswers: {
      privacy: 'Keyword extraction counts words and filtered neighboring token pairs in this browser tab without uploading the text to Access Free Tools for analysis. It uses no AI model or model host. See the Privacy Policy for separate site analytics and session-replay handling.',
      firstRun: 'Keyword extraction needs no model or OCR download. The browser counts the pasted text after Extract keywords. If no words or pairs repeat after filtering, the lists report that no repeated terms were found.',
    },
  },
  'image-classifier': {
    instructions: [
      'Choose a clear image in Image file. A browser-readable JPG, PNG, or WebP photo with one main subject is a useful starting point.',
      'Press Classify image. The browser attempts to load the image model after this action.',
      'Read the top label and up to five labels with scores. These are guesses from the model\'s learned labels.',
      'Compare the labels with the image yourself. Blur, crowded scenes, unusual objects, or poor lighting can change the result.',
      'If model loading fails, retry when the asset host is reachable. This classifier has no local label fallback.',
    ],
    trustNotes: [
      'Image classification processes the chosen image in this browser tab without uploading it to Access Free Tools or a model host for analysis.',
      'After Classify image, Transformers.js may fetch the q4 Xenova/vit-base-patch16-224 model from Hugging Face and browser runtime files from jsDelivr.',
      'Scores compare labels the model learned. A high score does not prove an object\'s identity, breed, authenticity, or safety.',
      'Use the labels for low-stakes checks. This tool does not provide identity, medical, legal, safety, or moderation decisions.',
      'These notes describe classification. See the Privacy Policy for the site\'s separate analytics and session-replay handling.',
    ],
    guidePrivacyParagraphs: [
      'Image classification processes the chosen image in this browser tab without uploading it to Access Free Tools or a model host for analysis.',
      'After Classify image, Transformers.js may fetch the q4 Xenova/vit-base-patch16-224 model from Hugging Face and browser runtime files from jsDelivr. Those hosts receive asset requests, rather than your image.',
      'The classifier requires the model to load. If loading or classification fails, it displays an error instead of substituting locally counted labels.',
      'This describes classification. The Privacy Policy explains separate site analytics and session-replay handling.',
    ],
    faqAnswers: {
      privacy: 'Classification runs in this browser tab without uploading the image to Access Free Tools or a model host for analysis. Model files may load from Hugging Face and runtime files from jsDelivr. Those asset requests expose normal connection information to the hosts, without including the image. See the Privacy Policy for separate site analytics and session-replay handling.',
      firstRun: 'After Classify image, the browser attempts to load the q4 Xenova/vit-base-patch16-224 model and its runtime. These files may require a download from Hugging Face and jsDelivr. If loading fails, the tool displays an error. It has no local classification fallback.',
    },
  },
  'tone-checker': {
    instructions: [
      'Paste one short draft into Message to check. Enter at least 12 characters after trimming spaces at the ends.',
      'Press Check tone. Model and runtime files load after this action when the browser needs them.',
      'Read the closest label among friendly or helpful, formal or careful, urgent or direct, and unclear or mixed.',
      'Tone model result shows label scores as percentages. Tone estimate uses local wording and punctuation clue scores when the model is unavailable.',
      'Compare the result with your audience, relationship, and situation. Edit the message yourself before sending it.',
    ],
    trustNotes: [
      'Tone checking processes the pasted draft in this browser tab without uploading it to Access Free Tools or a model host for analysis.',
      'After Check tone, Transformers.js loads the quantized Xenova/mobilebert-uncased-mnli model from Access Free Tools. Its browser runtime may load from jsDelivr.',
      'If the model is unavailable, Tone estimate ranks local word and punctuation clues. Those numeric scores are not model confidence percentages.',
      'Tone feedback helps you edit wording. It cannot establish the writer\'s personality, intent, or the recipient\'s reaction.',
      'These notes describe tone checking. See the Privacy Policy for the site\'s separate analytics and session-replay handling.',
    ],
    guidePrivacyParagraphs: [
      'Tone checking processes the pasted draft in this browser tab without uploading it to Access Free Tools or a model host for analysis.',
      'After Check tone, Transformers.js loads the quantized Xenova/mobilebert-uncased-mnli model from Access Free Tools. The browser runtime may load from jsDelivr. Those hosts receive asset requests, rather than your draft.',
      'If model loading or analysis fails, Tone estimate ranks local wording and punctuation clues. Read those numbers as clue scores, rather than model confidence percentages.',
      'This describes tone checking. The Privacy Policy explains separate site analytics and session-replay handling.',
    ],
    faqAnswers: {
      privacy: 'Tone checking runs in this browser tab without uploading the draft to Access Free Tools or a model host for analysis. Model files load from Access Free Tools and the runtime may load from jsDelivr. Those asset requests expose normal connection information to the host, without including the draft. See the Privacy Policy for separate site analytics and session-replay handling.',
      firstRun: 'After Check tone, the browser may need to load the quantized Xenova/mobilebert-uncased-mnli model and its runtime. Later runs may reuse cached files. If the model is unavailable, Tone estimate shows local word and punctuation clue scores instead of model confidence percentages.',
    },
  },
};
