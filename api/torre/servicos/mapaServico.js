// require('dotenv').config()

import parametrosGeralServico from './parametroGeralServico'

async function calcularPrevisaoDeChegadaApiGoogle(origem, destino) {
  const Client = require('@googlemaps/google-maps-services-js').Client

  const googleMapsApKey = await parametrosGeralServico.obterPorCodigo('monitoramento', 'GOOGLE_MAPS_API_KEY')

  const client = new Client({})

  const directionsResult = await client
    .directions({
      params: {
        origin: origem,
        destination: destino,
        travelMode: 'DRIVING',
        drivingOptions: {
          departureTime: Date.now + 100,
          trafficModel: 'pessimistic', // 'bestguess'
        },
        provideRouteAlternatives: false,
        key: googleMapsApKey,
      },
      timeout: 1000,
    })

  return directionsResult.data.routes[0] ? directionsResult.data.routes[0].legs[0] : null
}

const functions = {
  calcularPrevisaoDeChegadaApiGoogle: (origem, destino) => calcularPrevisaoDeChegadaApiGoogle(origem, destino),
}

module.exports = functions
