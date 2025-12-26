import Sidebar from "./v0/Sidebar";
import MainContent from "./v0/MainContent";
import PlayerControls from "./v0/PlayerControls";
import AddToPlaylistModal from "./v0/AddToPlaylistModal";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useSidebar } from "./hooks/useSidebar";
import { useState, useCallback } from "react";

export default function AppLayout() {
  const audioPlayer = useAudioPlayer();
  const { isOpen, toggleSidebar } = useSidebar();
  const [currentSong, setCurrentSong] = useState({ name: null, image: null });
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);

  const handleOpenAddToPlaylistModal = useCallback(() => {
    setIsAddToPlaylistModalOpen(true);
  }, []);

  const handleCloseAddToPlaylistModal = useCallback(() => {
    setIsAddToPlaylistModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black grid grid-rows-[1fr_auto] grid-cols-[auto_1fr]" style={{gridTemplateAreas: `'sidebar main' 'player player'`, minHeight: '100vh'}}>
      {/* Sidebar */}
      <div style={{gridArea: 'sidebar', height: '100vh'}} className="overflow-y-auto">
        <Sidebar 
          isOpen={isOpen} 
          toggleSidebar={toggleSidebar} 
          audioPlayer={audioPlayer}
          currentSong={currentSong}
          isAddToPlaylistModalOpen={isAddToPlaylistModalOpen}
          onOpenAddToPlaylistModal={handleOpenAddToPlaylistModal}
          onCloseAddToPlaylistModal={handleCloseAddToPlaylistModal}
        />
      </div>
      {/* Main content */}
      <div style={{gridArea: 'main', minHeight: 0}} className="overflow-hidden">
        <MainContent
          sidebarOpen={isOpen}
          audioPlayer={audioPlayer}
          setCurrentSong={setCurrentSong}
          onOpenPlaylistManagerModal={handleOpenAddToPlaylistModal}
        />
      </div>
      {/* Player controls */}
      <div style={{gridArea: 'player'}}>
        <PlayerControls
          audioPlayer={audioPlayer}
          currentSongImage={currentSong.image}
          currentSongName={currentSong.name}
          currentSongArtist={""}
        />
      </div>
      {/* Global Add to Playlist Modal - rendered on top of all content */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={handleCloseAddToPlaylistModal}
        audioPlayer={audioPlayer}
      />
    </div>
  );
}
