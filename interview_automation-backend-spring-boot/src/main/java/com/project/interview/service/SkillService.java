package com.project.interview.service;

import com.project.interview.dtos.SkillDto;
import com.project.interview.dtos.SkillTreeDto;
import com.project.interview.dtos.SkillWithIdDto;
import com.project.interview.dtos.UserSkillAddDto;
import com.project.interview.entity.SkillEntity;
import com.project.interview.entity.UserEntity;
import com.project.interview.mapper.SkillMapper;
import com.project.interview.repository.SkillRepository;
import com.project.interview.repository.UserRoleSkillRepository;
import com.project.interview.security.oauth2.model.AuthDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {
    private final SkillRepository skillRepository;
    private final UserRoleSkillRepository userRoleSkillRepository;
    private final SkillMapper skillMapper;

    public void addUserSkills(AuthDetails authDetails, UserSkillAddDto skillDto, Long roleId) {
        UserEntity user = authDetails.getUserEntity();
        userRoleSkillRepository.deleteByUserIdAndRoleId(user.getId(), roleId);
        skillDto.getSkillIds().forEach(skillId -> skillRepository.addSkillToUser(user.getId(), roleId, skillId));
    }

    @Cacheable("roleSkills")
    public List<SkillTreeDto> getSkillsByRoleId(Long roleId) {
        return roleId == 1 ? getSkillTree(0L) : getTopLevelSkills(0L);
    }

    public List<SkillTreeDto> getSkillTree(Long rootId) {
        List<SkillEntity> skillTree = skillRepository.getSkillTree(rootId);
        Map<Long, List<SkillEntity>> skillMap = skillTree.stream().collect(Collectors.groupingBy(SkillEntity::getParentId));
        return createSkillTree(skillMap, rootId);
    }

    public List<SkillTreeDto> createSkillTree(Map<Long, List<SkillEntity>> skillMap, Long rootId) {
        List<SkillTreeDto> list = new ArrayList<>();
        List<SkillEntity> skills = skillMap.get(rootId);
        if (skills == null) {
            return list;
        }
        skills.forEach(skill -> {
            SkillTreeDto skillTreeDTO = new SkillTreeDto();
            skillTreeDTO.setId(skill.getId());
            skillTreeDTO.setName(skill.getName());
            skillTreeDTO.setChildren(createSkillTree(skillMap, skill.getId()));
            list.add(skillTreeDTO);
        });
        return list;
    }

    public List<SkillTreeDto> getTopLevelSkills(Long id) {
        List<SkillEntity> skillTree = skillRepository.getSkillTree(id);
        List<SkillEntity> topLevelSkills = findTopLevelSkills(skillTree);
        Map<Long, List<SkillEntity>> skillMap = topLevelSkills.stream().collect(Collectors.groupingBy(SkillEntity::getParentId));
        return createSkillTree(skillMap, id);
    }

    private List<SkillEntity> findTopLevelSkills(List<SkillEntity> skillTree) {
        Set<Long> parentIds = skillTree.stream().map(SkillEntity::getParentId).collect(Collectors.toSet());
        List<SkillEntity> topLevelSkills = new ArrayList<>();

        for (SkillEntity skill : skillTree) {
            if (parentIds.contains(skill.getId())) {
                topLevelSkills.add(skill);
            }
        }
        return topLevelSkills;
    }

    /**
     * Method create a skill tree for the user with specified role
     *
     * @param userId user which skills are to be fetched
     * @param roleId role of user for which skills are fetched
     * @return skill tree for the user
     */
    public List<SkillTreeDto> getUserSkillsTree(Long userId, Long roleId) {
        Set<Long> skillIds = skillRepository.getUserSkills(userId, roleId);
        List<SkillTreeDto> skillTree = (roleId == 1 ? getSkillTree(0L) : getTopLevelSkills(0L));
        List<SkillTreeDto> userSkillTree = new ArrayList<>();
        for (SkillTreeDto s : skillTree) {
            SkillTreeDto skill = filterSkillTree(s, skillIds);
            if (skill != null) {
                userSkillTree.add(skill);
            }
        }
        return userSkillTree;
    }

    private SkillTreeDto filterSkillTree(SkillTreeDto root, Set<Long> userSkillIds) {
        if (root == null) {
            return null;
        }
        SkillTreeDto skill = new SkillTreeDto(root.getId(), root.getName(), new ArrayList<>());
        for (SkillTreeDto childNode : root.getChildren()) {
            SkillTreeDto filteredChildNode = filterSkillTree(childNode, userSkillIds);
            // Add childNode if it has children, or it is in the userSkillIds
            if (filteredChildNode != null) {
                skill.getChildren().add(filteredChildNode);
            }
            if (userSkillIds.contains(childNode.getId())) {
                skill.getChildren().add(childNode);
            }
        }
        return skill.getChildren().isEmpty() ? null : skill;
    }

    public List<String> getAllSkillsByUserId(Long userId) {
        List<String> skillDtoList = new ArrayList<>();
        List<SkillTreeDto> skillTreeDtoList = getUserSkillsTree(userId, 1L);
        for (SkillTreeDto skillTreeDto : skillTreeDtoList) {
            addLastLevelSkillNames(skillTreeDto, skillDtoList);
        }
        return skillDtoList;
    }

    private void addLastLevelSkillNames(SkillTreeDto skillTreeDto, List<String> skillDtoList) {
        if (skillTreeDto.getChildren().isEmpty()) {
            skillDtoList.add(skillTreeDto.getName());
        } else {
            for (SkillTreeDto subSkill : skillTreeDto.getChildren()) {
                addLastLevelSkillNames(subSkill, skillDtoList);
            }
        }
    }

    @Cacheable("lastLevelSkills")
    public List<SkillDto> getLastLevelSkills() {
        List<SkillEntity> skillEntities = skillRepository.findAll();

        Set<Long> parentIds = skillEntities
                .stream()
                .map(SkillEntity::getParentId)
                .collect(Collectors.toSet());

        return skillEntities
                .stream()
                .filter(s -> !parentIds.contains(s.getId()))
                .map(skillMapper::toDto)
                .toList();
    }

    public List<SkillWithIdDto> getAllSkillsByUserIdAndRoleId(Long userId, Long roleId) {
        List<SkillWithIdDto> skillDtoList = new ArrayList<>();
        List<SkillTreeDto> skillTreeDtoList = getUserSkillsTree(userId, roleId);
        for (SkillTreeDto skillTreeDto : skillTreeDtoList) {
            addLastLevelSkillNamesWithId(skillTreeDto, skillDtoList);
        }
        return skillDtoList;
    }

    public void addLastLevelSkillNamesWithId(SkillTreeDto skillTreeDto, List<SkillWithIdDto> skillDtoList) {
        if (skillTreeDto.getChildren().isEmpty()) {
            SkillWithIdDto skillWithIdDto = new SkillWithIdDto();
            skillWithIdDto.setId(skillTreeDto.getId());
            skillWithIdDto.setName(skillTreeDto.getName());
            skillDtoList.add(skillWithIdDto);
        } else {
            for (SkillTreeDto subSkill : skillTreeDto.getChildren()) {
                addLastLevelSkillNamesWithId(subSkill, skillDtoList);
            }
        }
    }

    public boolean deleteSkill(Long userId, Long roleId, Long skillId) {

//        List<String> userRoleSkills = getAllSkillsByUserIdAndRoleId(userId, roleId);
        Set<Long> getUserRoleSkills = skillRepository.getUserSkills(userId, roleId);
        Long findSkillId = getUserRoleSkills.stream()
                .filter(s -> s.equals(skillId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found with Id: " + skillId));

//        List<Skill> userRoleSkills = skillRepository.findSkillsByUserIdAndRoleId(userId, roleId);

        userRoleSkillRepository.deleteByUserIdAndRoleIdAndSkillId(userId, roleId, findSkillId);
        return true;


    }

}
