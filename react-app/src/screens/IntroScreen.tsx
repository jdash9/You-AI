interface IntroScreenProps {
  onStart: () => void
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="screen-container">
      <div className="screen-content">
        {/* Title */}
        <h1 className="mb-6 tracking-tight">
          You-AI
        </h1>

        {/* Subtitle */}
        <p className="subtitle mb-16">
          Discover how artificial intelligence processes your prompts.
          Experience the journey from input to understanding through
          an interactive step-by-step simulation.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <FeatureCard
            title="Interactive Learning"
            description="Engage with each stage of AI prompt processing through hands-on interaction"
          />
          <FeatureCard
            title="Visual Processing"
            description="See how neural networks analyze and understand your input in real-time"
          />
          <FeatureCard
            title="Step-by-Step"
            description="Follow the complete pipeline from raw input to structured understanding"
          />
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="btn"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="feature-card">
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
    </div>
  )
}