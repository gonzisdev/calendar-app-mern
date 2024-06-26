import Evento from "../models/Evento.js"

export class EventsController {

    static getEventos = async (req, res) => {

        const eventos = await Evento.find().populate('user', 'name')

        res.json({
            ok: true,
            eventos
        })
    }
    
    static crearEvento = async (req, res) => {

        const evento = new Evento(req.body)
        try {
            evento.user = req.uid
            const eventoGuardado = await evento.save()
            res.json( {
                ok: true,
                evento: eventoGuardado
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }
    }

    static actualizarEvento = async (req, res) => {

        const eventoId = req.params.id
        const uid = req.uid
        try {
            const evento = await Evento.findById(eventoId)
            if (!evento) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un evento con ese ID'
                })
            }
            if (evento.user.toString() !== uid) {
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegios de edición'
                })
            }
            const nuevoEvento = {
                ...req.body,
                user: uid
            }
            const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true})
            res.json({
                ok: true,
                evento: eventoActualizado
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }
    }

    static eliminarEvento = async (req, res) => {
        const eventoId = req.params.id
        const uid = req.uid
        try {
            const evento = await Evento.findById(eventoId)
            if (!evento) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un evento con ese ID'
                })
            }
            if (evento.user.toString() !== uid) {
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegios de eliminación'
                })
            }

            await Evento.findByIdAndDelete(eventoId)
            res.json({
                ok: true
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            })
        }
    }
}