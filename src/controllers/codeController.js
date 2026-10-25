/**
 * Code Execution Controller
 * Uses Judge0 CE public engine for fast, multi-language sandbox execution:
 * - C (GCC 14.1.0)
 * - C++ (GCC 14.1.0)
 * - Python (3.12.5)
 * - Java (JDK 17)
 */

const JUDGE0_URL = 'https://ce.judge0.com/submissions?base64_encoded=false&wait=true';

// Map frontend language IDs to Judge0 language IDs
const LANGUAGE_MAP = {
  c:      103, // C (GCC 14.1.0)
  cpp:    105, // C++ (GCC 14.1.0)
  'c++':  105, // C++ (GCC 14.1.0)
  python: 100, // Python (3.12.5)
  py:     100,
  java:   91,  // Java (JDK 17.0.6)
};

// Default boilerplate code for each language
const BOILERPLATE = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    cout << "Hello, World!" << "\\n";
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  python: `# Write your Python solution here

print("Hello, World!")`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Hello, World!");
    }
}`,
};

exports.executeCode = async (req, res) => {
  const { language, code, stdin } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required.' });
  }

  const langKey = language.toLowerCase();
  const judge0LangId = LANGUAGE_MAP[langKey];
  if (!judge0LangId) {
    return res.status(400).json({
      error: `Unsupported language: ${language}. Supported: c, c++, python, java`,
    });
  }

  try {
    const response = await fetch(JUDGE0_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: judge0LangId,
        stdin: stdin || '',
        cpu_time_limit: 5,
        wall_time_limit: 10,
        memory_limit: 256000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Judge0 API error:', response.status, errText);
      return res.status(502).json({
        error: 'Execution service temporarily busy. Please try again.',
      });
    }

    const data = await response.json();
    const statusDesc = data.status?.description || '';
    const statusId = data.status?.id || 0;

    // Check for Compilation Error (Judge0 status ID 6)
    if (statusId === 6 || data.compile_output) {
      return res.json({
        status: 'compilation_error',
        output: '',
        error: (data.compile_output || data.stderr || 'Compilation failed').trim(),
        time: data.time ? Math.round(parseFloat(data.time) * 1000) : null,
        memory: data.memory || null,
        verdict: 'Compilation Error',
      });
    }

    // Check for Time Limit Exceeded (Judge0 status ID 5)
    if (statusId === 5 || statusDesc.includes('Time Limit')) {
      return res.json({
        status: 'runtime_error',
        output: (data.stdout || '').trimEnd(),
        error: 'Time Limit Exceeded: Your program exceeded the maximum execution time (5s). Check for infinite loops.',
        time: data.time ? Math.round(parseFloat(data.time) * 1000) : null,
        memory: data.memory || null,
        verdict: 'Time Limit Exceeded',
      });
    }

    // Check for Runtime Errors (Judge0 status ID 7..12)
    if (statusId >= 7 || data.stderr) {
      return res.json({
        status: 'runtime_error',
        output: (data.stdout || '').trimEnd(),
        error: (data.stderr || data.message || statusDesc).trim(),
        time: data.time ? Math.round(parseFloat(data.time) * 1000) : null,
        memory: data.memory || null,
        verdict: statusDesc || 'Runtime Error',
      });
    }

    // Success (Judge0 status ID 3: Accepted)
    return res.json({
      status: 'success',
      output: (data.stdout || '').trimEnd(),
      error: '',
      time: data.time ? Math.round(parseFloat(data.time) * 1000) : null,
      memory: data.memory || null,
      verdict: 'Success',
    });
  } catch (err) {
    console.error('Execution error:', err);
    return res.status(500).json({
      error: 'Failed to execute code. Please try again.',
    });
  }
};

exports.getBoilerplate = (req, res) => {
  const { language } = req.params;
  const key = language === 'c++' ? 'cpp' : language.toLowerCase();
  const boilerplate = BOILERPLATE[key] || BOILERPLATE.cpp;
  res.json({ code: boilerplate });
};
