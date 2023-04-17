export class CreateEcoSpotDto {
    name: string;
    address: string;
    details: string;
    tips: string;
    main_type_id: string;
    other_types?: string[];
    isPublished?: boolean;
}
