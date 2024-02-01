import { ChangeEvent, useState } from 'react'
import { countryCodes } from '../data/countryCodes'
import './styles/SpeechSynthesis.scss'

import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'


const SpeechSynthesis = () => {
  const [text, setText] = useState('')
  const { selection, control, state } = useSpeechSynthesis()

  const handleTextAreaUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    control.reinitialize()
  }

  const handleButtonText = () => {
    if (state.isPlaying) return 'Pause'
    if (state.isPaused) return 'Resume'
    return 'Play'
  }

  return (
    <form>
      <label htmlFor="speech-synthesis">Speech Synthesis</label>
      <textarea name='speech-synthesis'
        onChange={handleTextAreaUpdate}
        value={text}
        placeholder='Type some text here...'
      />
      <div className='controls'>
        <select
          className='languages'
          name='language'
          onChange={e => control.setLanguage(e.target.value)}
        >
          <option value="">All</option>
          {selection.languages.map((lang, i) => (
            <option key={`${lang}_${i}`} value={lang}>
              {countryCodes?.[lang as keyof typeof countryCodes]}
            </option>
          ))}
        </select>
        <select
          className='voices'
          name='voices'
          value={selection.voice}
          onChange={(e) => control.setVoice(e.target.value)}
        >
          <option value="">Default</option>
          {selection.voices.map((voice, i) => (
            <option key={`${voice}_${i}`} value={voice}>{voice}</option>
          ))}
        </select>
        <button
          className='play-button'
          onClick={(e) => {
            e.preventDefault()

            if (state.isPlaying) {
              control.pause()
            }

            if (state.isPaused) {
              control.resume()
            }

            if (state.isInitialized) {
              const initialSpeech = 'For this to work, you need to type something in the text area.'
              control.speak(text || initialSpeech)
            }
          }
        }>
          {handleButtonText()}
        </button>
      </div>
    </form>
  )
}

export default SpeechSynthesis
