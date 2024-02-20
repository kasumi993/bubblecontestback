export const authenticateUser = async ({email, password, pb}: {email: string, password: string, pb: { collection: any }}) => {
    return pb.collection('users').authWithPassword(
        email,
        password,
    );
    
}

export const createUser = async  ({email, password, name, pb}: {email: string, password: string, name: string, pb: { collection: any }}) => {
    const data = {
        email,
        password,
        passwordConfirm: password,
        name
    }
    const record = await pb.collection('users').create(data);
    return record;
}