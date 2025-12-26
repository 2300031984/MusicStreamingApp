"use client"

import { X, Check, Music, Plus, Search, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function AddToPlaylistModal({ currentSong, isOpen, onClose }) {
  const [playlists, setPlaylists] = useState([])
  const [userId] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)

  useEffect(() => {
    if (isOpen) fetchUserPlaylists()
  }, [isOpen])

  const fetchUserPlaylists = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/playlists/user/${userId}`)
      if (!res.ok) throw new Error("Failed to fetch playlists")
      const data = await res.json()
      setPlaylists(data)
    } catch (err) {
      setError("Error loading playlists: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const addSongToPlaylist = async (playlistName) => {
    if (!currentSong || !currentSong.name) {
      setError("No song selected")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/playlists/addSong`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          playlistName,
          songName: currentSong.name,
        }),
      })

      if (!res.ok) throw new Error("Failed to add song to playlist")
      setSuccess(`Added "${currentSong.name}" to "${playlistName}"`)
      setError("")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    if (!newPlaylistName.trim()) {
      setError("Please enter a playlist name")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/playlists/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          playlistName: newPlaylistName,
        }),
      })

      if (!response.ok) throw new Error("Failed to create playlist")
      const newPlaylist = await response.json()
      setPlaylists([...playlists, newPlaylist])
      setNewPlaylistName("")
      setSuccess("Playlist created successfully!")
      setError("")
      setIsCreatingPlaylist(false)

      // If a song is selected, add it to the newly created playlist
      if (currentSong && currentSong.name) {
        await addSongToPlaylist(newPlaylistName)
      }

      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(
        "Error creating playlist: " +
          (err.message.includes("Unexpected token")
            ? "Server returned invalid JSON. Please check backend."
            : err.message),
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredPlaylists = searchQuery
    ? playlists.filter((p) => p.playlistName.toLowerCase().includes(searchQuery.toLowerCase()))
    : playlists

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl w-96 shadow-2xl border border-white/10 z-[10000] animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            {isCreatingPlaylist ? "Create Playlist" : "Add to Playlist"}
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {currentSong?.name && !isCreatingPlaylist && (
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={currentSong.image || "/placeholder.svg"}
                alt={currentSong.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-white font-medium truncate">{currentSong.name}</p>
              <p className="text-white/60 text-sm">Adding to playlist</p>
            </div>
          </div>
        )}

        {isCreatingPlaylist ? (
          <div className="mb-6">
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label htmlFor="playlistName" className="block text-white/80 text-sm mb-1">
                  Playlist Name
                </label>
                <input
                  id="playlistName"
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <X size={16} className="flex-shrink-0" />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsCreatingPlaylist(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/20 flex items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={16} className="text-white/40" />
              </div>
              <input
                type="text"
                placeholder="Search playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="mb-6 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : filteredPlaylists.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-white/60 mb-2">No playlists found</p>
                  <p className="text-white/40 text-sm">Create a new playlist below</p>
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {filteredPlaylists.map((playlist) => (
                    <li key={`${playlist.userId}-${playlist.playlistName}`}>
                      <button
                        onClick={() => addSongToPlaylist(playlist.playlistName)}
                        className="flex items-center gap-3 w-full p-3 hover:bg-white/10 rounded-lg text-left text-white transition-colors"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Music size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{playlist.playlistName}</p>
                          <p className="text-xs text-white/60">{playlist.songs?.length ?? 0} songs</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <X size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsCreatingPlaylist(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>New Playlist</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/20"
              >
                Done
              </button>
            </div>
          </>
        )}

        {success && (
          <div className="fixed bottom-6 right-6 bg-green-900/80 backdrop-blur-md border border-green-500/30 text-white p-4 rounded-xl shadow-xl animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-3 max-w-xs">
            <div className="bg-green-500/20 p-2 rounded-full">
              <Check size={18} className="text-green-400" />
            </div>
            <p>{success}</p>
          </div>
        )}
      </div>
    </div>
  )
}
