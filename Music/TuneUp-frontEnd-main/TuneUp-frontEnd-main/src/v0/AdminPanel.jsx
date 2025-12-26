"use client"

import { useState } from "react";
import { Upload, Music, Image, X, Loader2, Check } from "lucide-react";

export default function AdminPanel() {
  const [songName, setSongName] = useState("");
  const [mp3File, setMp3File] = useState(null);
  const [albumImage, setAlbumImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleMp3Upload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "audio/mpeg") {
      setMp3File(file);
    } else {
      setError("Please upload a valid MP3 file");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setAlbumImage(file);
    } else {
      setError("Please upload a valid JPG or PNG image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!songName || !mp3File || !albumImage) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const formData = new FormData();
      formData.append("songName", songName);
      formData.append("mp3File", mp3File);
      formData.append("albumImage", albumImage);

      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/songs/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload song");
      
      setSuccess("Song uploaded successfully!");
      setSongName("");
      setMp3File(null);
      setAlbumImage(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-white/10">
      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
        Add New Song
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm mb-1">Song Name</label>
          <input
            type="text"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            placeholder="Enter song name"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-1">MP3 File</label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
            {mp3File ? (
              <div className="flex items-center gap-2 text-white">
                <Music size={18} />
                <span className="truncate max-w-xs">{mp3File.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload size={24} className="mb-2 text-white/60" />
                <p className="text-sm text-white/60">Click to upload MP3</p>
              </div>
            )}
            <input 
              type="file" 
              className="hidden" 
              accept=".mp3,audio/mpeg"
              onChange={handleMp3Upload}
              disabled={loading}
            />
          </label>
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-1">Album Image</label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
            {albumImage ? (
              <div className="flex items-center gap-2 text-white">
                <Image size={18} />
                <span className="truncate max-w-xs">{albumImage.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload size={24} className="mb-2 text-white/60" />
                <p className="text-sm text-white/60">Click to upload image</p>
              </div>
            )}
            <input 
              type="file" 
              className="hidden" 
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={handleImageUpload}
              disabled={loading}
            />
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <X size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <Check size={16} className="flex-shrink-0" />
              <span>{success}</span>
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          Upload Song
        </button>
      </form>
    </div>
  );
}