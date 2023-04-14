export class CreateEcoSpotDto {
    name: string;
    address: string;
    details: string;
    tips: string;
    picture: Buffer;
    main_type: {
        id: string;
        name: string;
        color: string;
        //logo: Buffer;
        description: string;
    };
    other_types: string[];
    isPublished: boolean;
}
