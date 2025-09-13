package com.example.demo.user;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    private String id;

    private String color;
    private String lastFile;
    private Integer xZoom;
    private Integer yZoom;

    public User() {

    }

    public User(String id, String color, Integer xZoom, Integer yZoom) {
        this.id = id;
        this.color = color;
        this.xZoom = xZoom;
        this.yZoom = yZoom;
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

    public Integer getxZoom() {
        return xZoom;
    }

    public void setxZoom(Integer xZoom) {
        this.xZoom = xZoom;
    }

    public Integer getyZoom() {
        return yZoom;
    }

    public void setyZoom(Integer yZoom) {
        this.yZoom = yZoom;
    }
}





