import { useMemo, useState } from "react"

enum PlayState {
  NONE = 'none',
  PLAYING = 'playing',
  PAUSED = 'paused',
}

export const useSpeechSynthesis = () => {
  const speech = useMemo(() => new SpeechSynthesisUtterance(), [])
  const voices = window?.speechSynthesis?.getVoices() || []
  const voiceNames = voices.map?.(voiceName => voiceName.name) || []
  const languages = [...new Set(voices?.map?.(voice => voice.lang))]
  
  // voice selection
  const [selectedVoice, setSelectedVoice] = useState('')
  const [availableVoices, setAvailableVoices] = useState<string[]>(voiceNames)

  // playback state
  const [playState, setPlayState] = useState<PlayState>(PlayState.NONE)
  speech.onend = () => {
    setPlayState(PlayState.NONE)
  }

  // filters and handlers
  const filterVoices = (lang?: string) => {
    const selectableVoices = lang ? voices?.filter(voice => voice.lang === lang) : voices
    const vNames = selectableVoices?.map?.(voiceName => voiceName.name) || []
    return vNames
  }

  const handleAvailableVoices = (lang?: string) => {
    const vNames = filterVoices(lang)
    setAvailableVoices(vNames)
  }

  // controls
  const speak = (text: string) => {
    speech.text = text
    speech.rate = 1
    window.speechSynthesis.speak(speech)
    setPlayState(PlayState.PLAYING)
  }

  const setLanguage = (lang: string) => {
    let newLang = lang ?? null
    handleAvailableVoices(newLang)
    const firstVoiceInLanguage = lang ? filterVoices(lang)[0] : ''
    setVoice(firstVoiceInLanguage)
  }

  const setVoice = (name: string) => {
    let newVoice = name ?? null
    const voice = voices.find(item => item.name === newVoice) as SpeechSynthesisVoice
    speech.voice = voice
    setSelectedVoice(newVoice ?? '')
  }

  const pause = () => {
    window.speechSynthesis.pause()
    setPlayState(PlayState.PAUSED)
  }

  const resume = () => {
    window.speechSynthesis.resume()
    setPlayState(PlayState.PLAYING)
  }

  const reinitialize = () => {
    window.speechSynthesis.cancel()
    setPlayState(PlayState.NONE)
  }

  return {
    selection: {
      voices: availableVoices,
      voice: selectedVoice,
      languages,
    },
    control: {
      speak,
      setVoice,
      pause,
      resume,
      setLanguage,
      reinitialize,
    },
    state: {
      isPlaying: playState === PlayState.PLAYING,
      isPaused: playState === PlayState.PAUSED,
      isInitialized: playState === PlayState.NONE
    },
  }
}