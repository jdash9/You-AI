interface ModeSelectionProps {
  selectedMode: 'own-knowledge' | 'internet' | null
  selectedType: 'accurate' | 'fast' | null
  onSelectMode: (mode: 'own-knowledge' | 'internet') => void
  onSelectType: (type: 'accurate' | 'fast') => void
  onContinue: () => void
}

export default function ModeSelection({
  selectedMode,
  selectedType,
  onSelectMode,
  onSelectType,
  onContinue,
}: ModeSelectionProps) {
  const canContinue = selectedMode !== null && selectedType !== null

  return (
    <div className="screen-container">
      <div className="screen-content max-w-4xl">
        {/* Instruction */}
        <h2 className="mb-4">Configure Mode</h2>
        <p className="subtitle mb-16">
          Select how the AI should process your request. Choose the knowledge source and response style.
        </p>

        {/* Mode Selection */}
        <div className="mb-16">
          <h3 className="section-label">
            Answer Mode
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <ChoiceCard
              label="Own Knowledge"
              description="Answer based on internal training data"
              selected={selectedMode === 'own-knowledge'}
              onClick={() => onSelectMode('own-knowledge')}
            />
            <ChoiceCard
              label="Internet"
              description="Search and synthesize from web sources"
              selected={selectedMode === 'internet'}
              onClick={() => onSelectMode('internet')}
            />
          </div>
        </div>

        {/* Type Selection */}
        <div className="mb-16">
          <h3 className="section-label">
            Type of Answer
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <ChoiceCard
              label="Accurate Answer"
              description="Precise and thorough response"
              selected={selectedType === 'accurate'}
              onClick={() => onSelectType('accurate')}
            />
            <ChoiceCard
              label="Fast Answer"
              description="Quick and concise response"
              selected={selectedType === 'fast'}
              onClick={() => onSelectType('fast')}
            />
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`btn ${!canContinue ? 'btn-disabled' : ''}`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function ChoiceCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string
  description: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`choice-card ${selected ? 'selected' : ''}`}
    >
      <h3 className="choice-card-label">{label}</h3>
      <p className={`choice-card-description ${selected ? 'text-text-primary/80' : ''}`}>
        {description}
      </p>
    </button>
  )
}