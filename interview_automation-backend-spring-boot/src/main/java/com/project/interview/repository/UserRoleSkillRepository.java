package com.project.interview.repository;

import com.project.interview.entity.UserRoleSkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRoleSkillRepository extends JpaRepository<UserRoleSkillEntity, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM UserRoleSkillEntity urs WHERE urs.user.id = :userId AND urs.role.id = :roleId AND urs.skill.id = :skillId")
    void deleteByUserIdAndRoleIdAndSkillId(@Param("userId") Long userId, @Param("roleId") Long roleId, @Param("skillId") Long skillId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserRoleSkillEntity urs WHERE urs.user.id = :userId AND urs.role.id = :roleId")
    void deleteByUserIdAndRoleId(@Param("userId") Long userId, @Param("roleId") Long roleId);
}
