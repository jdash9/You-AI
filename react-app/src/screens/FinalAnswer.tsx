interface FinalAnswerProps {
  prompt: string
  mode: 'own-knowledge' | 'internet' | null
  answerType: 'accurate' | 'fast' | null
  keywords: string[]
  onRestart: () => void
}

export default function FinalAnswer({
  prompt,
  mode,
  answerType,
  keywords,
  onRestart,
}: FinalAnswerProps) {
  const answer =
    answerType === 'accurate'
      ? generateAccurateAnswer(prompt, keywords)
      : generateFastAnswer(prompt, keywords)

  return (
    <div className="screen-container">
      <div className="screen-content">
        <h2 className="mb-4">Generated Answer</h2>
        <p className="subtitle mb-8">
          The AI has processed your input through the neural network and generated a response.
        </p>

        {/* Config Summary */}
        <div className="config-summary mb-12">
          <span className="badge">
            Mode: {mode === 'own-knowledge' ? 'Own Knowledge' : 'Internet'}
          </span>
          <span className="badge">
            Type: {answerType === 'accurate' ? 'Accurate' : 'Fast'}
          </span>
          <span className="badge">
            Keywords: {keywords.length}
          </span>
        </div>

        {/* Answer Display */}
        <div className="answer-display">
          <div className="answer-header">
            <div className="answer-dot" />
            <span className="answer-label">
              AI Response
            </span>
          </div>
          <p className="answer-text">{answer}</p>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="btn"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}

function generateAccurateAnswer(prompt: string, keywords: string[]): string {
  return `Based on your prompt, the AI has analyzed the topic of "${prompt}" through a comprehensive evaluation of the key concepts identified: ${keywords.join(', ')}. 

Machine learning plays a transformative role in modern healthcare by enabling early disease detection through pattern recognition in medical imaging, personalizing treatment plans based on patient data analysis, accelerating drug discovery by predicting molecular interactions, and improving operational efficiency through predictive analytics for patient flow and resource allocation.

The integration of AI-driven diagnostic tools has shown remarkable accuracy in detecting conditions such as cancer, cardiovascular diseases, and neurological disorders at earlier, more treatable stages. Furthermore, machine learning algorithms continuously improve their performance as they process more data, creating a virtuous cycle of increasingly precise and personalized healthcare delivery.`
}

function generateFastAnswer(prompt: string, keywords: string[]): string {
  return `Machine learning revolutionizes healthcare by enabling early disease detection, personalized treatments, and faster drug discovery. AI algorithms analyze medical images, patient records, and genetic data to identify patterns humans might miss. This leads to earlier diagnoses, more effective treatment plans, and reduced healthcare costs. The technology is particularly impactful in radiology, pathology, and genomics.`
}