import jwt from "jsonwebtoken"

export const validateJWT = (req, res, next) => {
    const token = req.header("x-token")

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "No hay token en la petición"
        })
    }
    try {
        const { uid, name }= jwt.verify(token, process.env.JWT_SECRET)
        req.uid = uid
        req.name = name
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token no válido"
        })
    }
    next()
}