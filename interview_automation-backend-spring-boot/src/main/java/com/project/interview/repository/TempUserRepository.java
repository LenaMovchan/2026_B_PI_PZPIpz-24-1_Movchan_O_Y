package com.project.interview.repository;

import com.project.interview.entity.TempUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Repository
public interface TempUserRepository extends JpaRepository<TempUserEntity, Long> {

    @Modifying
    @Transactional
    void deleteAllByExpireAtBefore(LocalDateTime localDateTime);

    boolean existsByEmail(String email);

    @Modifying
    @Transactional
    void deleteByEmail(String email);
}
