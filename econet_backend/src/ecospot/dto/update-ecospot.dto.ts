/**
 * DTO corresponding to data required and used to update an ecospot
 * Every param is optional
 */
export class UpdateEcoSpotDto {
    name?: string;
    address?: string;
    details?: string;
    tips?: string;
    picture_url?: string;
    main_type_id?: string;
    other_types?: string[];
    isPublished?: boolean;
}
