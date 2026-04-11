package com.byby.backend.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ConsultationMethod {
    VISIT("출장/동행"),
    PHONE("전화"),
    VIDEO("영상"),
    OTHER("기타");

    private final String label;
}
