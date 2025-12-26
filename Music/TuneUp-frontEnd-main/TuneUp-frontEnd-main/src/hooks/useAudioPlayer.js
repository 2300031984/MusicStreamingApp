"use client"

import { useState, useEffect, useRef } from "react"

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef(new Audio())

  useEffect(() => {
    const audio = audioRef.current
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration))
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime))
    audio.addEventListener("ended", () => setIsPlaying(false))

    return () => {
      audio.removeEventListener("loadedmetadata", () => setDuration(audio.duration))
      audio.removeEventListener("timeupdate", () => setCurrentTime(audio.currentTime))
      audio.removeEventListener("ended", () => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seek = (time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  const setAudioVolume = (vol) => {
    audioRef.current.volume = vol
    setVolume(vol)
  }

  const loadTrack = (trackUrl) => {
    audioRef.current.src = trackUrl
    audioRef.current.load()
    setIsPlaying(false)
    setCurrentTime(0)
  }

  return { isPlaying, duration, currentTime, volume, togglePlay, seek, setAudioVolume, loadTrack }
}

