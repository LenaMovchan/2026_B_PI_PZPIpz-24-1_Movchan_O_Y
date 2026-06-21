package com.project.interview;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import com.project.interview.dtos.statistic.UserStatisticsPeriodDto;
import com.project.interview.entity.InterviewEntity;
import com.project.interview.entity.InterviewQuestionEntity;
import com.project.interview.entity.SkillEntity;
import com.project.interview.entity.UserEntity;
import com.project.interview.repository.InterviewRepository;
import com.project.interview.repository.SkillRepository;
import com.project.interview.repository.UserRepository;
import com.project.interview.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.web.server.ResponseStatusException;

class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private SkillRepository skillRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUserStatisticsByPeriod_success() {
        Long userId = 1L;
        LocalDate fromDate = LocalDate.of(2026, 1, 1);
        LocalDate toDate = LocalDate.of(2026, 1, 10);

        when(userRepository.findById(userId)).thenReturn(Optional.of(new UserEntity()));

        SkillEntity skill = new SkillEntity();
        skill.setId(100L);
        skill.setName("Java");

        InterviewQuestionEntity question = new InterviewQuestionEntity();
        question.setSkill(skill);
        question.setGrade(4);
        question.setQuestion("Explain OOP");

        InterviewEntity interview = new InterviewEntity();
        interview.setEndDateTime(LocalDateTime.of(2026, 1, 5, 12, 0));
        interview.setQuestions(Collections.singletonList(question));

        when(interviewRepository.findBySearcherIdAndEndDateTimeBetween(
                eq(userId),
                any(LocalDateTime.class),
                any(LocalDateTime.class)
        )).thenReturn(Collections.singletonList(interview));

        when(skillRepository.findById(100L)).thenReturn(Optional.of(skill));

        List<UserStatisticsPeriodDto> result = userService.getUserStatisticsByPeriod(userId, fromDate, toDate);

        assertNotNull(result);
        assertEquals(1, result.size());
        UserStatisticsPeriodDto stats = result.get(0);
        assertEquals("Java", stats.getSkillName());
        assertEquals(4.0, stats.getGrade());
        assertEquals(1, stats.getQuestions().size());
        assertEquals("Explain OOP", stats.getQuestions().get(0).getQuestion());

        verify(userRepository).findById(userId);
        verify(interviewRepository).findBySearcherIdAndEndDateTimeBetween(eq(userId), any(), any());
        verify(skillRepository).findById(100L);
    }

    @Test
    void testGetUserStatisticsByPeriod_userNotFound() {
        Long userId = 1L;
        LocalDate fromDate = LocalDate.of(2026, 1, 1);
        LocalDate toDate = LocalDate.of(2026, 1, 10);

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> {
            userService.getUserStatisticsByPeriod(userId, fromDate, toDate);
        });

        verify(userRepository).findById(userId);
        verifyNoInteractions(interviewRepository);
        verifyNoInteractions(skillRepository);
    }
}

