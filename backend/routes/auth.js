import { Router } from "express"
import { body } from "express-validator"
import { AuthController } from "../controllers/authController.js"
import { handleInputErrors } from "../middlewares/validation.js"
import { validateJWT } from "../middlewares/validate-jwt.js"

const router = Router()

router.post("/new", 
	body('name').notEmpty().withMessage('El nombre no puede estar vacío'),
	body('email').notEmpty().withMessage('El email no puede estar vacío'),
	body('email').isEmail().withMessage('Email no válido'),
	body('password').isLength({min: 6}).withMessage('La contraseña debe contener mínimo 6 caracteres'),
	handleInputErrors,
	AuthController.crearUsuario)

router.post("/", 
	body('email').notEmpty().withMessage('El email no puede estar vacío'),
	body('email').isEmail().withMessage('Email no válido'),
	body('password').isLength({min: 6}).withMessage('La contraseña debe contener mínimo 6 caracteres'),
	handleInputErrors,
	AuthController.loginUsuario)

router.get("/renew", 
	validateJWT, 
	AuthController.revalidarToken)

export default router