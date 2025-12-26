"use client"

import { useState, useEffect } from "react"
import { Plus, Music, X, Check, Loader2, Search } from "lucide-react"

export default function PlaylistManager({
  audioPlayer,
  currentSong,
  isAddToPlaylistModalOpen,
  onOpenAddToPlaylistModal,
  onCloseAddToPlaylistModal,
}) {
  const [playlists, setPlaylists] = useState([])
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [userId, setUserId] = useState(1) // Default user ID, in a real app would come from auth
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch user playlists on component mount
  useEffect(() => {
    fetchUserPlaylists()
  }, [])

  const fetchUserPlaylists = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/playlists/user/${userId}`)
      if (!response.ok) throw new Error("Failed to fetch playlists")
      const data = await response.json()
      setPlaylists(data)
    } catch (err) {
      setError(
        "Error loading playlists: " +
          (err.message.includes("Unexpected token")
            ? "Server returned invalid JSON. Please check backend."
            : err.message),
      )
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

  const addSongToPlaylist = async (playlistName) => {
    if (!currentSong || !currentSong.name) {
      setError("No song selected")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/playlists/addSong`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          playlistName: playlistName,
          songName: currentSong.name,
        }),
      })

      if (!response.ok) throw new Error("Failed to add song to playlist")
      await fetchUserPlaylists() // Refresh playlists
      setSuccess(`Added "${currentSong.name}" to "${playlistName}"`)
      setError("")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(
        "Error adding song to playlist: " +
          (err.message.includes("Unexpected token")
            ? "Server returned invalid JSON. Please check backend."
            : err.message),
      )
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  // Filter playlists based on search query
  const filteredPlaylists = searchQuery
    ? playlists.filter((p) => p.playlistName.toLowerCase().includes(searchQuery.toLowerCase()))
    : playlists

  return (
    <div>
      {/* Button to open playlists section */}
      <button
        onClick={onOpenAddToPlaylistModal}
        disabled={!currentSong || !currentSong.name}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors p-2.5 w-full rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
        title={!currentSong || !currentSong.name ? "Select a song first" : "Add current song to playlist"}
      >
        <Plus size={18} />
        <span>Add to Playlist</span>
      </button>

      {/* Create Playlist Button */}
      <button
        onClick={() => setIsCreatingPlaylist(true)}
        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors p-2.5 w-full rounded-lg hover:bg-white/5 mt-2"
      >
        <Music size={18} />
        <span>Create Playlist</span>
      </button>

      {/* Create Playlist Form */}
      {isCreatingPlaylist && (
        <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white">Create New Playlist</h3>
            <button onClick={() => setIsCreatingPlaylist(false)} className="text-white/60 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleCreatePlaylist} className="space-y-3">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist Name"
              className="w-full bg-white/10 border border-white/20 text-white p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-white/40"
              disabled={loading}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/20 flex items-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Create
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <X size={14} className="flex-shrink-0" />
                <span>{error}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Playlist List */}
      <div className="mt-4 space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
        {loading && !isCreatingPlaylist ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : playlists.length === 0 ? (
          <p className="text-white/60 text-center py-4 text-sm">No playlists yet</p>
        ) : (
          <ul className="space-y-1">
            {playlists.map((playlist) => (
              <li key={`${playlist.userId}-${playlist.playlistName}`}>
                <button
                  onClick={() => addSongToPlaylist(playlist.playlistName)}
                  className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-lg text-left text-white/80 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Music size={16} className="text-white/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{playlist.playlistName}</p>
                    <p className="text-xs text-white/40">{playlist.songs ? playlist.songs.length : 0} songs</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add to Playlist Modal */}
      {isAddToPlaylistModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 rounded-2xl w-96 shadow-2xl border border-white/10 transform transition-all duration-300 ease-out scale-100 opacity-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Add to Playlist
              </h3>
              <button
                onClick={onCloseAddToPlaylistModal}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-1.5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {currentSong && currentSong.name && (
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

            <div className="mb-6 max-h-60 overflow-y-auto pr-1">
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
                onClick={() => {
                  setIsCreatingPlaylist(true)
                  onCloseAddToPlaylistModal()
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>New Playlist</span>
              </button>

              <button
                onClick={onCloseAddToPlaylistModal}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="fixed bottom-6 right-6 bg-green-900/80 backdrop-blur-md border border-green-500/30 text-white p-4 rounded-xl shadow-xl animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-3 max-w-xs z-50">
          <div className="bg-green-500/20 p-2 rounded-full">
            <Check size={18} className="text-green-400" />
          </div>
          <p>{success}</p>
        </div>
      )}
    </div>
  )
}
