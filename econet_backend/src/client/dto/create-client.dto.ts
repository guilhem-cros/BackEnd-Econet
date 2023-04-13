import {EcoSpot} from "../../schemas/ecospot.schema";

export class CreateClientDto {
    full_name: string;
    pseudo: string;
    email: string;
    firebaseId: string;
    isAdmin = false;
    fav_articles: string[] = [];
    wrote_articles: string[] = [];
    fav_ecospots: EcoSpot[] = [];
    created_ecospots: EcoSpot[] = [];
    //profile_pic: Buffer; //TODO: gestion des images


}
