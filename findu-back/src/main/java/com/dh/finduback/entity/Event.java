package com.dh.finduback.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "events")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_type_id", referencedColumnName = "id")
    private EventType eventType;

    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private Integer ticketsEnabledPerDay;
    private Double pricePerTicket;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<AvailableTicketsPerDay> availableTicketsPerDays;

    private String image1;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    private Set<AdditionalImage> additionalImages;

    @ManyToOne
    @JoinColumn(name = "country_id", referencedColumnName = "id")
    private Country country;

    private String street;
    private Boolean active;
    private boolean deleted;

    private String policy1Name;
    @Column(columnDefinition = "TEXT")
    private String policy1Description;
    private String policy2Name;
    @Column(columnDefinition = "TEXT")
    private String policy2Description;
    private String policy3Name;
    @Column(columnDefinition = "TEXT")
    private String policy3Description;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "event_features",
            joinColumns = @JoinColumn(name = "event_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "feature_id", referencedColumnName = "id"),
            foreignKey = @ForeignKey(name = "fk_event_features_event_id"),
            inverseForeignKey = @ForeignKey(name = "fk_event_features_feature_id")
    )
    private List<Feature> features;

    @ManyToMany(mappedBy = "likedEvents")
    private List<User> usersLiked;
}
