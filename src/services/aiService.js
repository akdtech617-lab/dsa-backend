const AI_PROVIDER = process.env.AI_PROVIDER || 'anthropic';

const MENTOR_SYSTEM_PROMPT = `You are a patient senior software engineer, mentor, and tutor helping a student learn Data Structures & Algorithms.
- Explain concepts clearly with examples.
- When an image is provided (such as a problem statement, code screenshot, error log, or diagram like a tree, graph, or array):
  1. Carefully read the text, code, or visual structure depicted in the image.
  2. Identify key problem constraints, edge cases, and time/space complexity implications.
  3. If the image shows student code, identify any bugs or logic errors constructively.
- Ask useful follow-up questions to check understanding.
- Correct mistakes respectfully, never condescendingly.
- Adapt your depth to the student's apparent skill level.
- When asked for help on a problem, give hints and guiding questions first — do NOT immediately reveal the full solution unless the student explicitly insists after trying.
- Encourage independent thinking over spoon-feeding answers.`;

const BUG_EXPLAIN_SYSTEM_PROMPT = `You are an expert, encouraging Socratic DSA Mentor and Code Debugger.
A student was solving a Data Structures & Algorithms problem and encountered an error (Compilation Error, Runtime Error, or Wrong Answer).

Your goals:
1. Pinpoint the exact issue: logic flaw, edge case oversight (e.g. empty inputs, zero, negatives, duplicates), infinite loop/recursion, or syntax mistake.
2. Explain WHY the bug happens in simple, crystal-clear terms (2-3 concise paragraphs).
3. If it's a Compilation Error: Translate the compiler's confusing error into plain English, and show the exact 1-2 line fix.
4. If it's a Runtime Error / Wrong Answer: Socratic Hint first! Explain the failure mechanism (e.g. "On line 18, when arr has size 1, nums[i+1] attempts an out-of-bounds read"). Show only the minimal targeted fix snippet rather than dumping a whole 100-line solution.
5. Provide a quick "💡 Pro-Tip" for preventing this class of bug in tech interviews.
Format your output cleanly in Markdown with bold headers and syntax-highlighted code blocks.`;

function parseBase64Image(dataUri) {
  if (!dataUri) return null;
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return {
      mimeType: match[1],
      data: match[2]
    };
  }
  return {
    mimeType: 'image/png',
    data: dataUri
  };
}

async function callAnthropic(messages, systemPrompt = MENTOR_SYSTEM_PROMPT) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set in .env');

  const formattedMessages = messages.map(m => {
    if (m.image_data && m.role === 'user') {
      const img = parseBase64Image(m.image_data);
      const contentBlocks = [];
      if (img) {
        contentBlocks.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: img.mimeType,
            data: img.data
          }
        });
      }
      contentBlocks.push({
        type: 'text',
        text: m.content || 'Please analyze this image and guide me on how to approach it.'
      });
      return { role: m.role, content: contentBlocks };
    }
    return { role: m.role, content: m.content };
  });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: formattedMessages
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  const textBlock = data.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : '';
}

async function callOpenAI(messages, systemPrompt = MENTOR_SYSTEM_PROMPT) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set in .env');

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => {
      if (m.image_data && m.role === 'user') {
        return {
          role: m.role,
          content: [
            { type: 'text', text: m.content || 'Please analyze this image and guide me on how to approach it.' },
            { type: 'image_url', image_url: { url: m.image_data } }
          ]
        };
      }
      return { role: m.role, content: m.content };
    })
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: formattedMessages
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(messages, systemPrompt = MENTOR_SYSTEM_PROMPT) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set in .env');

  const primaryModel = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  // Fallback chain: try these models when the primary returns 503
  const fallbackModels = [
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.7-flash'
  ].filter(m => m !== primaryModel);

  const contents = messages.map(m => {
    const parts = [];
    if (m.image_data && m.role === 'user') {
      const img = parseBase64Image(m.image_data);
      if (img) {
        parts.push({
          inline_data: {
            mime_type: img.mimeType,
            data: img.data
          }
        });
      }
    }
    const text = m.content || (m.image_data ? 'Please analyze this problem or code from the attached image.' : '');
    if (text) {
      parts.push({ text });
    }
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts
    };
  });

  const requestBody = JSON.stringify({
    contents,
    systemInstruction: { parts: [{ text: systemPrompt }] }
  });

  // Try primary model with retries, then fallbacks
  const modelsToTry = [primaryModel, primaryModel, ...fallbackModels];
  const delays = [0, 1500, 0, 0, 0, 0];

  let lastError = null;
  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    if (delays[i] > 0) await new Promise(r => setTimeout(r, delays[i]));

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) {
          if (model !== primaryModel) {
            console.log(`[AI] Primary model ${primaryModel} unavailable, used fallback: ${model}`);
          }
          return text;
        }
      }

      // If 503 (overloaded) or 429, try next model
      if (response.status === 503 || response.status === 429) {
        console.warn(`[AI] Model ${model} returned ${response.status}, trying next...`);
        lastError = new Error(`${model} returned ${response.status}`);
        continue;
      }

      const errBody = await response.text();
      if (response.status === 404) {
        console.warn(`[AI] Model ${model} not found (404), trying next...`);
        lastError = new Error(`${model} not found`);
        continue;
      }
      throw new Error(`Gemini API error (${response.status}): ${errBody}`);
    } catch (err) {
      if (err.message.startsWith('Gemini API error')) throw err;
      lastError = err;
      console.warn(`[AI] Attempt ${i + 1} with ${model} failed: ${err.message}`);
    }
  }

  throw lastError || new Error('All Gemini models are currently unavailable. Please try again later.');
}

async function getMentorReply(messages, systemPrompt = MENTOR_SYSTEM_PROMPT) {
  switch (AI_PROVIDER) {
    case 'openai':
      return callOpenAI(messages, systemPrompt);
    case 'gemini':
      return callGemini(messages, systemPrompt);
    case 'anthropic':
    default:
      return callAnthropic(messages, systemPrompt);
  }
}

async function explainBug({ code, language, problemTitle, stdin, expectedOutput, actualOutput, status, errorMessage }) {
  const bugPrompt = `Problem: ${problemTitle || 'DSA Coding Problem'}
Language: ${language || 'cpp'}
Execution Verdict: ${status || 'Error'}

Input (stdin):
\`\`\`
${stdin || '(none)'}
\`\`\`

Expected Output:
\`\`\`
${expectedOutput || '(none)'}
\`\`\`

Actual Output:
\`\`\`
${actualOutput || '(none)'}
\`\`\`

${errorMessage ? `Error Output / Compiler Diagnostics:\n\`\`\`\n${errorMessage}\n\`\`\`\n` : ''}

Student's Submitted Code:
\`\`\`${language || 'cpp'}
${code}
\`\`\`

Please explain this bug, why it fails on this test case, and give me a clear Socratic hint to fix it.`;

  const messages = [{ role: 'user', content: bugPrompt }];
  return getMentorReply(messages, BUG_EXPLAIN_SYSTEM_PROMPT);
}

module.exports = { getMentorReply, explainBug };
