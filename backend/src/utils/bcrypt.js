import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
    password,
    hashedPassword
) => {
    return await bcrypt.compare(
        password,
        hashedPassword
    );
};

// usage

// const hashed = await hashPassword(password);

// const ok = await comparePassword(
//     password,
//     user.password
// );