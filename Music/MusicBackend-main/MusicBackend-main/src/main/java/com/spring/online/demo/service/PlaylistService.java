package com.spring.online.demo.service;

import com.spring.online.demo.DAO.PlaylistRepository;
import com.spring.online.demo.models.Playlist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistService {
    @Autowired
    private PlaylistRepository playlistRepository;

    public Playlist createPlaylist(Long userId, String playlistName) {
        if (playlistRepository.existsByUserIdAndPlaylistName(userId, playlistName)) {
            throw new IllegalArgumentException("Playlist with the same name already exists.");
        }
        Playlist playlist = new Playlist(userId, playlistName);
        return playlistRepository.save(playlist);
    }

    public Playlist addSongToPlaylist(Long userId, String playlistName, String songName) {
        Playlist playlist = playlistRepository.findByUserIdAndPlaylistName(userId, playlistName);
        if (playlist == null) {
            playlist = new Playlist(userId, playlistName);
        }
        playlist.addSong(songName);
        return playlistRepository.save(playlist);
    }

    public List<Playlist> getUserPlaylists(Long userId) {
        return playlistRepository.findByUserId(userId);
    }

    public Playlist getPlaylist(Long userId, String playlistName) {
        return playlistRepository.findByUserIdAndPlaylistName(userId, playlistName);
    }
}