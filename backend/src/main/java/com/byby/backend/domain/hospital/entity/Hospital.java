package com.byby.backend.domain.hospital.entity;

import com.byby.backend.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "hospital")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Hospital extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 20)
    private String phone;

    @Builder
    public Hospital(String name, String address, String phone) {
        this.name = name;
        this.address = address;
        this.phone = phone;
    }
}
