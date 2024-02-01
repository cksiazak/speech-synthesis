import { useEffect, useState } from "react"

enum PlayState {
  NONE = 'none',
  PLAYING = 'playing',
  PAUSED = 'paused',
}

export const useSpeechSynthesis = () => {
  const speech = new SpeechSynthesisUtterance()
  const synth = window.speechSynthesis

  // availability
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>()
  const [availableVoices, setAvailableVoices] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])

  // voice selection
  const [selectedVoiceName, setSelectedVoiceName] = useState('')
  const [selectedSpeechSynthesis, setSelectedSpeechSynthesis] = useState<SpeechSynthesisVoice | null>(null)

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
    speech.voice = selectedSpeechSynthesis
    synth.speak(speech)
    setPlayState(PlayState.PLAYING)
  }

  const setLanguage = (lang: string) => {
    const newLang = lang ?? null
    handleAvailableVoices(newLang)
    const firstVoiceInLanguage = lang ? filterVoices(lang)[0] : ''
    setVoice(firstVoiceInLanguage)
  }

  const setVoice = (name: string) => {
    const newVoice = name ?? null
    const voice = voices?.find(item => item.name === newVoice) as SpeechSynthesisVoice
    setSelectedSpeechSynthesis(voice)
    setSelectedVoiceName(newVoice ?? '')
  }

  const pause = () => {
    synth.pause()
    setPlayState(PlayState.PAUSED)
  }

  const resume = () => {
    synth.resume()
    setPlayState(PlayState.PLAYING)
  }

  const reinitialize = () => {
    synth.cancel()
    setPlayState(PlayState.NONE)
  }

  // initialization
  // -- this should help load voices without needing to refresh
  const loadVoicesWhenAvailable = () => {
    const nativeVoices = synth.getVoices();
    if (nativeVoices.length !== 0) {
          setVoices(nativeVoices)
          const vNames = nativeVoices?.map((voice) => voice.name) || []
          setAvailableVoices(vNames)
          const vLanguages = [...new Set(nativeVoices?.map?.(voice => voice.lang))]
          setLanguages(vLanguages)
      }
      else {
          setTimeout(() => loadVoicesWhenAvailable(), 10)
      }
  }


  useEffect(() => {
    loadVoicesWhenAvailable()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    selection: {
      voices: availableVoices,
      voice: selectedVoiceName,
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