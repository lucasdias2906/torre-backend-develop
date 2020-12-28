import moment from 'moment';
const vFormatoData = 'YYYY-MM-DD';

function converterData(pData) {
    const vDataSaida = moment(pData).format(vFormatoData);
    const vDataValida = moment(pData, vFormatoData, true).isValid();
    return { data: vDataSaida, valida: vDataValida };
}

const functions = {
    converterData: pData => {
        return converterData(pData);
    },
};

export default functions;
