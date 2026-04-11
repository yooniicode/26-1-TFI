package com.byby.backend.domain.consultation.repository;

import com.byby.backend.domain.consultation.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
}
