package com.byby.backend.domain.patient.entity;

import com.byby.backend.common.entity.BaseEntity;
import com.byby.backend.common.enums.Gender;
import com.byby.backend.common.enums.Nationality;
import com.byby.backend.common.enums.VisaType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "patient")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Patient extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private Nationality nationality;

    @Column(nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private VisaType visaType;

    @Column(columnDefinition = "TEXT")
    private String visaNote; // OTHER일 때 직접 입력

    private LocalDate birthDate;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String region; // 거주지 (구 단위)

    @Column(length = 200)
    private String workplaceName;

    @Builder
    public Patient(String name, Nationality nationality, Gender gender,
                   VisaType visaType, String visaNote, LocalDate birthDate,
                   String phone, String region, String workplaceName) {
        this.name = name;
        this.nationality = nationality;
        this.gender = gender;
        this.visaType = visaType;
        this.visaNote = visaNote;
        this.birthDate = birthDate;
        this.phone = phone;
        this.region = region;
        this.workplaceName = workplaceName;
    }

    public void updateInfo(String phone, String region, String workplaceName) {
        this.phone = phone;
        this.region = region;
        this.workplaceName = workplaceName;
    }
}
