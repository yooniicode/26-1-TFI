package com.byby.backend.common.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum VisaType {
    E9("E-9"),      // 비전문취업
    E6("E-6"),      // 예술흥행
    F1("F-1"),      // 방문동거
    F2("F-2"),      // 거주
    F4("F-4"),      // 재외동포
    F5("F-5"),      // 영주
    F6("F-6"),      // 결혼이민
    H2("H-2"),      // 방문취업
    D2("D-2"),      // 유학
    U("U"),         // 미등록(서류 없음)
    OTHER("기타");

    private final String label;
}
