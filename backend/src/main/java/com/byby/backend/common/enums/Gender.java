package com.byby.backend.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Gender {
    MALE("남"),
    FEMALE("여"),
    OTHER("기타");

    private final String label;
}
