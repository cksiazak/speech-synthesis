import { ChangeEvent, useState } from 'react'
import './styles/SpeechSynthesis.scss'

import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'


const SpeechSynthesis = () => {
  const [text, setText] = useState('')
  const { speak } = useSpeechSynthesis()

  const handleTextAreaUpdate = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  return (
    <form>
      <label htmlFor="speech-synthesis">Speech Synthesis</label>
      <textarea name='speech-synthesis'
        onChange={handleTextAreaUpdate}
        value={text}
      />
      <button onClick={(e) => {
        e.preventDefault()
        speak(text)
      }}>
        Speak
      </button>
    </form>
  )
}

export default SpeechSynthesis
