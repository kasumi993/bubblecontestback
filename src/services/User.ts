const PocketBase = require('pocketbase/cjs')
const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);

export const authenticateUser = async ({email, password}: {email: string, password: string}) => {
    return pb.collection('users').authWithPassword(
        email,
        password,
    );
    
}

export const createUser = async  ({email, password, name}: {email: string, password: string, name: string}) => {
    const data = {
        email,
        password,
        passwordConfirm: password,
        canRead: true,
        canEdit: false,
        isPremium: false,
        name
    }
    const record = await pb.collection('users').create(data);
    return record;
}

export const getUserById = async (userId: string) => {
    return pb.collection('users').getOne(userId);
}

export const logoutUser = async () => {
    pb.authStore.clear();
    return pb.authStore;
}

export const deleteUser = async (userId: string) => {
    return pb.collection('users').delete(userId);
}