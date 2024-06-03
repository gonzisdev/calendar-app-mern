import { addHours, differenceInSeconds } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import Modal from "react-modal"
import DatePicker, {registerLocale} from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { es } from 'date-fns/locale/es'
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"
import { useUiStore } from "../../hooks/useUiStore"
import { useCalendarStore } from "../../hooks/useCalendarStore"

registerLocale('es', es)

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
}

Modal.setAppElement("#root")

export const CalendarModal = () => {

	const { isDateModalOpen, closeDateModal } = useUiStore()
	const { activeEvent, startSavingEvent } = useCalendarStore()

    const [formSubmitted, setFormSubmitted] = useState(false)
	const [formValues, setFormValues] = useState({
		title: "",
		notes: "",
		start: new Date(),
		end: addHours(new Date(), 2),
	})

    const titleClass = useMemo(() => {
        if (!formSubmitted) return ""
        return (formValues.title.length > 0) ? '' : 'is-invalid'
    } , [formValues.title, formSubmitted])

	useEffect(() => {
		if (activeEvent !== null) {
			setFormValues({...activeEvent})
		}
	}, [activeEvent])

	const onInputChange = (e) => {
		setFormValues({
			...formValues,
			[e.target.name]: e.target.value,
		})
	}

	const onDateChange = (e, changing) => {
		setFormValues({
			...formValues,
			[changing]: e,
		})
	}

	const onCloseModal = () => {
		closeDateModal()
	}

    const onSubmit = async e => {
        e.preventDefault()
        setFormSubmitted(true)
        const difference = differenceInSeconds(formValues.end, formValues.start)
        if (isNaN(difference) || difference <= 0){
            Swal.fire('Fechas incorrectas', 'Revisa las fechas introducidas', 'error')
            return
        }
        if (formValues.title.length <= 0) return
		await startSavingEvent(formValues)
		closeDateModal()
		setFormSubmitted(false)
    }

	return (
		<Modal
			isOpen={isDateModalOpen}
			onRequestClose={onCloseModal}
			style={customStyles}
			className="modal"
			overlayClassName="modal-fondo"
			closeTimeoutMS={200}
		>
			<h1> Nuevo evento </h1>
			<hr />
			<form className="container" onSubmit={onSubmit}>
				<div className="form-group mb-2">
					<label>Fecha y hora de inicio:</label>
					<div className="customDatePickerWidth">
						<DatePicker
                            locale={es}
                            timeCaption="Hora"
							selected={formValues.start}
							className="form-control"
							onChange={(e) => onDateChange(e, "start")}
							dateFormat="Pp"
                            showTimeSelect
						/>
					</div>
				</div>

				<div className="form-group mb-2">
					<label>Fecha y hora de fin:</label>
					<div className="customDatePickerWidth">
						<DatePicker
                            locale={es}
                            timeCaption="Hora"
							minDate={formValues.start}
							selected={formValues.end}
							className="form-control"
							onChange={(e) => onDateChange(e, "end")}
							dateFormat="Pp"
                            showTimeSelect
						/>
					</div>
				</div>

				<hr />
				<div className="form-group mb-2">
					<label>Titulo y notas:</label>
					<input
						type="text"
						className={`form-control ${titleClass}`}
						placeholder="Título del evento"
						name="title"
						autoComplete="off"
						value={formValues.title}
						onChange={onInputChange}
					/>
					<small id="emailHelp" className="form-text text-muted">
						Una descripción corta
					</small>
				</div>

				<div className="form-group mb-2">
					<textarea
						type="text"
						className="form-control"
						placeholder="Notas"
						rows="5"
						name="notes"
						value={formValues.notes}
						onChange={onInputChange}
					></textarea>
					<small id="emailHelp" className="form-text text-muted">
						Información adicional
					</small>
				</div>

				<button type="submit" className="btn btn-outline-primary btn-block">
					<i className="far fa-save"></i>
					<span> Guardar</span>
				</button>
			</form>
		</Modal>
	)
}
