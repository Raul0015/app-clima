const inquirer = require('inquirer');
require('colors');

// Preguntas que espera
const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Que desea hacer?',
        // Vamos a manejar las opciones como objetos
        choices: [
            {
                value: 1, // Se puede mandar como string o numero
                name: `${'1.'.green} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
];


// Inquire trabaja en base a promesas
const inquirerMenu = async() => {
    console.clear();
    console.log('=============================='.green);
    console.log('   Seleccione una Opción   '.white)
    console.log('==============================\n'.green);

    // Para hacer una pregunta
    // Desestructuramos porque se manda lo siguiente: opcion: valor, entonces solo nos interesa el valor
    const {opcion} = await inquirer.prompt(preguntas)

    return opcion;
}

const pause = async() => {
    
    const question = [{ 
            type: 'input',
            name: 'Enter',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ];

    console.log('\n');
    await inquirer.prompt(question);
}

const leerInput = async(mensaje) => {
    const question = [{
            type: 'input',
            name: 'desc',
            message: mensaje,
            validate( value ){
                if(value.length === 0){
                    return `Favor de Ingresar un valor`;
                }
                return true;
            }
        }
    ];

    // El inquirer me regresa un objeto, entonces se desestructura y se saca el dec
    const {desc} = await inquirer.prompt(question);
    return desc;

}

const listarLugares = async(lugares = []) => {
    //.map Retorna un nuevoo arreglo pero transforma los hijos, es decir, los valores el arreglo actual los transforma lo que el quiera
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}`.green;
        
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar'
    }); // para añadir al inicio del arreglo

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices // como seria choices: choices entocnes es reduntante
        }
    ]

    const {id} = await inquirer.prompt(preguntas);

    return id;

}

const confirmarEliminacion = async(message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]

    const {ok} = await inquirer.prompt(question);

    return ok;
}

const mostrarListadoCheckList = async(tareas = []) => {
    //.map Retorna un nuevoo arreglo pero transforma los hijos, es decir, los valores el arreglo actual los transforma lo que el quiera
    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}`.green;
        
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices // como seria choices: choices entocnes es reduntante
        }
    ]

    const {ids} = await inquirer.prompt(pregunta);

    return ids;

}


module.exports = {
    inquirerMenu,
    pause,
    leerInput,
    listarLugares,
    confirmarEliminacion,
    mostrarListadoCheckList
}