import admin from 'firebase-admin';

/**
 * Function adding a custom claim called 'role' to the JWT token of the client
 * @param uid firebase id of the client
 * @param role admin or user, concrete role of the client used to check authorization on some requests
 */
export async function setUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
    try {
        // Defining custom claim 'role' for the specified user
        await admin.auth().setCustomUserClaims(uid, { role });

        // Modifications of the custom claims are stored in the JWT token
        console.log(`Custom claim 'role' set to '${role}' for user with UID '${uid}'.`);
    } catch (error) {
        console.error('Error setting custom user claims:', error);
        throw new Error('Failed to set custom user claims');
    }
}
