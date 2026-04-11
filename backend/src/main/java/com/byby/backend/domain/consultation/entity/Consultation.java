package com.byby.backend.domain.consultation.entity;

import com.byby.backend.common.entity.BaseEntity;
import com.byby.backend.common.enums.ConsultationMethod;
import com.byby.backend.common.enums.IssueType;
import com.byby.backend.common.enums.ProcessingType;
import com.byby.backend.domain.Interpreter.entity.Interpreter;
import com.byby.backend.domain.hospital.entity.Hospital;
import com.byby.backend.domain.patient.entity.Patient;
import jakarta.persistence.*;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
public class Consultation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private LocalDate consultationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interpreter_id")
    private Interpreter interpreter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Column(length = 100)
    private String department; // 진료과 (건별 기록)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private IssueType issueType;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ConsultationMethod method;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ProcessingType processing;

    @Column(columnDefinition = "TEXT")
    private String memo; // 상담내용메모 (Rm)

    @Column(precision = 4, scale = 1)
    private BigDecimal durationHours; // 통역시간

    private Integer fee; // 통역비 (원)

    private LocalDate nextAppointmentDate; // 다음 예약일정

    // 관리자 확인 영역 (센터장 전용)
    private LocalDate confirmedAt;

    @Column(length = 100)
    private String confirmedBy;

    @Column(length = 20)
    private String confirmedByPhone;

    @Builder
    public Consultation(LocalDate consultationDate, Patient patient, Interpreter interpreter,
                        Hospital hospital, String department, IssueType issueType,
                        ConsultationMethod method, ProcessingType processing, String memo,
                        BigDecimal durationHours, Integer fee, LocalDate nextAppointmentDate) {
        this.consultationDate = consultationDate;
        this.patient = patient;
        this.interpreter = interpreter;
        this.hospital = hospital;
        this.department = department;
        this.issueType = issueType;
        this.method = method;
        this.processing = processing;
        this.memo = memo;
        this.durationHours = durationHours;
        this.fee = fee;
        this.nextAppointmentDate = nextAppointmentDate;
    }

    public void confirm(String confirmedBy, String confirmedByPhone) {
        this.confirmedAt = LocalDate.now();
        this.confirmedBy = confirmedBy;
        this.confirmedByPhone = confirmedByPhone;
    }

    public void updateMemo(String memo) {
        this.memo = memo;
    }

    public void updateNextAppointment(LocalDate nextAppointmentDate) {
        this.nextAppointmentDate = nextAppointmentDate;
    }
}
