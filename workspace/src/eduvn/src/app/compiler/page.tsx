'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import {
  Code2,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Terminal,
  Trophy,
  Cpu,
  Layers,
  FileCode,
  Lightbulb,
} from 'lucide-react';
import styles from './page.module.css';

interface TestCase {
  input: string;
  expectedOutput: string;
  passed?: boolean;
}

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  language: 'javascript' | 'html' | 'python';
  description: string;
  initialCode: string;
  testCases: TestCase[];
  solutionExplanation: string;
}

const challenges: Challenge[] = [
  {
    id: 'chal-1',
    title: '1. Đảo Ngược Chuỗi (Reverse String)',
    difficulty: 'Dễ',
    language: 'javascript',
    description: 'Viết hàm `reverseString(str)` nhận vào một chuỗi và trả về chuỗi đảo ngược tương ứng.',
    initialCode: `function reverseString(str) {
  // Viết mã của bạn ở đây
  return str.split('').reverse().join('');
}

console.log(reverseString("EduVN"));
console.log(reverseString("ReactJS"));`,
    testCases: [
      { input: 'reverseString("EduVN")', expectedOutput: 'NVudE' },
      { input: 'reverseString("ReactJS")', expectedOutput: 'SJtcaeR' },
      { input: 'reverseString("Hello")', expectedOutput: 'olleH' },
    ],
    solutionExplanation: 'Sử dụng split("") để tách chuỗi thành mảng ký tự, reverse() để đảo ngược mảng và join("") để ghép lại thành chuỗi.',
  },
  {
    id: 'chal-2',
    title: '2. Tìm Số Lớn Nhất Trong Mảng (Find Max)',
    difficulty: 'Dễ',
    language: 'javascript',
    description: 'Viết hàm `findMax(arr)` nhận vào một mảng số nguyên và trả về giá trị số lớn nhất.',
    initialCode: `function findMax(arr) {
  // Viết mã của bạn ở đây
  return Math.max(...arr);
}

console.log(findMax([10, 45, 2, 89, 34]));`,
    testCases: [
      { input: 'findMax([10, 45, 2, 89, 34])', expectedOutput: '89' },
      { input: 'findMax([-5, -10, 0, 5])', expectedOutput: '5' },
    ],
    solutionExplanation: 'Sử dụng toán tử Spread Math.max(...arr) hoặc sử dụng vòng lặp duyệt từng phần tử để tìm max.',
  },
  {
    id: 'chal-3',
    title: '3. Kiểm Tra Số Nguyên Tố (Prime Number)',
    difficulty: 'Trung bình',
    language: 'javascript',
    description: 'Viết hàm `isPrime(n)` trả về `true` nếu `n` là số nguyên tố, ngược lại trả về `false`.',
    initialCode: `function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

console.log("7 là số nguyên tố:", isPrime(7));
console.log("10 là số nguyên tố:", isPrime(10));`,
    testCases: [
      { input: 'isPrime(7)', expectedOutput: 'true' },
      { input: 'isPrime(10)', expectedOutput: 'false' },
      { input: 'isPrime(13)', expectedOutput: 'true' },
    ],
    solutionExplanation: 'Một số nguyên tố lớn hơn 1 chỉ chia hết cho 1 và chính nó. Duyệt vòng lặp từ 2 đến căn bậc hai của n.',
  },
  {
    id: 'chal-4',
    title: '4. Tạo Nút Bấm Neon CSS & HTML',
    difficulty: 'Dễ',
    language: 'html',
    description: 'Tạo thẻ `<button>` HTML với class CSS `btn-neon` có màu chữ tím sáng và hiệu ứng phát sáng nhẹ.',
    initialCode: `<style>
  .btn-neon {
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 99px;
    border: none;
    font-weight: bold;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
    cursor: pointer;
  }
</style>

<button className="btn-neon">🔥 EduVN Neon Button</button>`,
    testCases: [],
    solutionExplanation: 'Kết hợp thuộc tính linear-gradient và box-shadow để tạo hiệu ứng phát sáng cho button.',
  },
];

export default function CompilerPage() {
  const [locale, setLocale] = useState<Locale>('vi');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(challenges[0]);
  const [code, setCode] = useState<string>(challenges[0].initialCode);
  const [consoleOutput, setConsoleOutput] = useState<string>('');
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setLocale(getStoredLocale());
  }, []);

  const handleSelectChallenge = (chal: Challenge) => {
    setSelectedChallenge(chal);
    setCode(chal.initialCode);
    setConsoleOutput('Sẵn sàng chạy mã...');
    setTestResults([]);
    setSolved(false);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput('🚀 Đang biên dịch và thực thi mã...\n');

    setTimeout(() => {
      let logs: string[] = [];

      // Intercept console.log safely
      const customConsole = {
        log: (...args: any[]) => {
          logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
        error: (...args: any[]) => {
          logs.push('❌ Error: ' + args.join(' '));
        },
      };

      try {
        if (selectedChallenge.language === 'html') {
          setConsoleOutput(' Rendering HTML Preview successfully!');
        } else {
          // Execute Code in controlled scope
          const runFunction = new Function('console', code);
          runFunction(customConsole);

          setConsoleOutput(logs.join('\n') || 'Mã đã chạy thành công (Không có output console).');

          // Run Test cases evaluation
          if (selectedChallenge.testCases.length > 0) {
            const evaluatedTests = selectedChallenge.testCases.map((tc) => {
              try {
                const evalFn = new Function('console', `${code};\n return ${tc.input};`);
                const res = String(evalFn(customConsole));
                const passed = res === tc.expectedOutput;
                return { ...tc, passed };
              } catch (err) {
                return { ...tc, passed: false };
              }
            });

            setTestResults(evaluatedTests);
            const allPassed = evaluatedTests.every((t) => t.passed);
            setSolved(allPassed);
          }
        }
      } catch (err: any) {
        setConsoleOutput('❌ Lỗi Biên Dịch:\n' + (err.message || String(err)));
      }

      setIsRunning(false);
    }, 300);
  };

  const handleResetCode = () => {
    setCode(selectedChallenge.initialCode);
    setConsoleOutput('Đã khôi phục mã nguồn ban đầu.');
    setTestResults([]);
    setSolved(false);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>
              <Code2 size={32} style={{ color: '#c084fc' }} />
              {t('compiler.title', locale)}
            </h1>
            <p className={styles.headerSubtitle}>
              {t('compiler.subtitle', locale)}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleResetCode}>
              <RotateCcw size={16} /> {t('compiler.resetCode', locale)}
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleRunCode} disabled={isRunning}>
              <Play size={16} /> {isRunning ? '...' : `${t('compiler.runCode', locale)} (Ctrl+Enter)`}
            </button>
          </div>
        </div>

        {/* IDE Split Layout */}
        <div className={styles.ideGrid}>
          {/* Sidebar Exercises List */}
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>
              <Layers size={18} style={{ color: '#38bdf8' }} />
              {t('compiler.exercises', locale)} ({challenges.length})
            </h2>

            <div className={styles.exerciseList}>
              {challenges.map((chal) => (
                <div
                  key={chal.id}
                  className={`${styles.exerciseItem} ${
                    selectedChallenge.id === chal.id ? styles.exerciseActive : ''
                  }`}
                  onClick={() => handleSelectChallenge(chal)}
                >
                  <div className={styles.exerciseTitle}>{chal.title}</div>
                  <div className={styles.exerciseMeta}>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                      {chal.language.toUpperCase()}
                    </span>
                    <span style={{ color: chal.difficulty === 'Dễ' ? '#4ade80' : '#fb923c' }}>
                      {chal.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Hint Box */}
            <div
              style={{
                marginTop: 'auto',
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '12px',
                padding: '0.85rem',
                fontSize: '0.8125rem',
                color: '#e9d5ff',
              }}
            >
              <Lightbulb size={16} style={{ color: '#fbbf24', marginBottom: '0.25rem' }} />
              <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Gợi ý giải thuật:</strong>
              {selectedChallenge.solutionExplanation}
            </div>
          </aside>

          {/* Main Editor Section */}
          <main className={styles.mainEditor}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.langSelector}>
                <FileCode size={18} style={{ color: '#c084fc' }} />
                <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>
                  {selectedChallenge.title}
                </strong>
              </div>

              {solved && (
                <div style={{ color: '#4ade80', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                  <Trophy size={18} /> Hoàn Thành +50 XP!
                </div>
              )}
            </div>

            {/* Code Input & Console Output Editor Container */}
            <div className={styles.editorContainer}>
              {/* Code Panel */}
              <div className={styles.codePanel}>
                <div className={styles.panelHeader}>
                  <span>MÃ NGUỒN ({selectedChallenge.language.toUpperCase()})</span>
                  <span>UTF-8</span>
                </div>
                <textarea
                  className={styles.codeTextarea}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Nhập mã của bạn tại đây..."
                  spellCheck={false}
                />
              </div>

              {/* Console & Preview Panel */}
              <div className={styles.consolePanel}>
                <div className={styles.panelHeader}>
                  <span>
                    <Terminal size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    CỬA SỔ CONSOLE & TEST CASES
                  </span>
                </div>

                {selectedChallenge.language === 'html' ? (
                  <div
                    style={{
                      flex: 1,
                      background: '#ffffff',
                      padding: '1rem',
                      overflowY: 'auto',
                    }}
                    dangerouslySetInnerHTML={{ __html: code }}
                  />
                ) : (
                  <div className={styles.consoleOutput}>
                    {consoleOutput}

                    {/* Test Cases Results */}
                    {testResults.length > 0 && (
                      <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.85rem' }}>
                        <h4 style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                          KẾT QUẢ KIỂM THỬ (TEST CASES):
                        </h4>

                        {testResults.map((tc, idx) => (
                          <div
                            key={idx}
                            className={`${styles.testCaseCard} ${
                              tc.passed ? styles.testPass : styles.testFail
                            }`}
                          >
                            <div>
                              <strong>Test #{idx + 1}:</strong> <code>{tc.input}</code>
                              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                Mong đợi: {tc.expectedOutput}
                              </div>
                            </div>
                            {tc.passed ? (
                              <CheckCircle2 size={18} style={{ color: '#4ade80' }} />
                            ) : (
                              <XCircle size={18} style={{ color: '#ef4444' }} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
