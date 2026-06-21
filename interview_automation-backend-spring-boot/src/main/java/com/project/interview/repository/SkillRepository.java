package com.project.interview.repository;

import com.project.interview.entity.SkillEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Repository
public interface SkillRepository extends JpaRepository<SkillEntity, Long> {
    @Query(value = """
                WITH RECURSIVE rectree(id, name, title, parent_id) AS (
                    SELECT id, name, title, COALESCE(parent_id, 0)
                    FROM skills
                    WHERE COALESCE(parent_id, 0) = ?
                    UNION ALL
                    SELECT s.id, s.name, s.title, COALESCE(s.parent_id, 0)
                    FROM skills s
                    JOIN rectree
                    ON s.parent_id = rectree.id
                ) SELECT * FROM rectree
                ORDER BY name ASC;
            """, nativeQuery = true)
    List<SkillEntity> getSkillTree(Long id);

    @Query(value = """
                SELECT skill_id
                FROM user_role_skill
                WHERE user_id = :userId AND role_id = :roleId
            """, nativeQuery = true)
    Set<Long> getUserSkills(Long userId, Long roleId);

    @Modifying
    @Transactional
    @Query(value = """
                INSERT INTO user_role_skill (user_id, role_id, skill_id)
                VALUES (:userId, :roleId, :skillId)
            """, nativeQuery = true)
    void addSkillToUser(Long userId, Long roleId, Long skillId);

    SkillEntity findByName(String name);
}
