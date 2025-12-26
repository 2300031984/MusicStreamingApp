package com.spring.online.demo.DAO;

import com.spring.online.demo.models.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByUserId(Long userId);
    Playlist findByUserIdAndPlaylistName(Long userId, String playlistName);
    boolean existsByUserIdAndPlaylistName(Long userId, String playlistName);
}