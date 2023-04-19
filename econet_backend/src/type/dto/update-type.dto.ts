/**
 * DTO corresponding to data required and used to update a type of ecospot
 * Every param is optional
 */
export class UpdateTypeDto {
    name?: string;
    color?: string;
    description?: string;
    logo_url?: string;
    associated_spots?: string[];
}
