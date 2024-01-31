const speech = new SpeechSynthesisUtterance()

export const useSpeechSynthesis = () => {

  const voices = window?.speechSynthesis?.getVoices() || []
  const voiceNames = voices?.map?.(voiceName => voiceName.name) || []

  const speak = (text: string) => {
    speech.text = text
    window.speechSynthesis.speak(speech)
    console.log(speech)
  }

  const setVoice = (name: string) => {
    let newVoice = name ?? null
    const selectedVoice = voices.find(item => item.name === newVoice) as SpeechSynthesisVoice
    speech.voice = selectedVoice
  }

  return {
    speak,
    setVoice,
    voices: voiceNames,
  }
}