package com.project.interview.service;

import com.project.interview.dtos.RoleDto;
import com.project.interview.entity.UserRoleEntity;
import com.project.interview.mapper.RoleMapper;
import com.project.interview.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public Set<RoleDto> getAllRoles() {
        return roleRepository
                .findAll()
                .stream()
                .map(roleMapper::toDto)
                .collect(Collectors.toSet());
    }

    public UserRoleEntity findById(long id) {
        return roleRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role table invalid!"));
    }
}
