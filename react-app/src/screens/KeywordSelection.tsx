interface KeywordSelectionProps {
  prompt: string
  selectedKeywords: string[]
  onToggleKeyword: (word: string) => void
  onContinue: () => void
}

function extractKeywords(prompt: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'in', 'of', 'to', 'is', 'and', 'or', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'was', 'are', 'be',
    'has', 'have', 'had', 'its', 'it', 'this', 'that', 'not',
  ])
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
}

export default function KeywordSelection({
  prompt,
  selectedKeywords,
  onToggleKeyword,
  onContinue,
}: KeywordSelectionProps) {
  const keywords = extractKeywords(prompt)
  const required = 3

  return (
    <div className="screen-container">
      <div className="screen-content max-w-4xl">
        {/* Header */}
        <h2 className="mb-4">Keywords</h2>
        <p className="subtitle mb-12">
          Select the most important keywords from the prompt. The AI uses these
          to understand the core topics. Choose at least {required}.
        </p>

        {/* Keyword Tags */}
        <div className="panel mb-8">
          <div className="flex flex-wrap gap-4">
            {keywords.map(word => {
              const isSelected = selectedKeywords.includes(word)
              return (
                <button
                  key={word}
                  onClick={() => onToggleKeyword(word)}
                  className={`keyword-tag ${isSelected ? 'selected' : ''}`}
                >
                  {word}
                </button>
              )
            })}
          </div>
        </div>

        {/* Progress and Continue */}
        <div className="flex justify-between items-center">
          <span className="progress-info">
            Selected: {selectedKeywords.length}/{required} required
          </span>
          <button
            onClick={onContinue}
            disabled={selectedKeywords.length < required}
            className={`btn ${selectedKeywords.length < required ? 'btn-disabled' : ''}`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}