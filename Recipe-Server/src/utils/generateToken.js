import jwt from "jsonwebtoken";

const generateToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
    return token;
};

export default generateToken;
