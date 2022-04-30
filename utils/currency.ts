export const format = (value: number) => {

    
    
    //CHILE
    // const formatter = new Intl.NumberFormat('es-CLP', {
    //     style: 'currency',
    //     currency: 'CLP',
    //     minimumFractionDigits: 0,
    //     maximumFractionDigits: 0,
    // }); 

    //crea formateador de moneda
    //US-USD
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formatter.format(value);
}