import { Router } from "express"
import { body } from "express-validator"
import { EventsController } from "../controllers/EventsController.js"
import { handleInputErrors } from "../middlewares/validation.js"
import { validateJWT } from "../middlewares/validate-jwt.js"
import { isDate } from "../helpers/isDate.js"

const router = Router()

router.use(validateJWT)

router.get('/', EventsController.getEventos)

router.post('/',
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('start').custom(isDate).withMessage('La fecha de inicio es obligatoria'),
    body('end').custom(isDate).withMessage('La fecha de fin es obligatoria'),
    handleInputErrors,
    EventsController.crearEvento
)

router.put('/:id',
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('start').custom(isDate).withMessage('La fecha de inicio es obligatoria'),
    body('end').custom(isDate).withMessage('La fecha de fin es obligatoria'),
    handleInputErrors,
    EventsController.actualizarEvento
)

router.delete('/:id', EventsController.eliminarEvento)

export default router