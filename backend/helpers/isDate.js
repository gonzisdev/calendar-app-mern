import moment from "moment"

export const isDate = (value) => {
    if (!value) return false
    const fecha = moment(value)
    return fecha.isValid() ? true : false  
}