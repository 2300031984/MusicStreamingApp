package com.spring.online.demo.controller;

import com.spring.online.demo.models.Playlist;
import com.spring.online.demo.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {
    @Autowired
    private PlaylistService playlistService;

    @PostMapping("/create")
    public Playlist createPlaylist(@RequestBody Playlist playlist) {
        return playlistService.createPlaylist(playlist.getUserId(), playlist.getPlaylistName());
    }

    @PostMapping("/addSong")
    public Playlist addSongToPlaylist(@RequestBody Playlist playlist) {
        return playlistService.addSongToPlaylist(playlist.getUserId(), playlist.getPlaylistName(), playlist.getSongName());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Playlist>> getUserPlaylists(@PathVariable Long userId) {
        List<Playlist> playlists = playlistService.getUserPlaylists(userId);
        return ResponseEntity.ok(playlists);
    }

    @GetMapping("/get")
    public ResponseEntity<Playlist> getPlaylist(@RequestParam Long userId, @RequestParam String playlistName) {
        Playlist playlist = playlistService.getPlaylist(userId, playlistName);
        if (playlist == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(playlist);
    }
}