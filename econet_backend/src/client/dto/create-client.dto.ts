/**
 * DTO corresponding to data required and used to create a client
 */
export class CreateClientDto {
    full_name: string;
    pseudo: string;
    email: string;
    firebaseId: string;
    profile_pic_url?: string;
}
