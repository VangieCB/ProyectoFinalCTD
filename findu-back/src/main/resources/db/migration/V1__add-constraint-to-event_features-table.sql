USE `findu`;

ALTER TABLE `findu`.`event_features`
    DROP FOREIGN KEY `fk_event_features_feature_id`;
ALTER TABLE `findu`.`event_features`
    ADD CONSTRAINT `fk_event_features_feature_id`
        FOREIGN KEY (`feature_id`)
            REFERENCES `findu`.`features` (`id`)
            ON DELETE CASCADE;
