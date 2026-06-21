package com.project.interview.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "skills")
public class SkillEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "name", nullable = false, length = 124)
    private String name;
    @Column(name = "title", nullable = false, length = 12)
    private String title;
    @Column(name = "parent_id")
    private Long parentId;
    @OneToMany(mappedBy = "skill")
    private Set<UserRoleSkillEntity> userRoleSkillEntitySet = new HashSet<>();
}
