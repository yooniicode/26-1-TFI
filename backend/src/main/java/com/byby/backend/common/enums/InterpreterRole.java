package com.byby.backend.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum InterpreterRole {
    ACTIVIST("통번역활동가"),
    FREELANCER("프리랜서"),
    STAFF("센터직원");

    private final String label;
}
