import { useState } from 'react'
import IntroScreen from './screens/IntroScreen'
import ModeSelection from './screens/ModeSelection'
import PromptScreen from './screens/PromptScreen'
import KeywordSelection from './screens/KeywordSelection'
import SemanticAnalysis from './screens/SemanticAnalysis'
import NeuralNetwork from './screens/NeuralNetwork'
import FinalAnswer from './screens/FinalAnswer'

export type Screen =
  | 'intro'
  | 'mode-selection'
  | 'prompt'
  | 'keywords'
  | 'semantic'
  | 'neural'
  | 'answer'

export interface AppState {
  screen: Screen
  mode: 'own-knowledge' | 'internet' | null
  answerType: 'accurate' | 'fast' | null
  prompt: string
  selectedKeywords: string[]
  semanticAnswers: Record<string, string>
}

function App() {
  const [state, setState] = useState<AppState>({
    screen: 'intro',
    mode: null,
    answerType: null,
    prompt: 'Explain the importance of machine learning in modern healthcare',
    selectedKeywords: [],
    semanticAnswers: {},
  })

  const goTo = (screen: Screen) => {
    setState(prev => ({ ...prev, screen }))
  }

  const setMode = (mode: 'own-knowledge' | 'internet') => {
    setState(prev => ({ ...prev, mode }))
  }

  const setAnswerType = (type: 'accurate' | 'fast') => {
    setState(prev => ({ ...prev, answerType: type }))
  }

  const setPrompt = (prompt: string) => {
    setState(prev => ({ ...prev, prompt }))
  }

  const toggleKeyword = (word: string) => {
    setState(prev => {
      const exists = prev.selectedKeywords.includes(word)
      return {
        ...prev,
        selectedKeywords: exists
          ? prev.selectedKeywords.filter(w => w !== word)
          : [...prev.selectedKeywords, word],
      }
    })
  }

  const setSemanticAnswer = (question: string, answer: string) => {
    setState(prev => ({
      ...prev,
      semanticAnswers: { ...prev.semanticAnswers, [question]: answer },
    }))
  }

  const renderScreen = () => {
    switch (state.screen) {
      case 'intro':
        return <IntroScreen onStart={() => goTo('mode-selection')} />
      case 'mode-selection':
        return (
          <ModeSelection
            selectedMode={state.mode}
            selectedType={state.answerType}
            onSelectMode={setMode}
            onSelectType={setAnswerType}
            onContinue={() => goTo('prompt')}
          />
        )
      case 'prompt':
        return (
          <PromptScreen
            prompt={state.prompt}
            onContinue={() => goTo('keywords')}
          />
        )
      case 'keywords':
        return (
          <KeywordSelection
            prompt={state.prompt}
            selectedKeywords={state.selectedKeywords}
            onToggleKeyword={toggleKeyword}
            onContinue={() => goTo('semantic')}
          />
        )
      case 'semantic':
        return (
          <SemanticAnalysis
            prompt={state.prompt}
            semanticAnswers={state.semanticAnswers}
            onSetAnswer={setSemanticAnswer}
            onContinue={() => goTo('neural')}
          />
        )
      case 'neural':
        return (
          <NeuralNetwork
            prompt={state.prompt}
            keywords={state.selectedKeywords}
            onContinue={() => goTo('answer')}
          />
        )
      case 'answer':
        return (
          <FinalAnswer
            prompt={state.prompt}
            mode={state.mode}
            answerType={state.answerType}
            keywords={state.selectedKeywords}
            onRestart={() =>
              setState({
                screen: 'intro',
                mode: null,
                answerType: null,
                prompt: 'Explain the importance of machine learning in modern healthcare',
                selectedKeywords: [],
                semanticAnswers: {},
              })
            }
          />
        )
      default:
        return <IntroScreen onStart={() => goTo('mode-selection')} />
    }
  }

  return (
    <div className="app-container">
      {renderScreen()}
    </div>
  )
}

export default App