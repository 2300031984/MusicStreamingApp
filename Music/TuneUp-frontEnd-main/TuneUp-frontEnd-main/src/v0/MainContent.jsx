"use client"

import { useEffect, useState } from "react"
import { MoreVertical, PlusSquare, Play, Heart, Clock, Download } from "lucide-react"
import PlaylistView from "./PlaylistView"
import Chatbot from "./Chatbot"  // Import the Chatbot component
import './bhAAi.css'
const scrollbarHideStyle = `
  * {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
  }
  *::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    background: transparent !important;
  }
`

const songImageMap = {
  "All Most Padipoyinde Pilla.mp3": "/songs/All Most Padipoyinde Pilla.jpg.jpg",
  "Bholaa Mania.mp3": "/songs/Bholaa Mania.jpg.jpg",
  "Boss Party.mp3": "/songs/Boss Party.jpg.jpg",
  "Chamkeela Angeelesi.mp3": "/songs/Chamkeela Angeelesi.jpg.jpg",
  "Dhoom Dhaam Dhosthaan.mp3": "/songs/Dhoom Dhaam Dhosthaan.jpg.jpg",
  "Endhe Endhe.mp3": "/songs/Endhe Endhe.jpg.jpg",
  "Guntur Kaaram.mp3": "/songs/Guntur Kaaram.jpg.jpg",
  "Hathavidi.mp3": "/songs/Hathavidi.jpg.jpg",
  "I Phone.mp3": "/songs/I Phone.jpg.jpg",
  "Jai Balayya.mp3": "/songs/Jai Balayya.jpg.jpg",
  "Jai Shriram.mp3": "/songs/Jai Shriram.jpg.jpg",
  "Kalallo.mp3": "/songs/Kalallo.jpg.jpg",
  "Maa Bava Manobhavalu.mp3": "/songs/Maa Bava Manobhavalu.jpg.jpg",
  "Malli Malli.mp3": "/songs/Malli Malli.jpg.jpg",
  "Mawa Bro.mp3": "/songs/Mawa Bro.jpg.jpg",
  "Monalisa Monalisa.mp3": "/songs/Monalisa Monalisa.jpg.jpg",
  "Monna Badilo.mp3": "/songs/Monna Badilo.jpg.jpg",
  "Na Roja Nuvve.mp3": "/songs/Na Roja Nuvve.jpg.jpg",
  "Nachavule Nachavule.mp3": "/songs/Nachavule Nachavule.jpg.jpg",
  "Neekemo Andamekkuva.mp3": "/songs/Neekemo Andamekkuva.jpg.jpg",
  "No No No.mp3": "/songs/No No No.jpg.jpg",
  "O Dollar Pillagaa.mp3": "/songs/O Dollar Pillagaa.jpg.jpg",
  "Oh Ammalaalo Ammalaalo.mp3": "/songs/Oh Ammalaalo Ammalaalo.jpg.jpg",
  "Ori Vaari.mp3": "/songs/Ori Vaari.jpg.jpg",
  "Poonakaalu Loading.mp3": "/songs/Poonakaalu Loading.jpg.jpg",
  "Priya Mithunam.mp3": "/songs/Priya Mithunam.jpg.jpg",
  "Ragile Jwaale.mp3": "/songs/Ragile Jwaale.jpg.jpg",
  "Ram Sita Ram.mp3": "/songs/Ram Sita Ram.jpg.jpg",
  "Rama Krishna.mp3": "/songs/Rama Krishna.jpg.jpg",
  "Ranjithame.mp3": "/songs/Ranjithame.jpg.jpg",
  "Shivoham.mp3": "/songs/Shivoham.jpg.jpg",
  "Silk Bar.mp3": "/songs/Silk Bar.jpg.jpg",
  "Sridevi Chiranjeevi.mp3": "/songs/Sridevi Chiranjeevi.jpg.jpg",
  "Suguna Sundari.mp3": "/songs/Suguna Sundari.jpg.jpg",
  "Wild Saala.mp3": "/songs/Wild Saala.jpg.jpg",
  "Yevarini Yevaritho.mp3": "/songs/Yevarini Yevaritho.jpg.jpg",
}

const songArtistMap = {
  "All Most Padipoyinde Pilla.mp3": "Sid Sriram",
  "Bholaa Mania.mp3": "Vishal Mishra",
  "Boss Party.mp3": "Nakash Aziz",
  "Chamkeela Angeelesi.mp3": "Dheekshith, Hema Chandra",
  "Dhoom Dhaam Dhosthaan.mp3": "Kaala Bhairava",
  "Endhe Endhe.mp3": "Sid Sriram",
  "Guntur Kaaram.mp3": "Shilpa Rao, Sri Krishna, Anurag Kulkarni",
  "Hathavidi.mp3": "Anurag Kulkarni",
  "I Phone.mp3": "Ram Miriyala",
  "Jai Balayya.mp3": "Rahul Sipligunj, Geetha Madhuri",
  "Jai Shriram.mp3": "Ajay-Atul, Chorus",
  "Kalallo.mp3": "Sid Sriram",
  "Maa Bava Manobhavalu.mp3": "Ram Miriyala, Rahul Sipligunj, Roll Rida",
  "Malli Malli.mp3": "Anurag Kulkarni",
  "Mawa Bro.mp3": "Anirudh Ravichander, Rahul Sipligunj",
  "Monalisa Monalisa.mp3": "Anurag Kulkarni",
  "Monna Badilo.mp3": "Sid Sriram",
  "Na Roja Nuvve.mp3": "Hesham Abdul Wahab",
  "Nachavule Nachavule.mp3": "Anurag Kulkarni",
  "Neekemo Andamekkuva.mp3": "Sid Sriram",
  "No No No.mp3": "Shreya Ghoshal, Anurag Kulkarni",
  "O Dollar Pillagaa.mp3": "Ram Miriyala, Sahithi Chaganti",
  "Oh Ammalaalo Ammalaalo.mp3": "Shankar Mahadevan, Vishal Mishra",
  "Ori Vaari.mp3": "Santhosh Narayanan",
  "Poonakaalu Loading.mp3": "Ram Miriyala, Roll Rida",
  "Priya Mithunam.mp3": "Sid Sriram",
  "Ragile Jwaale.mp3": "Shreya Ghoshal, Anurag Kulkarni",
  "Ram Sita Ram.mp3": "Sachet Tandon, Parampara Tandon",
  "Rama Krishna.mp3": "Anurag Kulkarni",
  "Ranjithame.mp3": "Ranjith Govind, M M Manasi",
  "Shivoham.mp3": "Ajay-Atul, Chorus",
  "Silk Bar.mp3": "Anurag Kulkarni",
  "Sridevi Chiranjeevi.mp3": "S. P. Charan, Anurag Kulkarni",
  "Suguna Sundari.mp3": "Anurag Kulkarni",
  "Wild Saala.mp3": "Anurag Kulkarni",
  "Yevarini Yevaritho.mp3": "Sid Sriram",
}

const songMovieMap = {
  "All Most Padipoyinde Pilla.mp3": "Samajavaragamana",
  "Bholaa Mania.mp3": "Bholaa",
  "Boss Party.mp3": "Waltair Veerayya",
  "Chamkeela Angeelesi.mp3": "Aadikeshava",
  "Dhoom Dhaam Dhosthaan.mp3": "Baby",
  "Endhe Endhe.mp3": "Uppena",
  "Guntur Kaaram.mp3": "Guntur Kaaram",
  "Hathavidi.mp3": "Aadikeshava",
  "I Phone.mp3": "Extra",
  "Jai Balayya.mp3": "Veera Simha Reddy",
  "Jai Shriram.mp3": "Adipurush",
  "Kalallo.mp3": "Love Story",
  "Maa Bava Manobhavalu.mp3": "MAD (Mass Adda Dhana)",
  "Malli Malli.mp3": "Hi Nanna",
  "Mawa Bro.mp3": "Dhamaka",
  "Monalisa Monalisa.mp3": "Sarkaru Vaari Paata",
  "Monna Badilo.mp3": "Tuck Jagadish",
  "Na Roja Nuvve.mp3": "Kushi",
  "Nachavule Nachavule.mp3": "Sridevi Soda Center",
  "Neekemo Andamekkuva.mp3": "Bheemla Nayak",
  "No No No.mp3": "Pushpa: The Rise",
  "O Dollar Pillagaa.mp3": "Karthikeya 2",
  "Oh Ammalaalo Ammalaalo.mp3": "The Raja Saab",
  "Ori Vaari.mp3": "Dasara",
  "Poonakaalu Loading.mp3": "Pushpa: The Rise",
  "Priya Mithunam.mp3": "Mr. Majnu",
  "Ragile Jwaale.mp3": "Theenmar",
  "Ram Sita Ram.mp3": "RRR",
  "Rama Krishna.mp3": "Satya Dev 24CV",
  "Ranjithame.mp3": "Varisu",
  "Shivoham.mp3": "Adipurush",
  "Silk Bar.mp3": "Odela 2",
  "Sridevi Chiranjeevi.mp3": "Gang Leader",
  "Suguna Sundari.mp3": "Gentleman",
  "Wild Saala.mp3": "Pushpa: The Rise",
  "Yevarini Yevaritho.mp3": "DJ Tillu"
}

export default function MainContent({
  sidebarOpen,
  audioPlayer,
  setCurrentSong,
  activeView,
  onSwitchToSongsView,
  onOpenPlaylistManagerModal,
}) {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [menuOpenIdx, setMenuOpenIdx] = useState(null)
  const [hoveredSong, setHoveredSong] = useState(null)
  const [searchQuery, setSearchQuery] = useState("") // Search query state
  const [searchFilter, setSearchFilter] = useState("all") // Search filter state: all, song, artist, movie

  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = scrollbarHideStyle
    document.head.appendChild(styleElement)
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    async function fetchSongs() {
      try {
        setSongs(Object.keys(songImageMap))
        setLoading(false)
      } catch (err) {
        setError("Failed to load songs.")
        setLoading(false)
      }
    }
    fetchSongs()
  }, [])

  // Filter songs based on search query and search filter
  const filteredSongs = searchQuery
    ? songs.filter((song) => {
        const songName = song.toLowerCase().replace(/\.mp3$/, "")
        const artist = (songArtistMap[song] || "").toLowerCase()
        const movie = (songMovieMap[song] || "").toLowerCase()
        const query = searchQuery.toLowerCase()
        
        if (searchFilter === "all") {
          return songName.includes(query) || artist.includes(query) || movie.includes(query)
        } else if (searchFilter === "movie") {
          return movie.includes(query)
        } else if (searchFilter === "artist") {
          return artist.includes(query)
        } else { // song
          return songName.includes(query)
        }
      })
    : songs

  // Update search query state on input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Update search filter state
  const handleSearchFilterChange = (e) => {
    setSearchFilter(e.target.value)
  }

  const handlePlaySong = (song) => {
    const url = `/songs/${encodeURIComponent(song)}`
    audioPlayer.loadTrack(url)
    audioPlayer.togglePlay()
    setCurrentSong({
      name: song.replace(/\.mp3$/, ""),
      image: songImageMap[song] || "/placeholder.svg",
    })
  }

  const handleSongMenu = (e, idx) => {
    e.stopPropagation()
    setMenuOpenIdx(menuOpenIdx === idx ? null : idx)
  }

  const handleInitiateAddToPlaylist = (songFile) => {
    setCurrentSong({
      name: songFile.replace(/\.mp3$/, ""),
      image: songImageMap[songFile] || "/placeholder.svg",
    })
    if (onOpenPlaylistManagerModal) {
      onOpenPlaylistManagerModal()
    }
    setMenuOpenIdx(null)
  }

  if (activeView === "playlists") {
    return (
      <PlaylistView
        audioPlayer={audioPlayer}
        setCurrentSong={setCurrentSong}
        onBack={onSwitchToSongsView}
        songImageMap={songImageMap}
        songArtistMap={songArtistMap}
        songMovieMap={songMovieMap}
      />
    )
  }

  return (
    <div className="h-screen overflow-y-auto flex flex-col bg-gradient-to-br from-purple-900/20 via-black to-indigo-900/20">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 border-b border-white/5 px-8 py-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Discover Music
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search songs, artists, movies..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-white/5 border border-white/10 rounded-full px-5 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64 backdrop-blur-sm"
              />
            <select 
              value={searchFilter}
              onChange={handleSearchFilterChange}
              className="ml-2 bg-gradient-to-br from-purple-800/50 to-black border border-white/10 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all backdrop-blur-sm hover:bg-purple-700/50"
            >
              <option value="all">All</option>
              <option value="song">Songs</option>
              <option value="artist">Artists</option>
              <option value="movie">Movies</option>
            </select>

            </div>
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

        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white/90">Featured Tracks</h3>
            <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredSongs.slice(0, 6).map((song, idx) => (
              <div
                key={idx}
                className="group relative"
                onClick={() => handlePlaySong(song)}
                onMouseEnter={() => setHoveredSong(idx)}
                onMouseLeave={() => setHoveredSong(null)}
              >
                <div className="relative overflow-hidden rounded-xl aspect-square transition-all duration-300 group-hover:shadow-xl group-hover:shadow-purple-500/20">
                  <img
                    src={songImageMap[song] || "/placeholder.svg"}
                    alt={song.replace(/\.mp3$/, "")}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Play button overlay */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${hoveredSong === idx ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                  >
                    <button className="bg-purple-600 hover:bg-purple-500 text-white rounded-full p-3 transform transition-transform duration-300 hover:scale-110 shadow-lg">
                      <Play size={24} fill="white" />
                    </button>
                  </div>

                  {/* Like button */}
                  <button className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-purple-600">
                    <Heart size={16} className="text-white" />
                  </button>
                </div>

                <div className="mt-3 space-y-1">
                  <h4 className="font-medium text-white truncate">{song.replace(/\.mp3$/, "")}</h4>
                  <p className="text-sm text-white/60 truncate">{songArtistMap[song] || "Unknown Artist"}</p>
                  <p className="text-xs text-white/40 truncate">From: {songMovieMap[song] || "Unknown Movie"}</p>
                </div>

                <button
                  className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-purple-600"
                  onClick={(e) => handleSongMenu(e, idx)}
                >
                  <MoreVertical size={16} className="text-white" />
                </button>

                {menuOpenIdx === idx && (
                  <div className="absolute top-12 left-3 z-50 bg-zinc-900/95 backdrop-blur-md rounded-xl shadow-xl border border-white/10 p-1 w-48 animate-in fade-in slide-in-from-top-5 duration-200">
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleInitiateAddToPlaylist(song)
                      }}
                    >
                      <PlusSquare size={16} />
                      <span>Add to Playlist</span>
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white/90">All Songs</h3>
            <div className="flex items-center gap-2">
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm">
                <option>Recently Added</option>
                <option>Alphabetical</option>
                <option>Artist</option>
                <option>Movie</option>
              </select>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-3 border-b border-white/10 text-white/60 text-sm font-medium">
              <div className="col-span-5 flex items-center"># Title</div>
              <div className="col-span-3">Artist</div>
              <div className="col-span-2">Movie</div>
              <div className="col-span-1 flex items-center justify-center">
                <Clock size={16} />
              </div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-white/5">
              {filteredSongs.map((song, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer group"
                  onClick={() => handlePlaySong(song)}
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={songImageMap[song] || "/placeholder.svg"}
                        alt={song.replace(/\.mp3$/, "")}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play size={16} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-medium truncate">{song.replace(/\.mp3$/, "")}</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center text-white/70">
                    {songArtistMap[song] || "Unknown Artist"}
                  </div>
                  <div className="col-span-2 flex items-center text-white/70">
                    {songMovieMap[song] || "Unknown Movie"}
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-white/70 text-sm">3:45</div>
                  <div className="col-span-1 flex items-center justify-end">
                    <button
                      className="text-white/40 hover:text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleInitiateAddToPlaylist(song)
                      }}
                    >
                      <PlusSquare size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* MoodTunes Chatbot integration */}
      <div className="chatbot-container">
        <Chatbot />
      </div>
    </div>
  )
}