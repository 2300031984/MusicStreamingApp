"use client"

import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import Chatbot from './Chatbot';

export default function PlayerControls({ audioPlayer, currentSongImage, currentSongName, currentSongArtist }) {
  const { isPlaying, duration, currentTime, volume, togglePlay, seek, setAudioVolume } = audioPlayer
  const [isLiked, setIsLiked] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isRepeatActive, setIsRepeatActive] = useState(false)
  const [isShuffleActive, setIsShuffleActive] = useState(false)

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage for gradient
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-black/60 border-t border-white/5 z-20 py-3 px-4">
      <div className="max-w-screen-2xl mx-auto flex items-center gap-4">
        {/* Song info */}
        <div className="flex items-center gap-4 w-1/4">
          <div className="relative group">
            <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg">
              <img
                src={currentSongImage || "/placeholder.svg"}
                alt={currentSongName || "No song playing"}
                className="w-full h-full object-cover"
              />
            </div>
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Pause size={20} className="text-white" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h4 className="font-medium text-white truncate">{currentSongName || "Not Playing"}</h4>
            <p className="text-sm text-white/60 truncate">{currentSongArtist || "Unknown Artist"}</p>
          </div>

          <button
            className={`p-2 rounded-full ${isLiked ? "text-pink-500" : "text-white/60 hover:text-white"} transition-colors`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Player controls */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-6 mb-2">
            <button
              className={`text-white/60 hover:text-white transition-colors p-2 rounded-full ${isShuffleActive ? "bg-purple-600/20 text-purple-400" : ""}`}
              onClick={() => setIsShuffleActive(!isShuffleActive)}
            >
              <Shuffle size={18} />
            </button>

            <button className="text-white/60 hover:text-white transition-colors p-2 rounded-full">
              <SkipBack size={18} />
            </button>

            <button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full p-3 text-white hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-900/20"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause size={22} fill="currentColor" />
              ) : (
                <Play size={22} fill="currentColor" className="ml-1" />
              )}
            </button>

            <button className="text-white/60 hover:text-white transition-colors p-2 rounded-full">
              <SkipForward size={18} />
            </button>

            <button
              className={`text-white/60 hover:text-white transition-colors p-2 rounded-full ${isRepeatActive ? "bg-purple-600/20 text-purple-400" : ""}`}
              onClick={() => setIsRepeatActive(!isRepeatActive)}
            >
              <Repeat size={18} />
            </button>
          </div>

          <div className="w-full max-w-xl flex items-center gap-3">
            <span className="text-xs text-white/60 w-10 text-right">{formatTime(currentTime)}</span>

            <div className="relative flex-1 h-2 group">
              <div className="absolute inset-0 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime || 0}
                onChange={(e) => seek(Number.parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progressPercentage}%`, transform: `translateX(-50%) translateY(-50%)` }}
              ></div>
            </div>

            <span className="text-xs text-white/60 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume control */}
        <div className="w-1/4 flex items-center justify-end">
          <div className="relative">

            {showVolumeSlider && (
              <div
                className="absolute bottom-full right-0 mb-2 p-3 bg-zinc-900/95 backdrop-blur-md rounded-lg shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200"
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setAudioVolume(Number.parseFloat(e.target.value))}
                  className="w-24 h-1.5 appearance-none bg-white/20 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            )}
          </div>

          <button className="text-white/60 hover:text-white p-2 rounded-full transition-colors ml-2">
            <MoreHorizontal size={18} />
          </button>
        </div>
        <Chatbot />
      </div>
    </div>
  )
}
