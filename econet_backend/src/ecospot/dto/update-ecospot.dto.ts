export class UpdateEcoSpotDto {
    name?: string;
    address?: string;
    details?: string;
    tips?: string;
    picture?: Buffer;
    main_type_id?: string;
    other_types?: string[];
    isPublished?: boolean;
}
