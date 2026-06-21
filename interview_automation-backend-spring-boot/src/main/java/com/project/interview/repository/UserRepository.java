package com.project.interview.repository;

import com.project.interview.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Page<UserEntity> findAll(Pageable pageable);

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query(value = """
            SELECT searcher_id, MAX(grade) AS max_grade
            FROM interviews i
            JOIN interview_questions iq ON i.id = iq.interview_id
            JOIN skills s ON iq.skill_id = s.id
            WHERE s.name = ? AND iq.grade >= ?
            GROUP BY searcher_id;
            """, nativeQuery = true)
    List<Object[]> findSearcherIdsAndMaxGradeBySkillNameAndSkillGrade(String skillName, Integer skillGrade);

    @Modifying
    @Query("update UserEntity u set u.password = :password where u.id = :id")
    void setPasswordForUserById(@Param("password") String password,
                                  @Param("id") long id);

//
//    @Modifying
//    @Transactional
//    @Query("update InterviewEntity i set i.interviewer.id = null where i.interviewer.id = :userId")
//    void nullifyInterviewerId(@Param("userId") Long userId);
//
//    @Modifying
//    @Transactional
//    @Query("update InterviewEntity i set i.searcher.id = null where i.searcher.id = :userId")
//    void nullifySearcherId(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("delete from RefreshToken rt where rt.userEntity.id = :userId")
    void deleteRefreshTokens(@Param("userId") Long userId);

//    @Modifying
//    @Transactional
//    @Query("delete from I iq where iq.interviewer.id = :userId")
//    void deleteInterviewerQuestion(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("delete from UserRoleSkillEntity urs where urs.user.id = :userId")
    void deleteUserRoleSkills(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("delete from UserEntity u where u.id = :userId")
    void deleteUserById(@Param("userId") Long userId);

//    @Query
    Optional<UserEntity> findByLastnameContainingIgnoreCase(String lastname);

    @Modifying
    @Query("select urs.skill.id from UserRoleSkillEntity urs where urs.user.id = :userId")
    List<Object[]> findSkillGradesByUserId(@Param("userId") Long userId);
}
