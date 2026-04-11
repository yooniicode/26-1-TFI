package com.byby.backend.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum IssueType {
    MEDICAL("의료"),
    LEGAL("법률"),
    LABOR("노동"),
    IMMIGRATION("출입국"),
    OTHER("기타");

    private final String label;
}

