"use client"

import { useState, useEffect } from "react"
import { Play, ArrowLeft, Music, Search, Clock, Heart, Plus } from "lucide-react"

export default function PlaylistView({ userId = 1, audioPlayer, setCurrentSong, onBack, songImageMap, songArtistMap }) {
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [playlistSongs, setPlaylistSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredSong, setHoveredSong] = useState(null)
  // const [songArtistMap, setSongArtistMap] = useState({}) // Removed songArtistMap state

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
      setError("Error loading playlists: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchPlaylistDetails = async (playlistName) => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.BASE_API_URL || import.meta.env.VITE_BASE_API_URL}/api/playlists/get?userId=${userId}&playlistName=${encodeURIComponent(playlistName)}`,
      )
      if (!response.ok) throw new Error("Failed to fetch playlist details")

      const data = await response.json()
      console.log("Playlist details:", data) // Debug log
      setSelectedPlaylist(data)
      setPlaylistSongs(data.songs || [])
    } catch (err) {
      console.error("Error fetching playlist:", err)
      setError("Error loading playlist: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaySong = (song) => {
    // Get the full song name with extension
    const fullSongName = Object.keys(songImageMap).find((key) => key.replace(/\.mp3$/, "") === song)

    if (fullSongName) {
      const url = `/songs/${encodeURIComponent(fullSongName)}`
      console.log("Playing song:", song, "URL:", url)
      audioPlayer.loadTrack(url)
      audioPlayer.togglePlay()
      setCurrentSong({
        name: song,
        image: songImageMap[fullSongName] || "/placeholder.svg",
      })
    } else {
      console.warn("Could not find full song name for:", song)
    }
  }

  const handleBackToPlaylists = () => {
    setSelectedPlaylist(null)
    setPlaylistSongs([])
  }

  // Find a song image by name (without extension)
  const findSongImage = (songName) => {
    const fullSongName = Object.keys(songImageMap).find((key) => key.replace(/\.mp3$/, "") === songName)
    return fullSongName ? songImageMap[fullSongName] : "/placeholder.svg"
  }

  // Filter playlists based on search query
  const filteredPlaylists = searchQuery
    ? playlists.filter((p) => p.playlistName.toLowerCase().includes(searchQuery.toLowerCase()))
    : playlists

  // Filter playlist songs based on search query
  const filteredPlaylistSongs =
    searchQuery && selectedPlaylist
      ? playlistSongs.filter((song) => song.toLowerCase().includes(searchQuery.toLowerCase()))
      : playlistSongs

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900/20 via-black to-indigo-900/20">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 border-b border-white/5 px-8 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={selectedPlaylist ? handleBackToPlaylists : onBack}
            className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            {selectedPlaylist ? selectedPlaylist.playlistName : "Your Playlists"}
          </h2>

          <div className="ml-auto relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search size={16} className="text-white/40" />
            </div>
            <input
              type="text"
              placeholder={selectedPlaylist ? "Search in playlist..." : "Search playlists..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full px-10 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64 backdrop-blur-sm"
            />
          </div>
        </div>
      </header>

      <main className="p-8 flex-1 overflow-y-auto pb-32">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-8 backdrop-blur-sm">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Playlists Grid View */}
        {!selectedPlaylist && !loading && (
          <div>
            {filteredPlaylists.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30 mb-4">
                  <Music size={24} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No playlists yet</h3>
                <p className="text-white/60 max-w-md mx-auto mb-6">
                  Start by creating a playlist and adding your favorite songs to it.
                </p>
                <button className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/20 flex items-center gap-2 mx-auto">
                  <Plus size={18} />
                  <span>Create Playlist</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredPlaylists.map((playlist) => (
                  <div
                    key={`${playlist.userId}-${playlist.playlistName}`}
                    className="group cursor-pointer"
                    onClick={() => fetchPlaylistDetails(playlist.playlistName)}
                  >
                    <div className="aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden relative group-hover:shadow-xl group-hover:shadow-purple-500/10 transition-all duration-300">
                      {/* Show up to 4 song images in a grid if songs exist */}
                      {playlist.songs && playlist.songs.length > 0 ? (
                        <div className="grid grid-cols-2 w-full h-full">
                          {playlist.songs.slice(0, 4).map((song, idx) => (
                            <div key={idx} className="overflow-hidden">
                              <img
                                src={findSongImage(song) || "/placeholder.svg"}
                                alt={song}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {/* Fill empty slots with placeholders */}
                          {Array(Math.max(0, 4 - (playlist.songs?.length || 0)))
                            .fill(0)
                            .map((_, idx) => (
                              <div
                                key={`empty-${idx}`}
                                className="bg-gradient-to-br from-purple-900/30 to-pink-900/30"
                              ></div>
                            ))}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                          <Music size={40} className="text-white/30" />
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white text-purple-600 rounded-full p-3 transform transition-transform duration-300 hover:scale-110 shadow-lg">
                          <Play size={24} fill="currentColor" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h3 className="font-medium text-white truncate">{playlist.playlistName}</h3>
                      <p className="text-sm text-white/60">
                        {playlist.songs ? `${playlist.songs.length} songs` : "0 songs"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Playlist Songs List View */}
        {selectedPlaylist && !loading && (
          <div>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-xl shadow-purple-900/20 flex items-center justify-center">
                {playlistSongs.length > 0 ? (
                  <div className="grid grid-cols-2 w-full h-full overflow-hidden rounded-xl">
                    {playlistSongs.slice(0, 4).map((song, idx) => (
                      <div key={idx} className="overflow-hidden">
                        <img
                          src={findSongImage(song) || "/placeholder.svg"}
                          alt={song}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {/* Fill empty slots with placeholders */}
                    {Array(Math.max(0, 4 - playlistSongs.length))
                      .fill(0)
                      .map((_, idx) => (
                        <div key={`empty-${idx}`} className="bg-gradient-to-br from-purple-900/50 to-pink-900/50"></div>
                      ))}
                  </div>
                ) : (
                  <Music size={64} className="text-white/40" />
                )}
              </div>

              <div>
                <p className="text-white/60 text-sm uppercase tracking-wider mb-1">Playlist</p>
                <h2 className="text-4xl font-bold text-white mb-2">{selectedPlaylist.playlistName}</h2>
                <p className="text-white/60">{playlistSongs.length} songs</p>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full font-medium transition-colors shadow-lg shadow-purple-900/20 flex items-center gap-2"
                    onClick={() => {
                      if (playlistSongs.length > 0) {
                        handlePlaySong(playlistSongs[0])
                      }
                    }}
                  >
                    <Play size={18} fill="currentColor" />
                    <span>Play All</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Debug section - remove after confirming it works */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
                <details>
                  <summary className="text-white/60 cursor-pointer">Debug: Playlist Data</summary>
                  <pre className="text-xs text-white/60 mt-2 overflow-auto max-h-40">
                    {JSON.stringify(selectedPlaylist, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {filteredPlaylistSongs.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30 mb-4">
                  <Music size={24} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {searchQuery ? "No matching songs found" : "No songs in this playlist"}
                </h3>
                <p className="text-white/60 max-w-md mx-auto">
                  {searchQuery
                    ? `Try a different search term or add songs matching "${searchQuery}"`
                    : "Add songs while playing them."}
                </p>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
                <div className="grid grid-cols-12 px-4 py-3 border-b border-white/10 text-white/60 text-sm font-medium">
                  <div className="col-span-6 flex items-center"># Title</div>
                  <div className="col-span-4">Artist</div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-white/5">
                  {filteredPlaylistSongs.map((song, idx) => (
                    <div
                      key={`${song}-${idx}`}
                      className="grid grid-cols-12 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => handlePlaySong(song)}
                      onMouseEnter={() => setHoveredSong(idx)}
                      onMouseLeave={() => setHoveredSong(null)}
                    >
                      <div className="col-span-6 flex items-center gap-3">
                        <div className="w-10 h-10 relative rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={findSongImage(song) || "/placeholder.svg"}
                            alt={song}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className={`absolute inset-0 bg-black/40 flex items-center justify-center ${hoveredSong === idx ? "opacity-100" : "opacity-0"} transition-opacity`}
                          >
                            <Play size={16} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium truncate">{song}</p>
                        </div>
                      </div>
                      <div className="col-span-4 flex items-center text-white/70">
                        {(() => {
                          // Try to find the artist for this song
                          const fullSongName = Object.keys(songImageMap).find(
                            (key) => key.replace(/\.mp3$/, "") === song,
                          )
                          return fullSongName && songArtistMap
                            ? songArtistMap[fullSongName] || "Unknown Artist"
                            : "Unknown Artist"
                        })()}
                      </div>
                      <div className="col-span-1 flex items-center justify-center text-white/70 text-sm">3:45</div>
                      <div className="col-span-1 flex items-center justify-end">
                        <button
                          className="text-white/40 hover:text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Remove song logic
                          }}
                        >
                          <Heart size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
