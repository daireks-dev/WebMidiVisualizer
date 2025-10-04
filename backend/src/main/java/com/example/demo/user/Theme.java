package com.example.demo.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "themes")
public class Theme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore   // prevent infinite recursion
    private User user;

    @ElementCollection
    @CollectionTable(name = "theme_bg_colors", joinColumns = @JoinColumn(name = "theme_id"))
    @Column(name = "bg_color")
    private List<String> bg_colors = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "theme_track_colors", joinColumns = @JoinColumn(name = "theme_id"))
    @Column(name = "track_color")
    private List<String> track_colors = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "theme_key_colors", joinColumns = @JoinColumn(name = "theme_id"))
    @Column(name = "key_color")
    private List<String> key_colors = new ArrayList<>();

    private int xZoom;
    private int yPadding;
    private boolean active;

    public Theme() {}

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<String> getBg_colors() { return bg_colors; }
    public void setBg_colors(List<String> bg_colors) { this.bg_colors = bg_colors; }

    public List<String> getTrack_colors() { return track_colors; }
    public void setTrack_colors(List<String> track_colors) { this.track_colors = track_colors; }

    public List<String> getKey_colors() { return key_colors; }
    public void setKey_colors(List<String> key_colors) { this.key_colors = key_colors; }

    public int getxZoom() { return xZoom; }
    public void setxZoom(int xZoom) { this.xZoom = xZoom; }

    public int getyPadding() { return yPadding; }
    public void setyPadding(int yPadding) { this.yPadding = yPadding; }
}
