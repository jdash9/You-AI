interface SemanticAnalysisProps {
  prompt: string
  semanticAnswers: Record<string, string>
  onSetAnswer: (question: string, answer: string) => void
  onContinue: () => void
}

const questions = [
  'What is the topic?',
  'What does the user want?',
  'Which language is being used?',
]

export default function SemanticAnalysis({
  prompt,
  semanticAnswers,
  onSetAnswer,
  onContinue,
}: SemanticAnalysisProps) {
  const allAnswered = questions.every(q => semanticAnswers[q]?.trim())

  return (
    <div className="screen-container">
      <div className="screen-content">
        <h2 className="mb-4">Semantic Analysis</h2>
        <p className="subtitle mb-12">
          The AI analyzes the meaning behind the words. Answer these questions
          to simulate how AI understands context and intent.
        </p>

        <div className="flex gap-16">
          {/* Left Panel - Questions */}
          <div className="flex-1 space-y-8">
            {questions.map(q => (
              <div key={q} className="panel">
                <h3 className="mb-4">{q}</h3>
                <input
                  type="text"
                  value={semanticAnswers[q] || ''}
                  onChange={e => onSetAnswer(q, e.target.value)}
                  placeholder="Type your analysis..."
                  className="text-input"
                />
              </div>
            ))}
          </div>

          {/* Right Panel - Prompt Context */}
          <div className="w-80 shrink-0">
            <div className="processing-panel">
              <h3 className="section-label mb-4">
                Processing
              </h3>
              <div className="processing-list">
                <div className="processing-item">
                  <div className={`status-dot ${semanticAnswers[questions[0]]?.trim() ? 'active' : ''}`} />
                  <span className="processing-text">Topic extraction</span>
                </div>
                <div className="processing-item">
                  <div className={`status-dot ${semanticAnswers[questions[1]]?.trim() ? 'active' : ''}`} />
                  <span className="processing-text">Intent analysis</span>
                </div>
                <div className="processing-item">
                  <div className={`status-dot ${semanticAnswers[questions[2]]?.trim() ? 'active' : ''}`} />
                  <span className="processing-text">Language detection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue */}
        <div className="mt-12">
          <button
            onClick={onContinue}
            disabled={!allAnswered}
            className={`btn ${!allAnswered ? 'btn-disabled' : ''}`}
          >
            Process in Neural Network
          </button>
        </div>
      </div>
    </div>
  )
}