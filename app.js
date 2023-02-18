require('dotenv').config();
const { leerInput, inquirerMenu, pause, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

// Ver variables de entorno
// console.log(process.env);

const main = async() => {
    
    // Variable para seleccionar lo que se quiere hacer del menu
    let opcion = 0;
    // Crear instancia de la clase
    // Fuera del do-while para que no se reinicie cada que pase
    const busquedas = new Busquedas();

    do{
        opcion = await inquirerMenu();
        // console.log({opcion});

        switch(opcion){
            case 1:
                // MOSTRAR EL MENSAJE
                // The user introduce a place to search
                const lugar = await leerInput('Ciudad: ');
                // console.log(ciudad);

                // BUSCAR LOS LUGARES
                // Hacemos la llamada al metodo
                // Show the places with that name
                const lugares = await busquedas.ciudad(lugar);
                // console.log(lugares);


                // SELECCIONAR LUGARES
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                // console.log({id});
                const placeSelected = lugares.find( lugar => {
                    return lugar.id === id
                });
                // console.log(placeSelected);
                const {nombre, lng, lat} = placeSelected;
                // Guardar en DB
                busquedas.agregarHistorial(nombre);
                // Clima
                const clima = await busquedas.climaLugar(placeSelected.lat, placeSelected.lng);
                const {desc, min, max, temp} = clima;
                // console.log(clima);

                // Mostrar resultados
                console.clear()
                console.log('\nInformación del lugar\n'.green);
                console.log('Ciudad: ', `${nombre}`.green);
                console.log('Lat: ', lat);
                console.log('Lgn: ', lng);
                console.log('Temperatura: ', temp);
                console.log('Mínima: ', min);
                console.log('Máxima: ', max);
                console.log('Descripción: ', `${desc}`.green);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                }) 
            break;
        }

        // Solo cuando la opción sea distinta a 0 hace el pause
        if (opcion !== 0 ) await pause();
    }while (opcion !== 0)
}

main();