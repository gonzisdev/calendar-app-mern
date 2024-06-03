import Usuario from "../models/Usuario.js"
import bcrypt from "bcrypt"
import { generateJWT } from "../helpers/jwt.js"

export class AuthController {
    
    static crearUsuario = async (req, res) => {

        const { email, password } = req.body
        try {
            let usuario = await Usuario.findOne({email})
            if (usuario) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con el mismo email'
                })
            }
            
            usuario = new Usuario(req.body)
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(password, salt)
            const token = generateJWT({uid: usuario.id, name: usuario.name})

            await usuario.save()
    
            res.status(201).json({
                ok: true,
                uid: usuario.id,
                name: usuario.name,
                token
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Por favor, hable con el administrador'
            })
        }
    }

    static loginUsuario = async (req, res) => {

        const { email, password } = req.body

        try {
            let usuario = await Usuario.findOne({email})
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario no existe'
                })
            }

            const validPassword = await bcrypt.compare(password, usuario.password)
            if (!validPassword) {
                return res.status(401).json({
                    ok: false,
                    msg: 'La contraseña no es correcta'
                })
            }
            const token = generateJWT({uid: usuario.id, name: usuario.name})


            res.status(201).json({
                ok: true,
                uid: usuario.id,
                name: usuario.name,
                token
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Por favor, hable con el administrador'
            })
        }
    }

    static revalidarToken = async (req, res) => {

        const uid = req.uid
        const name = req.name
        const token = generateJWT({uid, name})


        res.json({
            ok: true,
            uid,
            name,
            token
        })
    }
}