import { useCallback, useEffect, useMemo, useState } from "react"

export const useSpeechSynthesis = () => {
  const speech = useMemo(() => new SpeechSynthesisUtterance(), [])
  const voices = useMemo(() => window?.speechSynthesis?.getVoices() || [], [])
  const languages = [...new Set(voices?.map?.(voice => voice.lang))]
  
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('')
  const [availableVoices, setAvailableVoices] = useState<string[]>([])

  const speak = (text: string) => {
    speech.text = text
    speech.rate = 1
    window.speechSynthesis.speak(speech)
  }

  const setLanguage = (lang: string) => {
    let newLang = lang ?? null
    setSelectedLanguage(newLang)
  }

  const filterVoices = useCallback((lang: string) => {
    const selectableVoices = selectedLanguage ? voices?.filter(voice => voice.lang === lang) : voices
    const voiceNames = selectableVoices?.map?.(voiceName => voiceName.name) || []
    return voiceNames
  }, [selectedLanguage, voices])

  const handleAvailableVoices = useCallback((lang: string) => {
    const voiceNames = filterVoices(lang)
    setAvailableVoices(voiceNames)
  }, [filterVoices])

  useEffect(() => {
    handleAvailableVoices(selectedLanguage)
  }, [handleAvailableVoices, selectedLanguage])

  
  const setVoice = useCallback((name: string) => {
    let newVoice = name ?? null
    const voice = voices.find(item => item.name === newVoice) as SpeechSynthesisVoice
    speech.voice = voice
    setSelectedVoice(newVoice ?? '')
  }, [speech, voices])

  useEffect(() => {
    const firstVoiceInLanguage = selectedLanguage ? filterVoices(selectedLanguage)[0] : ''
    setVoice(firstVoiceInLanguage)
  }, [availableVoices, filterVoices, selectedLanguage, setVoice])

  const pause = () => {
    window.speechSynthesis.pause()
  }

  const resume = () => {
    window.speechSynthesis.resume()
  }

  return {
    speak,
    setVoice,
    voices: availableVoices,
    voice: selectedVoice,
    pause,
    resume,
    languages,
    setLanguage,
  }
}