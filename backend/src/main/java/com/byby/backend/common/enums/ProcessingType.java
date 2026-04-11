package com.byby.backend.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProcessingType {
    INTERPRETATION("통역"),
    TRANSLATION("번역"),
    COUNSELING("상담"),
    OTHER("기타");

    private final String label;
}
