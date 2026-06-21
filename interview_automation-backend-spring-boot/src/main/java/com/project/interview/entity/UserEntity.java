package com.project.interview.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "password")
    private String password;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "first_name", nullable = false)
    private String firstname;

    @Column(name = "last_name", nullable = false)
    private String lastname;

    @Column(name = "avatar_img_url")
    private String avatarImgUrl;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private Set<UserRoleSkillEntity> userRoleSkillEntitySet;
}


