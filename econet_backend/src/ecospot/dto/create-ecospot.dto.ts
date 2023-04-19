/**
 * DTO corresponding to data required and used to create an ecospot
 * Some param are not required
 */
export class CreateEcoSpotDto {
    name: string;
    address: string;
    details: string;
    tips: string;
    main_type_id: string;
    other_types?: string[];
    isPublished?: boolean;
    picture_url: string;
}
