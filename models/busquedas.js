const fs = require('fs');
const axios = require('axios');



// Aquí vamos a realizar la busqueda
class Busquedas {
    // Definición de propiedades
    historial = [];
    dbPath = './db/database.json';

    constructor () {
        // Leer la base de datos
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        });
    }

    // Lo hacemos asi por si hay otro punto y tiene los mimos parametros
    get paramsMapbox(){
        return{
            'language': 'es',
            'access_token': process.env.MAPBOX_key
        }
    }

    // Metodo
    // Es asincrono porque vamos hacer una peticion HTTP
    async ciudad (lugar = '' ){ // Recibimos el lugar que esta buscando la persona

        try{ // Cuando hacemos peticiones HTTP es bueno hacer uso del try y catch
            // Realizar peticion HTTP
            // Creacion de instancia
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            // uso de la instancia
            const resp = await instance.get();
            // console.log(resp.data.features);
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            })); // Para regresar un objeto implicitamente es ({})

            // Esto puede traer problemas (lo de abajo)
            // const respuesta = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Le%C3%B3n%20.json?language=es&access_token=pk.eyJ1IjoicmF1bC11cmllbDE1IiwiYSI6ImNsZTViYmJueDBiOWgzeW9nb2owcTJtOWsifQ.sVULHLRg_h16yqk6tCORnA');

            // console.log(respuesta.data);

            return [];// Objeto
        } catch (error){
            // Si queremos parar la app usamos un throw, pero vamos a regresar un arreglo con lo que la persona escribio
            return [];
        }
        

        return []; // Retornar los lugares que coincidan
    } 


    get paramsWeather(){
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async climaLugar(lat, lon){
        try{
            // instance axios.create()
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                // Desestructuramos el getter para mandar las propiedades
                params: {...this.paramsWeather, lat, lon}
            });

            const resp = await instance.get()
            // console.log(resp)
            const {weather, main} = resp.data

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };
        }catch(error){
            console.log(error);
        }
    }

    agregarHistorial(lugar = ''){
        // prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0, 5);
        // unshift agrega los datos al inicio del arreglo
        this.historial.unshift(lugar.toLocaleLowerCase());

        // Grabar un DB
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            hisotorial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        //Debe de existir
        if (!fs.existsSync(this.dbPath)){
            return null;
        }

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info)

        this.historial = data.hisotorial;
        //  const infi
    }

}



module.exports = Busquedas
