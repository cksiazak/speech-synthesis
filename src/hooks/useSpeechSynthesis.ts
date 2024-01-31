import { useCallback, useEffect, useMemo, useState } from "react"

enum PlayState {
  NONE = 'none',
  PLAYING = 'playing',
  PAUSED = 'paused',
}

export const useSpeechSynthesis = () => {
  const speech = useMemo(() => new SpeechSynthesisUtterance(), [])
  const voices = useMemo(() => window?.speechSynthesis?.getVoices() || [], [])
  const languages = [...new Set(voices?.map?.(voice => voice.lang))]
  
  // language selection
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('')
  const [availableVoices, setAvailableVoices] = useState<string[]>([])

  // playback state
  const [playState, setPlayState] = useState<PlayState>(PlayState.NONE)

  speech.onend = () => {
    setPlayState(PlayState.NONE)
  }

  // filters and handlers
  const filterVoices = useCallback((lang: string) => {
    const selectableVoices = selectedLanguage ? voices?.filter(voice => voice.lang === lang) : voices
    const voiceNames = selectableVoices?.map?.(voiceName => voiceName.name) || []
    return voiceNames
  }, [selectedLanguage, voices])

  const handleAvailableVoices = useCallback((lang: string) => {
    const voiceNames = filterVoices(lang)
    setAvailableVoices(voiceNames)
  }, [filterVoices])

  // controls
  const speak = (text: string) => {
    speech.text = text
    speech.rate = 1
    window.speechSynthesis.speak(speech)
    setPlayState(PlayState.PLAYING)
  }

  const setLanguage = (lang: string) => {
    let newLang = lang ?? null
    setSelectedLanguage(newLang)
  }

  const setVoice = useCallback((name: string) => {
    let newVoice = name ?? null
    const voice = voices.find(item => item.name === newVoice) as SpeechSynthesisVoice
    speech.voice = voice
    setSelectedVoice(newVoice ?? '')
  }, [speech, voices])

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

  // effects
  useEffect(() => {
    handleAvailableVoices(selectedLanguage)
  }, [handleAvailableVoices, selectedLanguage])

  useEffect(() => {
    const firstVoiceInLanguage = selectedLanguage ? filterVoices(selectedLanguage)[0] : ''
    setVoice(firstVoiceInLanguage)
  }, [availableVoices, filterVoices, selectedLanguage, setVoice])

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