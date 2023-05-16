import {EcoSpot} from "../../schemas/ecospot.schema";

/**
 * DTO corresponding to data required and used to update a client
 * Every param is optional
 */
export class UpdateClientDto {
    full_name?: string;
    pseudo?: string;
    firebaseId: string;
    isAdmin?: boolean;
    fav_articles?: string[];
    created_publications?: string[];
    fav_ecospots?: EcoSpot[];
    created_ecospots?: EcoSpot[];
    profile_pic_url?: String;
}
