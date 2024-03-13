export const formatDateHour = (paramDate: string) => {
    const date = new Date(paramDate);
    const separator = paramDate.split('T');
    
    const hourDate = separator[1].split(':');
    const hour = hourDate[0];
    const minutesDate = hourDate[1];

    const yearDate = date.getFullYear();
    const monthDate = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayDate = date.getDate().toString().padStart(2, '0');

    const dateString = `${dayDate}-${monthDate}-${yearDate} ${hour}:${minutesDate}`
    return dateString;
}

const opciones: object = { year: 'numeric', month: 'long', day: '2-digit' };

export const formatDateLocaleString = (paramDate: string) => {
    let fecha = new Date(paramDate);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones).replace(/\//g, '-');
    return fechaFormateada.toLocaleUpperCase();
}


export const getYearNow = () => {
    let fecha = new Date();
    return fecha.getFullYear();
}

export const getHourEvent = (paramDate: string) => {
    const separator = paramDate.split('T');
    
    const hourDate = separator[1].split(':');
    const hour = hourDate[0];
    const minutesDate = hourDate[1];
    const hourString = `${hour}:${minutesDate}`
    return hourString;
}


export const getDateNow = () => {
    const date = new Date();
    const yearDate = date.getFullYear();
    const monthDate = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayDate = date.getDate().toString().padStart(2, '0');

    const dateString = `${dayDate}-${monthDate}-${yearDate}`
    return dateString;
}