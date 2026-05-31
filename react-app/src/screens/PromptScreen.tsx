interface PromptScreenProps {
  prompt: string
  onContinue: () => void
}

export default function PromptScreen({ prompt, onContinue }: PromptScreenProps) {
  return (
    <div className="screen-container">
      <div className="screen-content">
        <h2 className="mb-4">Prompt</h2>
        <p className="subtitle mb-12">
          This is the input the AI will process. Read it carefully before proceeding.
        </p>

        {/* Prompt Display */}
        <div className="panel-bordered mb-16">
          <p className="text-xl leading-relaxed text-light">
            &ldquo;{prompt}&rdquo;
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="btn"
        >
          Analyze Prompt
        </button>
      </div>
    </div>
  )
}