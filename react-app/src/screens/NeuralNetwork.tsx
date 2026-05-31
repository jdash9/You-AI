import { useState, useEffect, useRef } from 'react'

interface NeuralNetworkProps {
  prompt: string
  keywords: string[]
  onContinue: () => void
}

interface Node {
  id: string
  x: number
  y: number
  label: string
  layer: 'input' | 'hidden' | 'output'
  activated: boolean
}

interface Edge {
  from: string
  to: string
  activated: boolean
}

export default function NeuralNetwork({ prompt, keywords, onContinue }: NeuralNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [activationStep, setActivationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const maxSteps = keywords.length + 2

  // Generate network layout
  const hiddenNodes = Array.from({ length: 4 }, (_, i) => i)

  useEffect(() => {
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    // Input layer (keywords)
    keywords.forEach((kw, i) => {
      newNodes.push({
        id: `input-${i}`,
        x: 100,
        y: 100 + i * 80,
        label: kw,
        layer: 'input',
        activated: false,
      })
    })

    // Hidden layer
    const hiddenCount = 4
    for (let i = 0; i < hiddenCount; i++) {
      newNodes.push({
        id: `hidden-${i}`,
        x: 280,
        y: 60 + i * 90 + (keywords.length > 3 ? 0 : 40),
        label: `N${i + 1}`,
        layer: 'hidden',
        activated: false,
      })
    }

    // Output layer
    newNodes.push({
      id: 'output',
      x: 460,
      y: keywords.length > 3 ? 180 : 200,
      label: 'Response',
      layer: 'output',
      activated: false,
    })

    // Connect input -> hidden
    keywords.forEach((_, i) => {
      hiddenNodes.forEach((_, j) => {
        newEdges.push({
          from: `input-${i}`,
          to: `hidden-${j}`,
          activated: false,
        })
      })
    })

    // Connect hidden -> output
    hiddenNodes.forEach((_, j) => {
      newEdges.push({
        from: `hidden-${j}`,
        to: 'output',
        activated: false,
      })
    })

    setNodes(newNodes)
    setEdges(newEdges)
  }, [keywords])

  // Animation sequence
  useEffect(() => {
    if (!isAnimating) return

    const timer = setTimeout(() => {
      if (activationStep < maxSteps) {
        const step = activationStep

        // Activate input nodes progressively
        if (step < keywords.length) {
          setNodes(prev =>
            prev.map(n =>
              n.id === `input-${step}` ? { ...n, activated: true } : n
            )
          )
          // Activate edges from this input to hidden layer
          setEdges(prev =>
            prev.map(e =>
              e.from === `input-${step}` ? { ...e, activated: true } : e
            )
          )
        } else if (step === keywords.length) {
          // Activate hidden layer
          setNodes(prev =>
            prev.map(n =>
              n.layer === 'hidden' ? { ...n, activated: true } : n
            )
          )
        } else if (step === keywords.length + 1) {
          // Activate output
          setNodes(prev =>
            prev.map(n =>
              n.layer === 'output' ? { ...n, activated: true } : n
            )
          )
          // Activate remaining edges
          setEdges(prev =>
            prev.map(e =>
              e.to === 'output' ? { ...e, activated: true } : e
            )
          )
        }

        setActivationStep(step + 1)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [isAnimating, activationStep, keywords.length, maxSteps])

  const startAnimation = () => {
    setActivationStep(0)
    setNodes(prev => prev.map(n => ({ ...n, activated: false })))
    setEdges(prev => prev.map(e => ({ ...e, activated: false })))
    setIsAnimating(true)
  }

  const isComplete = activationStep >= maxSteps

  return (
    <div className="screen-container">
      <div className="screen-content max-w-6xl">
        <div className="flex gap-16">
          {/* Left Panel - Info */}
          <div className="w-72 shrink-0">
            <h2 className="mb-4">Neural Network</h2>
            <p className="subtitle mb-8" style={{ maxWidth: 'none' }}>
              Watch how information flows through the neural network.
              Each node activates as the AI processes your input.
            </p>

            {/* Stats */}
            <div className="panel mb-8">
              <div className="progress-info mb-2">Processing Progress</div>
              <div className="progress-value">
                {activationStep}/{maxSteps}
              </div>
            </div>

            {/* Control Button */}
            {!isAnimating && !isComplete && (
              <button
                onClick={startAnimation}
                className="btn btn-full"
              >
                Activate Network
              </button>
            )}

            {isComplete && (
              <button
                onClick={onContinue}
                className="btn btn-full"
              >
                Generate Answer
              </button>
            )}

            {isAnimating && !isComplete && (
              <div className="processing-status">
                Processing...
              </div>
            )}
          </div>

          {/* Right Panel - Network Graph */}
          <div
            ref={containerRef}
            className="network-container"
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 560 380"
              className="network-svg"
            >
              {/* Edges */}
              {edges.map((edge, i) => {
                const fromNode = nodes.find(n => n.id === edge.from)
                const toNode = nodes.find(n => n.id === edge.to)
                if (!fromNode || !toNode) return null

                return (
                  <line
                    key={`edge-${i}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={edge.activated ? '#C00000' : '#2B2B2B'}
                    strokeWidth={edge.activated ? 2 : 1}
                    style={{ transition: 'all 0.5s ease' }}
                  />
                )
              })}

              {/* Nodes */}
              {nodes.map(node => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.layer === 'output' ? 28 : 22}
                    fill={node.activated ? '#C00000' : '#2B2B2B'}
                    stroke={node.activated ? '#A40000' : '#444'}
                    strokeWidth={2}
                    style={{ transition: 'all 0.5s ease' }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={node.activated ? '#F2F2F2' : '#C8C8C8'}
                    fontSize={node.layer === 'output' ? 10 : 9}
                    style={{ transition: 'all 0.5s ease', fontFamily: 'Inter, sans-serif' }}
                  >
                    {node.label.length > 12
                      ? node.label.slice(0, 10) + '..'
                      : node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}