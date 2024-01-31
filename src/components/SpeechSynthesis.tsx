import { ChangeEvent, useState } from 'react'
import './styles/SpeechSynthesis.scss'

import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'


const SpeechSynthesis = () => {
  const [text, setText] = useState('')
  const { speak, voices, voice, languages, setVoice, setLanguage } = useSpeechSynthesis()

  const handleTextAreaUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  return (
    <form>
      <label htmlFor="speech-synthesis">Speech Synthesis</label>
      <textarea name='speech-synthesis'
        onChange={handleTextAreaUpdate}
        value={text}
        placeholder='Type some text here...'
      />
      <div>
        <select name='language' onChange={e => setLanguage(e.target.value)}>
          <option value="">All</option>
          {languages.map((lang, i) => (
            <option key={`${lang}_${i}`} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <select name='voices' value={voice} onChange={(e) => setVoice(e.target.value)}>
          <option value="">Default</option>
          {voices.map((voice, i) => (
            <option key={`${voice}_${i}`} value={voice}>{voice}</option>
          ))}
        </select>
        <button onClick={(e) => {
          e.preventDefault()
          speak(text)
        }}>
          Speak
        </button>
      </div>
    </form>
  )
}

export default SpeechSynthesis
