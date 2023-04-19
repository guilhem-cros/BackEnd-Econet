import * as admin from 'firebase-admin';

export async function setUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
    try {
        // Définition du custom claim 'role' pour l'utilisateur spécifié
        await admin.auth().setCustomUserClaims(uid, { role });

        // Les modifications des custom claims sont stockées dans le jeton ID JWT et prennent
        // effet lors de la prochaine émission du jeton pour l'utilisateur
        console.log(`Custom claim 'role' set to '${role}' for user with UID '${uid}'.`);
    } catch (error) {
        console.error('Error setting custom user claims:', error);
        throw new Error('Failed to set custom user claims');
    }
}
