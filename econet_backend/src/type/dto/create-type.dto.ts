export class CreateTypeDto {
    name: string;
    color: string;
    description: string;
    logo: Buffer;
    associated_spots: string[];
}
