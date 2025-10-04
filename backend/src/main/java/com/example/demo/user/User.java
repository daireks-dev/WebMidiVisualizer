package com.example.demo.user;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    private String id;

    @OneToMany(mappedBy = "user", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER, orphanRemoval = true)
    @OrderColumn(name = "theme_order")
    private List<Theme> themes = new ArrayList<>();

    public User() {}

    public User(String id, List<Theme> themes) {
        this.id = id;
        this.themes = themes;
        for (Theme theme : themes) {
            theme.setUser(this); // ensure bidirectional link
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Theme> getThemes() {
        return themes;
    }

    public void setThemes(List<Theme> themes) {
        this.themes.clear();
        if (themes != null) {
            this.themes.addAll(themes);
            for (Theme theme : themes) {
                theme.setUser(this);
            }
        }
    }
}
