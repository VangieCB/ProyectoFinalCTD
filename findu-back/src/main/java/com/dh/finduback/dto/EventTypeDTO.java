package com.dh.finduback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventTypeDTO {
    private Long id;
    private String name;
    private String description;
    private String image1;
}
