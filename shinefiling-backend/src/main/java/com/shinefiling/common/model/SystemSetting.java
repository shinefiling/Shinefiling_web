package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "system_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemSetting {

    @Id
    private String settingKey;

    @Column(columnDefinition = "TEXT")
    private String settingValue;

    private String description;
}
