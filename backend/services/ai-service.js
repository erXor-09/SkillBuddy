// ============================================================================
// SKILLBUDDY AI SERVICE - Groq (Primary) + OpenRouter (Fallback)
// backend/services/ai-service.js
// ============================================================================

const axios = require('axios');

// ── Groq config (free, 14 400 req/day, no credit card) ────────────────────
const GROQ_API_KEY   = process.env.GROQ_API_KEY;
const GROQ_MODEL     = process.env.GROQ_MODEL || 'llama3-8b-8192';

// ── OpenRouter config (fallback) ──────────────────────────────────────────
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OR_MODEL       = process.env.AI_MODEL || 'mistralai/mistral-7b-instruct:free';
const SITE_URL       = process.env.SITE_URL || 'http://localhost:5173';
const SITE_NAME      = process.env.SITE_NAME || 'SkillBuddy';

if (!GROQ_API_KEY && !OPENROUTER_API_KEY) {
  console.warn('⚠️  No AI key found. Set GROQ_API_KEY in backend/.env');
} else if (GROQ_API_KEY) {
  console.log(`🤖 AI: Groq (${GROQ_MODEL})`);
} else {
  console.log(`🤖 AI: OpenRouter (${OR_MODEL})`);
}

// Helper function to clean AI responses
function cleanJSONResponse(text) {
  let cleaned = text.trim()
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  const arrayMatch = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
  const objectMatch = cleaned.match(/\{\s*"[\s\S]*\}/);

  if (arrayMatch) cleaned = arrayMatch[0];
  else if (objectMatch) cleaned = objectMatch[0];

  return cleaned;
}

// ── Core AI caller — tries Groq first, falls back to OpenRouter ────────────
async function callOpenRouter(prompt, maxTokens = 3000) {
  const systemMsg = 'You are a helpful educational assistant. Always respond with valid JSON only, no markdown formatting or explanations.';

  // ── 1. Try Groq (primary) ─────────────────────────────────────────────
  if (GROQ_API_KEY) {
    try {
      console.log(`🤖 Groq AI (${GROQ_MODEL})…`);
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemMsg },
            { role: 'user',   content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type':  'application/json',
          },
          timeout: 30000,
        }
      );
      const content = res.data.choices[0]?.message?.content;
      console.log('✅ Groq response, length:', content?.length);
      return content;
    } catch (err) {
      const status = err.response?.status;
      const msg    = err.response?.data?.error?.message || err.message;
      console.warn(`⚠️  Groq failed (${status}): ${msg}`);
      if (!OPENROUTER_API_KEY) throw new Error(`Groq error (${status}): ${msg}`);
      console.log('↩️  Falling back to OpenRouter…');
    }
  }

  // ── 2. OpenRouter fallback ────────────────────────────────────────────
  if (!OPENROUTER_API_KEY) {
    throw new Error('No AI provider configured. Please set GROQ_API_KEY in backend/.env');
  }

  try {
    console.log(`🤖 OpenRouter (${OR_MODEL})…`);
    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: OR_MODEL,
        messages: [
          { role: 'system', content: systemMsg },
          { role: 'user',   content: prompt },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer':  SITE_URL,
          'X-Title':       SITE_NAME,
          'Content-Type':  'application/json',
        },
        timeout: 45000,
      }
    );
    const content = res.data.choices[0]?.message?.content;
    console.log('✅ OpenRouter response, length:', content?.length);
    return content;
  } catch (err) {
    const status = err.response?.status;
    const msg    = err.response?.data?.error?.message || err.message;
    console.error(`❌ OpenRouter error (${status}): ${msg}`);
    if (status === 401) throw new Error('AI provider auth failed. Check your API key and account credits.');
    if (status === 429) throw new Error('AI rate limit reached. Please wait a moment.');
    throw err;
  }
}

async function generateAssessmentQuestions(field, level, count = 5) {
  const prompt = `Generate exactly ${count} multiple-choice questions for a ${level} level assessment in ${field}.

CRITICAL: Return ONLY valid JSON array, no markdown.

Format:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Why it is correct",
    "hint": "Helpful hint",
    "bloomLevel": "understand",
    "topic": "Specific topic"
  }
]

Requirements:
- Exactly ${count} questions
- correctAnswer must match one option exactly
- bloomLevel: remember, understand, apply, analyze, evaluate, or create`;

  try {
    const response = await callOpenRouter(prompt);
    const cleaned = cleanJSONResponse(response);
    const questions = JSON.parse(cleaned);

    // Validation
    if (!Array.isArray(questions)) throw new Error('Not an array');

    // Normalize
    return questions.slice(0, count).map((q, i) => ({
      question: q.question || `Question ${i + 1}`,
      options: Array.isArray(q.options) ? q.options.slice(0, 4) : ['A', 'B', 'C', 'D'],
      correctAnswer: q.correctAnswer || (q.options ? q.options[0] : 'A'),
      explanation: q.explanation || 'No explanation provided.',
      hint: q.hint || 'No hint available.',
      bloomLevel: q.bloomLevel || 'understand',
      topic: q.topic || field
    }));
  } catch (error) {
    console.error('AI Gen Questions Failed:', error.message);
    // Return robust fallback questions so the UI continues to work
    return [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Mark Language", "Home Tool Markup Language"],
        correctAnswer: "Hyper Text Markup Language",
        explanation: "HTML is the standard markup language for documents designed to be displayed in a web browser.",
        hint: "It's the standard markup language for Web pages.",
        bloomLevel: "remember",
        topic: "Web Fundamentals"
      },
      {
        question: "Which CSS property is used to change the text color of an element?",
        options: ["text-color", "color", "font-color", "fg-color"],
        correctAnswer: "color",
        explanation: "The color property specifies the color of text.",
        hint: "It's just the word for color.",
        bloomLevel: "remember",
        topic: "CSS"
      },
      {
        question: "In JavaScript, which symbol is used for comments?",
        options: ["//", "<!--", "#", "**"],
        correctAnswer: "//",
        explanation: "Double slashes // are used for single-line comments in JavaScript.",
        hint: "It's the same as C++ and Java.",
        bloomLevel: "remember",
        topic: "JavaScript"
      },
      {
        question: "What is the primary function of a database?",
        options: ["To style web pages", "To store and manage data", "To execute Python code", "To create user interfaces"],
        correctAnswer: "To store and manage data",
        explanation: "Databases are organized collections of data, generally stored and accessed electronically.",
        hint: "Think 'Data' base.",
        bloomLevel: "understand",
        topic: "Databases"
      },
      {
        question: "Which of these is a version control system?",
        options: ["Node.js", "React", "Git", "Docker"],
        correctAnswer: "Git",
        explanation: "Git is a distributed version control system for tracking changes in source code.",
        hint: "It's used by GitHub.",
        bloomLevel: "understand",
        topic: "Tools"
      }
    ];
  }
}

async function generateLearningPath(field, level, goals, quizResults = null) {
  const goalsText = Array.isArray(goals) ? goals.join(', ') : goals;

  let quizContext = "";
  if (quizResults) {
    const score = quizResults.score || 0;
    const total = quizResults.total || 5;
    const percentage = (score / total) * 100;
    const weakTopics = quizResults.details?.filter(d => !d.isCorrect).map(d => d.topic).join(', ') || "none";

    let adaptationInstruction = "";
    if (percentage < 40) {
      adaptationInstruction = "CRITICAL: The student struggled with the diagnostic (Score < 40%). You MUST include a dedicated 'Foundations & Review' module as Week 1 to bridge gaps, even if the requested level is higher.";
    } else if (percentage > 80) {
      adaptationInstruction = "CRITICAL: The student performed excellently (Score > 80%). You MUST skip generic basics and focus on advanced concepts, case studies, and complex applications immediately.";
    } else {
      adaptationInstruction = `The student has an average grasp. Ensure to specifically cover these weak topics in early modules: ${weakTopics}.`;
    }

    quizContext = `
    DIAGNOSTIC RESULTS:
    - Score: ${score}/${total}
    - Weak Topics: ${weakTopics}
    - ADAPTATION INSTRUCTION: ${adaptationInstruction}
    `;
  }

  const prompt = `Create a comprehensive 8-week personalized learning roadmap for a ${level} level student in ${field}.
  Student goals: ${goalsText}
  ${quizContext}
  
  CRITICAL: Return ONLY valid JSON, no markdown.
  
  Instructions:
  1. Act as an expert PERSONAL TUTOR. Write in an encouraging, instructional tone (e.g., "Start by...", "I want you to...").
  2. Break down the course into 8 Modules (one per Week).
  3. Inside each module, provide 3-5 concrete Topics/Tasks.
  4. Prefix Topic titles with a timeline (e.g., "Day 1-2: [Topic]").
  5. The 'description' must be a detailed, step-by-step guide on WHAT to do.
  
  Format:
  {
    "modules": [
      {
        "title": "Week 1: [Module Name]",
        "description": "In this first week, we will focus on establishing your foundation...",
        "duration": "1 week",
        "topics": [
          {
            "title": "Day 1-2: [Topic Title]",
            "description": "First, download VS Code. Then, create a new file called index.html. I want you to practice writing standard HTML5 boilerplate..."
          }
        ]
      }
    ]
  }
  
  Generate 8 modules.`;

  try {
    const response = await callOpenRouter(prompt, 3500);
    const cleaned = cleanJSONResponse(response);
    let learningPath = JSON.parse(cleaned);

    if (!learningPath.modules) throw new Error('No modules found');

    return learningPath;
  } catch (error) {
    console.error('AI Path Gen Failed:', error);
    return {
      modules: Array.from({ length: 4 }, (_, i) => ({
        title: `Module ${i + 1}: ${field} Basics`,
        description: 'Fallback module content',
        duration: '1 week',
        topics: [
          { title: 'Intro', description: 'Basics' },
          { title: 'Practice', description: 'Hands on' }
        ]
      }))
    };
  }
}

async function generateResourceRecommendations(field, level, weakTopics) {
  const topicsText = Array.isArray(weakTopics) ? weakTopics.join(', ') : 'general concepts';

  const prompt = `As an expert teacher, provide a comprehensive lesson plan for ${level} ${field}, focusing on: ${topicsText}.
    
    CRITICAL: Return ONLY valid JSON.
    
    Requirements:
    1. **Content**: A detailed, 300-500 word explanatory guide/mini-lesson on the topic. Use clear sections (Introduction, Key Concepts, Examples, Summary).
    2. **Resources**: 5 high-quality links (YouTube, Books, Web).
    
    Format:
    {
      "content": "### Introduction\\nThis topic covers...\\n\\n### Key Concepts\\n1. **Concept A**: ...", 
      "recommendations": [
        {
          "type": "youtube", 
          "title": "Video Title",
          "url": "https://youtube.com/...", 
          "difficulty": "Intermediate", 
          "topic": "Concept"
        }
      ]
    }`;

  try {
    const response = await callOpenRouter(prompt);
    const cleaned = cleanJSONResponse(response);
    const res = JSON.parse(cleaned);
    return res;
  } catch (error) {
    console.error('AI Resource/Content Gen Failed:', error);
    return {
      content: `### Overview\nHere is a brief overview of ${topicsText}.\n\n(AI generation failed, please consult resources)`,
      recommendations: [
        { type: 'article', title: `${field} Documentation`, url: 'https://docs.google.com', difficulty: level, topic: field }
      ]
    };
  }
}

async function generateQuizFromContext(topic, contextText, count = 5) {
  const prompt = `Generate exactly ${count} multiple-choice questions for a student learning about: "${topic}".
  Context/Description: "${contextText}".

  CRITICAL: Return ONLY valid JSON array, no markdown.

  Format:
  [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why it is correct",
      "hint": "Helpful hint"
    }
  ]`;

  try {
    const response = await callOpenRouter(prompt);
    const cleaned = cleanJSONResponse(response);
    const questions = JSON.parse(cleaned);

    if (!Array.isArray(questions)) throw new Error('Not an array');

    return questions.slice(0, count).map((q, i) => ({
      question: q.question || `Question ${i + 1}`,
      options: Array.isArray(q.options) ? q.options.slice(0, 4) : ['A', 'B', 'C', 'D'],
      correctAnswer: q.correctAnswer || (q.options ? q.options[0] : 'A'),
      explanation: q.explanation || 'No explanation provided.',
      hint: q.hint || 'No hint available.'
    }));
  } catch (error) {
    console.error('AI Quiz Gen Failed:', error.message);
    return [
      {
        question: `What is a key concept in ${topic}?`,
        options: ["Concept A", "Concept B", "Concept C", "Concept D"],
        correctAnswer: "Concept A",
        explanation: "This is a fallback question.",
        hint: "Pick the first option."
      }
    ];
  }
}

async function generateTopicQuiz(topic, className, level, bloomLevel = 'understand', contextText = '') {
  const prompt = `You are an expert instructor. Generate exactly 5 multiple-choice questions about "${topic}" for a ${level} student in "${className}".
Cognitive level: ${bloomLevel} (Bloom's Taxonomy).
${contextText ? `Context: ${contextText}` : ''}

Rules:
- Keep questions concise and clear
- 4 options per question, only one correct
- Include a short explanation and hint
- Return ONLY a valid JSON array, no markdown, no extra text

Format:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Why this is correct",
    "hint": "Helpful hint"
  }
]`;

  // Attempt to repair a truncated JSON array by closing any open object/array
  function repairTruncatedJSON(str) {
    let s = str.trim();
    // Remove any trailing comma
    s = s.replace(/,\s*$/, '');
    // Count unclosed braces/brackets
    let openObjects = 0, openArrays = 0;
    for (const ch of s) {
      if (ch === '{') openObjects++;
      else if (ch === '}') openObjects--;
      else if (ch === '[') openArrays++;
      else if (ch === ']') openArrays--;
    }
    // Close open objects first, then arrays
    for (let i = 0; i < openObjects; i++) s += '}';
    for (let i = 0; i < openArrays; i++) s += ']';
    return s;
  }

  try {
    const response = await callOpenRouter(prompt, 6000);
    let cleaned = cleanJSONResponse(response);

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (parseErr) {
      // Try repairing truncated JSON
      console.warn('Topic quiz JSON truncated, attempting repair…');
      cleaned = repairTruncatedJSON(cleaned);
      questions = JSON.parse(cleaned);
    }

    if (!Array.isArray(questions) || questions.length === 0) throw new Error('Empty or invalid array');

    return questions.map((q, i) => ({
      question: q.question || `Question ${i + 1}`,
      options: Array.isArray(q.options) && q.options.length >= 2 ? q.options.slice(0, 4) : ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: q.correctAnswer || (q.options?.[0] ?? 'Option A'),
      explanation: q.explanation || 'No explanation provided.',
      hint: q.hint || '',
      difficulty: q.difficulty || 5
    }));
  } catch (error) {
    console.error('AI Topic Quiz Gen Failed:', error.message);
    if (error.message && (error.message.includes('invalid') || error.message.includes('credits') || error.message.includes('rate limit'))) {
      throw error;
    }
    // Fallback only for genuine parse/network errors
    return Array.from({ length: 5 }, (_, i) => ({
      question: `Fallback: What is a key concept in ${topic}?`,
      options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      correctAnswer: 'Concept A',
      explanation: 'This is a fallback question (AI unavailable).',
      hint: 'Select the first option.',
      difficulty: 1
    }));
  }
}

// ============================================================================
// PDF MCQ GENERATION
// ============================================================================

/**
 * Split text into word-based chunks to avoid exceeding token limits.
 */
function chunkText(text, size = 800) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += size) {
    chunks.push(words.slice(i, i + size).join(' '));
  }
  return chunks;
}

/**
 * Generate MCQs from extracted PDF text using OpenRouter.
 * Processes text in chunks and aggregates results.
 */
async function generateMCQsForText(text) {
  const chunks = chunkText(text);
  let allMCQs = [];

  for (const chunk of chunks) {
    const prompt = `Generate 5 multiple-choice questions from the text below.

Rules:
- 4 options per question
- Only one correct answer
- Include an explanation for the correct answer
- Return ONLY a valid JSON array, no markdown

Format:
[
  {
    "question": "...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "..."
  }
]

Text:
${chunk}`;

    try {
      const result = await callOpenRouter(prompt, 2000);
      const cleaned = cleanJSONResponse(result);
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        allMCQs.push(...parsed);
      }
    } catch (e) {
      console.error('MCQ chunk parsing error:', e.message);
    }
  }

  return allMCQs;
}

async function generateQuizResources(field, level, topics = []) {
  const topicStr = topics.slice(0, 3).join(', ') || field;
  const prompt = `You are an educational resource curator. Return ONLY a valid JSON array (no markdown).
Provide exactly 5 recommended learning resources for a ${level} student who just completed a quiz on "${topicStr}" in ${field}.
Mix: 2 YouTube videos, 2 articles/docs, 1 interactive resource.
Format:
[
  {
    "title": "Resource title",
    "url": "https://actual-url.com",
    "type": "youtube",
    "description": "One short sentence why this helps",
    "duration": "10 min"
  }
]
Use real URLs (MDN, YouTube, freeCodeCamp, W3Schools, official docs).`;

  try {
    const response = await callOpenRouter(prompt, 1500);
    const cleaned = cleanJSONResponse(response);
    const resources = JSON.parse(cleaned);
    if (Array.isArray(resources) && resources.length > 0) return resources;
    throw new Error('Invalid resource array');
  } catch (error) {
    console.error('Quiz resource gen failed:', error.message);
    return [
      { title: `${field} — MDN Web Docs`, url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(field)}`, type: 'article', description: 'Comprehensive reference documentation', duration: '10 min' },
      { title: `${field} Full Course — freeCodeCamp`, url: 'https://www.youtube.com/c/Freecodecamp', type: 'youtube', description: 'Free in-depth video course', duration: '2 hrs' },
      { title: `${field} Tutorial — W3Schools`, url: 'https://www.w3schools.com', type: 'article', description: 'Beginner-friendly interactive reference', duration: '15 min' },
      { title: `${field} Videos`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(field + ' tutorial')}`, type: 'youtube', description: 'Video tutorials from top educators', duration: 'varies' },
      { title: `${field} — Khan Academy`, url: 'https://www.khanacademy.org', type: 'article', description: 'Structured learning with exercises', duration: '30 min' },
    ];
  }
}

module.exports = {
  generateAssessmentQuestions,
  generateLearningPath,
  generateResourceRecommendations,
  generateQuizFromContext,
  generateTopicQuiz,
  generateMCQsForText,
  generateQuizResources,
  callOpenRouter
};