const speech = new SpeechSynthesisUtterance()

export const useSpeechSynthesis = () => {

  const speak = (text: string) => {
    speech.text = text
    window.speechSynthesis.speak(speech)
  }

  return {
    speak
  }
}