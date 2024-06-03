import mongoose, { Schema, Types } from "mongoose"

const eventoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: "Usuario"
    }
})

eventoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
})

const Evento = mongoose.model('Evento', eventoSchema)

export default Evento