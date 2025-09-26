package com.example.demo.user;

import jakarta.persistence.*;

import java.util.List;
import java.util.Map;

@Entity
@Table(name = "users")
public class User {
    @Id
    private String id;

    private String color;
    private String lastFile;
    private Double xZoom;
    private Double yPadding;

    @ElementCollection
    private List<String> keyColors;

    @ElementCollection
    private List<String> trackColors;

    @ElementCollection
    private List<String> backgroundColors;

    public User() {

    }

    public User(String id, String color, Double xZoom, Double yPadding, List<String> keyColors, List<String> trackColors, List<String> backgroundColors) {
        this.id = id;
        this.color = color;
        this.xZoom = xZoom;
        this.yPadding = yPadding;
        this.keyColors = keyColors;
        this.trackColors = trackColors;
        this.backgroundColors = backgroundColors;
    }

    public List<String> getKeyColors() {
        return keyColors;
    }

    public void setKeyColors(List<String> keyColors) {
        this.keyColors = keyColors;
    }

    public List<String> getTrackColors() {
        return trackColors;
    }

    public void setTrackColors(List<String> trackColors) {
        this.trackColors = trackColors;
    }

    public List<String> getBackgroundColors() {
        return backgroundColors;
    }

    public void setBackgroundColors(List<String> backgroundColors) {
        this.backgroundColors = backgroundColors;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getLastFile() {
        return lastFile;
    }

    public void setLastFile(String lastFile) {
        this.lastFile = lastFile;
    }

    public Double getxZoom() {
        return xZoom;
    }

    public void setxZoom(Double xZoom) {
        this.xZoom = xZoom;
    }

    public Double getyPadding() {
        return yPadding;
    }

    public void setyPadding(Double yZoom) {
        this.yPadding = yZoom;
    }
}





