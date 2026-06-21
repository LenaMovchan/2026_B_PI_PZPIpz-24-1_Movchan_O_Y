package com.project.interview.repository;

import com.project.interview.dtos.InterviewStatisticDto;
import com.project.interview.dtos.statistic.InterviewerStatsDto;
import com.project.interview.dtos.statistic.MostCheckedSkillDto;
import com.project.interview.dtos.statistic.SkillComplianceDto;
import com.project.interview.entity.InterviewEntity;
import com.project.interview.enumeration.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface InterviewRepository extends JpaRepository<InterviewEntity, Long> {
    List<InterviewEntity> findByInterviewer_IdOrSearcher_Id(Long id, Long id1);

    List<InterviewEntity> findBySearcherId(Long id);

    List<InterviewEntity> findBySearcherIdAndEndDateTimeBetween(Long searcherId, LocalDateTime from, LocalDateTime to);

    List<InterviewEntity> findByStatusAndPlannedDateTimeBetween(InterviewStatus interviewStatus, LocalDateTime tomorrow, LocalDateTime endOfTomorrow);

    @Query("""
                SELECT COUNT(i) > 0 FROM interviews i
                WHERE i.interviewer.id = :id
                AND i.plannedDateTime >= :start
                AND i.plannedDateTime <= :end
            """)
    boolean interviewerHaveInterviewOn(@Param("id") Long id, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("""
                SELECT COUNT(i) > 0 FROM interviews i
                WHERE i.searcher.id = :id
                AND i.plannedDateTime >= :start
                AND i.plannedDateTime <= :end
            """)
    boolean searcherHaveInterviewOn(@Param("id") Long id, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    List<InterviewEntity> findAllBySearcherIdAndStatus(long searcherId, InterviewStatus status);


    @Query(value = """
                SELECT
                    u.id AS interviewerId,
                    u.last_name AS lastName,
                    COUNT(DISTINCT i.id) AS totalInterviews,
                    COUNT(iq.id) AS totalQuestions,
                    ROUND(CAST(COUNT(iq.id) AS NUMERIC) / NULLIF(COUNT(DISTINCT i.id), 0), 2) AS avgQuestionsPerInterview
                FROM users u
                LEFT JOIN interviews i ON i.interviewer_id = u.id
                LEFT JOIN interview_questions iq ON iq.interview_id = i.id
                GROUP BY u.id, u.last_name
                ORDER BY totalInterviews DESC
            """, nativeQuery = true)
    List<InterviewStatisticDto> getInterviewStatisticsNative();


    // 1. Статистика кількості інтерв’ю по інтерв’юерах за період [cite: 825]
    @Query(value = """
            SELECT u.first_name as firstName, u.last_name as lastName, COUNT(i.id) as count
            FROM user u
            JOIN interview i ON u.id = i.interviewer_id
            WHERE i.status = 'COMPLETED' AND i.end_date_time BETWEEN :from AND :to
            GROUP BY u.id, u.first_name, u.last_name
            """, nativeQuery = true)
    List<Map<String, Object>> getInterviewerStats(LocalDateTime from, LocalDateTime to);


    @Query(value = """
            SELECT new com.project.interview.dtos.statistic.MostCheckedSkillDto(s.name, COUNT(iqr.id), AVG(CAST(iqr.grade AS double)))
            FROM interview_questions iqr
            JOIN iqr.skill s
            JOIN interviews i ON iqr.interviewId = i.id
            WHERE i.status = 'COMPLETED' AND i.endDateTime >= :fromDate
            GROUP BY s.id, s.name
            ORDER BY COUNT(iqr.id) DESC
            """)
    List<MostCheckedSkillDto> getMostCheckedSkills(@Param("fromDate") LocalDateTime fromDate);

    @Query("""
                SELECT new com.project.interview.dtos.statistic.SkillComplianceDto(
                    s.name, 
                    COUNT(DISTINCT i.searcher.id), 
                    AVG(CAST(iq.grade AS double))
                )
                FROM interview_questions iq
                JOIN iq.skill s
                JOIN interviews i ON iq.interviewId = i.id
                WHERE i.status = 'COMPLETED' 
                  AND i.endDateTime BETWEEN :fromDate AND :toDate
                GROUP BY s.id, s.name
            """)
    List<SkillComplianceDto> getSkillComplianceStats(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate
    );


    @Query("""
    SELECT new com.project.interview.dtos.statistic.InterviewerStatsDto(
        u.firstname, 
        u.lastname, 
        COUNT(i.id)
    )
    FROM interviews i
    JOIN i.interviewer u
    WHERE i.status = 'COMPLETED' 
      AND i.endDateTime BETWEEN :fromDate AND :toDate
    GROUP BY u.id, u.firstname, u.lastname
    ORDER BY COUNT(i.id) DESC
""")
    List<InterviewerStatsDto> getInterviewerStatistics(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate
    );

    @Query("""
    SELECT i FROM interviews i 
    LEFT JOIN FETCH i.questions q 
    LEFT JOIN FETCH q.skill 
    JOIN FETCH i.searcher s 
    WHERE i.status = 'COMPLETED' AND i.endDateTime BETWEEN :from AND :to
""")
    List<InterviewEntity> findInterviewsWithDetails(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("""
        SELECT DISTINCT i FROM interviews i 
        JOIN FETCH i.searcher s 
        LEFT JOIN FETCH i.questions q 
        LEFT JOIN FETCH q.skill sk 
        WHERE i.status = :status 
        AND i.endDateTime BETWEEN :start AND :end
    """)
    List<InterviewEntity> findAllByStatusAndEndDateTimeBetween(
            @Param("status") InterviewStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
