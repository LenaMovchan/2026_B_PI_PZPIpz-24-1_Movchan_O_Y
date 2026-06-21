package com.project.interview.service;

import com.project.interview.dtos.*;
import com.project.interview.dtos.interview.ShortInterviewDto;
import com.project.interview.dtos.result.SkillResultDto;
import com.project.interview.dtos.result.UserResultsByInterviewsResponseDto;
import com.project.interview.dtos.search.SearchSkillGradeDto;
import com.project.interview.dtos.statistic.QuestionGradeDto;
import com.project.interview.dtos.statistic.UserStatisticsPeriodDto;
import com.project.interview.entity.*;
import com.project.interview.enumeration.InterviewStatus;
import com.project.interview.mapper.InterviewMapper;
import com.project.interview.mapper.UserMapper;
import com.project.interview.repository.*;
import com.project.interview.security.oauth2.model.AuthDetails;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@Slf4j
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository repository;
    private final UserRoleSkillRepository userRoleSkillRepository;
    private final SkillRepository skillRepository;
    private final InterviewRepository interviewRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final RoleService roleService;
    private final SkillService skillService;
    private final UserMapper userMapper;
    private final InterviewMapper interviewMapper;
    private final PasswordEncoder passwordEncoder;

    public UserEntity create(UserEntity user) {

        if (repository.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User with the same email already exists");
        }
        log.info("User created successfully");
        return repository.save(user);
    }

    public UserEntity getByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated!");
        }

        return ((AuthDetails) authentication.getPrincipal()).getUserEntity();
    }

    public List<UserResponseDto> findAllUser(Pageable pageable) {
        log.info("Get all users");
        Page<UserEntity> allUsers = repository.findAll(pageable);
        return allUsers.stream()
                .map(userMapper::toDto).toList();
    }

    public UserEntity findById(long id) {
        return repository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public UserResponseDto getMe(AuthDetails authDetails) {
        return userMapper
                .toDto(authDetails.getUserEntity())
                .setRoles(userRoleSkillsToDto(
                        authDetails.getUserEntity().getId(),
                        authDetails.getUserEntity().getUserRoleSkillEntitySet()
                ));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return new AuthDetails(getByEmail(username));
    }

    public Set<RoleDto> getRoles() {
        return roleService.getAllRoles();
    }

    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    public UserEntity save(UserEntity userEntity) {
        return repository.save(userEntity);
    }

    public UserEntity saveNewUserWithDefaultRole(UserEntity userEntity) {
        UserRoleEntity role = roleService.findById(1L);
        userEntity.setId(0L);
        userEntity = save(userEntity);

        UserRoleSkillEntity userRoleSkillEntity = UserRoleSkillEntity
                .builder()
                .user(userEntity)
                .role(role)
                .build();
        userRoleSkillEntity = userRoleSkillRepository.save(userRoleSkillEntity);

        if (role.getUserRoleSkillEntitySet() == null) {
            role.setUserRoleSkillEntitySet(new HashSet<>());
        }
        role.getUserRoleSkillEntitySet().add(userRoleSkillEntity);
        userEntity.setUserRoleSkillEntitySet(new HashSet<>());
        userEntity.getUserRoleSkillEntitySet().add(userRoleSkillEntity);

        return userEntity;
    }

    public Optional<UserEntity> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    private Set<RoleWithSkillsDto> userRoleSkillsToDto(long userId,
                                                       Set<UserRoleSkillEntity> userRoleSkillEntities) {
        return userRoleSkillEntities
                .stream()
                .map(UserRoleSkillEntity::getRole)
                .distinct()
                .map(entity -> RoleWithSkillsDto
                        .builder()
                        .id(entity.getId())
                        .name(entity.getName())
                        .skills(skillService.getUserSkillsTree(userId, entity.getId()))
                        .build())
                .collect(Collectors.toSet());
    }

    public UserResponseDto getUserByEmail(EmailDto emailDto) {
        UserEntity user = getByEmail(emailDto.getEmail());

        return userMapper
                .toDto(user)
                .setRoles(userRoleSkillsToDto(
                        user.getId(),
                        user.getUserRoleSkillEntitySet()
                ));
    }

    public List<UserResultsByInterviewsResponseDto> getUserInterviewsResults(Long userId) {
        findById(userId);
        List<UserResultsByInterviewsResponseDto> userInterviewResults = new ArrayList<>();

        List<InterviewEntity> interviews = interviewRepository.findBySearcherId(userId);

        return getUserResultsByInterviewsResponseDtos(userId, interviews, userInterviewResults);
    }

    public List<UserResultsByInterviewsResponseDto> getUserInterviewsResultsByPeriod(Long userId, LocalDate fromDate, LocalDate toDate) {
        findById(userId);

        List<InterviewEntity> interviews = interviewRepository.findBySearcherIdAndEndDateTimeBetween(userId, fromDate.atStartOfDay(), toDate.atStartOfDay());

        List<UserResultsByInterviewsResponseDto> userInterviewResults = new ArrayList<>();

        return getUserResultsByInterviewsResponseDtos(userId, interviews, userInterviewResults);
    }

    public List<UserResultsByInterviewsResponseDto> getUserResultsByInterviewsResponseDtos(Long userId, List<InterviewEntity> interviews, List<UserResultsByInterviewsResponseDto> userInterviewResults) {
        for (InterviewEntity interview : interviews) {
            UserResultsByInterviewsResponseDto userInterviewDto = new UserResultsByInterviewsResponseDto();
            userInterviewDto.setInterviewId(interview.getId());
            userInterviewDto.setUserId(userId);
            userInterviewDto.setInterviewDateTime(interview.getEndDateTime());

            List<InterviewQuestionEntity> interviewQuestions = interviewQuestionRepository.findByInterviewId(interview.getId());

            List<SkillResultDto> skillResults = new ArrayList<>();

            Map<Long, List<Integer>> skillGrades = new HashMap<>();
            for (InterviewQuestionEntity question : interviewQuestions) {
                skillGrades.computeIfAbsent(question.getSkill().getId(), k -> new ArrayList<>()).add(question.getGrade());
            }

            for (Map.Entry<Long, List<Integer>> entry : skillGrades.entrySet()) {
                Long skillId = entry.getKey();
                double averageGrade = entry.getValue().stream().mapToInt(Integer::intValue).average().orElse(0.0);
                SkillResultDto skillResult = new SkillResultDto();
                skillResult.setSkillName(skillRepository.findById(skillId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found by id: " + skillId)).getName());
                skillResult.setAverageGrade(averageGrade);
                skillResults.add(skillResult);
            }

            userInterviewDto.setSkillResults(skillResults);

            userInterviewResults.add(userInterviewDto);
        }
        return userInterviewResults;
    }

    public List<UserSearchResponseDto> findSearcherIdBySkillsAndGrades(List<SearchSkillGradeDto> skillGradesList) {
        Map<String, Integer> skillGrades = skillGradesList.stream()
                .collect(Collectors.toMap(SearchSkillGradeDto::getSkill, SearchSkillGradeDto::getGrade));
        Map<Long, Integer> searcherIdsCount = new HashMap<>();
        Map<Long, Long> searcherIdAndSumGrade = new HashMap<>();
        Map<Long, Map<String, Integer>> searcherIdAndSkillGrade = new HashMap<>();
        for (Map.Entry<String, Integer> entry : skillGrades.entrySet()) {
            List<Object[]> searcherIdsAndGrade = repository.findSearcherIdsAndMaxGradeBySkillNameAndSkillGrade(entry.getKey(), entry.getValue());
            for (Object[] result : searcherIdsAndGrade) {
                Long searcherId = (Long) result[0];
                Integer maxGrade = (Integer) result[1];
                searcherIdsCount.put(searcherId, searcherIdsCount.getOrDefault(searcherId, 0) + 1);
                searcherIdAndSumGrade.put(searcherId, searcherIdAndSumGrade.getOrDefault(searcherId, 0L) + maxGrade);

                Map<String, Integer> skillGradeMap = searcherIdAndSkillGrade.getOrDefault(searcherId, new HashMap<>());
                skillGradeMap.put(entry.getKey(), maxGrade);
                searcherIdAndSkillGrade.put(searcherId, skillGradeMap);
            }
        }

        Map<Long, Long> sortedSearcherIdAndSumGrade = searcherIdAndSumGrade.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
                        (oldValue, newValue) -> oldValue, LinkedHashMap::new));

        List<UserEntity> users = new ArrayList<>();
        for (Long key : sortedSearcherIdAndSumGrade.keySet()) {
            if (searcherIdsCount.containsKey(key) && searcherIdsCount.get(key) == skillGrades.size()) {
                repository.findById(key).ifPresent(users::add);
            }
        }

        List<UserSearchResponseDto> userSearchResponseDto = new ArrayList<>();
        for (UserEntity userEntity : users) {
            UserSearchResponseDto userDto = userMapper.toSearchResponseDto(userEntity);
            userDto.setSkillGrades(searcherIdAndSkillGrade.get(userEntity.getId()));
            userSearchResponseDto.add(userDto);
        }

        return userSearchResponseDto;
    }

    public List<UserSearchResponseDto> findAllCandidates() {
        // 1. Отримати всі сутності користувачів з репозиторію
        List<UserEntity> allUsers = repository.findAll();

        // 2. Перетворити кожну сутність UserEntity на UserSearchResponseDto
        // (Примітка: Інформація про оцінки навичок тут буде втрачена,
        // оскільки цей метод не займається її пошуком)
        List<UserSearchResponseDto> userSearchResponseDto = allUsers.stream()
                .map(userMapper::toSearchResponseDto)
                .collect(Collectors.toList());

        return userSearchResponseDto;
    }

    public List<UserStatisticsPeriodDto> getUserStatisticsByPeriod(Long userId, LocalDate fromDate, LocalDate toDate) {
        findById(userId);
        List<InterviewEntity> interviewEntityList = interviewRepository.findBySearcherIdAndEndDateTimeBetween(userId, fromDate.atStartOfDay(), toDate.atStartOfDay());
        return calculateUserStatisticsPeriod(interviewEntityList);
    }

    public List<UserStatisticsPeriodDto> calculateUserStatisticsPeriod(List<InterviewEntity> interviewEntityList) {
        List<UserStatisticsPeriodDto> userStatisticsList = new ArrayList<>();
        for (InterviewEntity interview : interviewEntityList) {
            Map<Long, List<Integer>> skillGradeMap = new HashMap<>();
            Map<Long, List<QuestionGradeDto>> skillQuestioGradeMap = new HashMap<>();
            Map<Long, Integer> questionCountMap = new HashMap<>();
            for (InterviewQuestionEntity question : interview.getQuestions()) {
                Long skillId = question.getSkill().getId();
                Integer grade = question.getGrade();
                skillGradeMap.computeIfAbsent(skillId, k -> new ArrayList<>()).add(grade);
                skillQuestioGradeMap.computeIfAbsent(skillId, k -> new ArrayList<>()).add(new QuestionGradeDto(
                        question.getQuestion(), question.getGrade()));
                questionCountMap.put(skillId, questionCountMap.getOrDefault(skillId, 0) + 1);
            }
            for (Map.Entry<Long, List<Integer>> entry : skillGradeMap.entrySet()) {
                Long skillId = entry.getKey();
                List<Integer> grades = entry.getValue();
                int totalGrade = grades.stream().mapToInt(Integer::intValue).sum();
                Integer questionCount = questionCountMap.get(skillId);
                Double averageGrade = questionCount > 0 ? (double) totalGrade / questionCount : 0.0;
                String skillName = skillRepository.findById(skillId).orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found by id: " + skillId)).getName();
                UserStatisticsPeriodDto userStatistics = UserStatisticsPeriodDto.builder()
                        .skillName(skillName)
                        .grade(averageGrade)
                        .date(interview.getEndDateTime())
                        .questions(skillQuestioGradeMap.get(skillId))
                        .build();
                userStatisticsList.add(userStatistics);
            }
        }
        return userStatisticsList;
    }

    public void setPasswordForUserById(String password,
                                       long id) {
        repository.setPasswordForUserById(password, id);
    }

    public UserByIdDto getById(long id) {
        UserEntity user = findById(id);
        List<ShortInterviewDto> searcherCompleted = interviewRepository
                .findAllBySearcherIdAndStatus(user.getId(), InterviewStatus.COMPLETED)
                .stream()
                .map(interviewMapper::toShortDto)
                .toList();

        return userMapper.toByIdDto(user)
                .setRoles(userRoleSkillsToDto(
                        user.getId(),
                        user.getUserRoleSkillEntitySet()))
                .setCompletedInterviews(searcherCompleted);
    }

    public boolean changePassword(AuthDetails authDetails,
                                  UserChangePasswordDto dto) {
        boolean isRepeatPasswordNotCorrect = !Objects.equals(dto.getNewPassword(), dto.getRepeatNewPassword());
        boolean isPasswordNotCorrect = !passwordEncoder.matches(dto.getPassword(), authDetails.getPassword());
        if (isRepeatPasswordNotCorrect || isPasswordNotCorrect) {
            return false;
        }

        setPasswordForUserById(
                passwordEncoder.encode(dto.getNewPassword()),
                authDetails.getUserEntity().getId());

        return true;
    }

    @Transactional
    public boolean deleteMe(Long userId) {
//        repository.nullifyInterviewerId(userId);
//        userRepository.nullifySearcherId(userId);
//        repository.deleteInterviewerQuestion(userId);
        repository.deleteRefreshTokens(userId);
        repository.deleteUserRoleSkills(userId);
        repository.deleteUserById(userId);
        return true;
    }

    public UserSearchResponseDto findCandidatesByFullName(String lastname) {
        UserEntity user = repository.findByLastnameContainingIgnoreCase(lastname)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return userMapper.toSearchResponseDto(user);
    }

//    public UserSearchResponseDto findCandidatesByFullName(String lastname) {
//        // 1. Знайти користувача за прізвищем
//        UserEntity user = repository.findByLastnameContainingIgnoreCase(lastname)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Кандидат не знайдений"));
//
//        // 2. Зібрати оцінки навичок для цього користувача
//        Long userId = user.getId();
//        Map<String, Integer> skillGradesMap = getSkillGradesForUser(userId);
//
//        // 3. Перетворити сутність на DTO
//        UserSearchResponseDto userDto = userMapper.toSearchResponseDto(user);
//
//        // 4. ✅ Збагатити DTO оцінками
//        userDto.setSkillGrades(skillGradesMap);
//
//        return userDto;
//    }

    /**
     * Допоміжний метод для отримання оцінок навичок і перетворення їх на Map.
     */
    private Map<String, Integer> getSkillGradesForUser(Long userId) {
        // Викликаємо метод репозиторію, який повертає (SkillName, Grade)
        List<Object[]> skillGradeObjects = repository.findSkillGradesByUserId(userId);

        Map<String, Integer> skillGradesMap = new HashMap<>();
        for (Object[] result : skillGradeObjects) {
            String skillName = (String) result[0];
            // Припускаємо, що grade — це Integer або можна легко привести
            Integer grade = 70;//todo
            skillGradesMap.put(skillName, grade);
        }
        return skillGradesMap;
    }

    public UserSearchResponseDto findCandidatesByEmail(String email) {
        UserEntity user = repository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return userMapper.toSearchResponseDto(user);
    }
}
