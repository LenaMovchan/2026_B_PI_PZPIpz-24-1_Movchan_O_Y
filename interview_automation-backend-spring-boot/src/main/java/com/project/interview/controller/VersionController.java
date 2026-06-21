package com.project.interview.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "${rest.prefix}")
public class VersionController {

    @Value("${project.version}")
    private String projectVersion;

    @GetMapping("/version")
    public String getVersion() {
        return projectVersion;
    }

}
