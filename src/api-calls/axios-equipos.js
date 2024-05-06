import axios from "axios";

// URL usada en las llamadas
const url = "https://localhost:7057/api/Equipos"

// Funcion asincrona para conseguir los equipos
async function getEquiposAxios() {
    // Variable para guardar la respuesta de la llamada HTTP
    var httpResponse = null;
    // Hacemos la llamada HTTP GET para obtener la lista de equipos
    await axios.get(url)
        .then(response => { console.log(response);
            // Guardamos la respuesta
            httpResponse = response.data;
    })
    // Devolvemos el resultado
    return httpResponse;
}

// Funcion asincrona para conseguir un equipo segun el ID
async function getEquipoAxios(id) {
    // Variable para guardar la respuesta de la llamada HTTP
    var httpResponse = null;
    // Hacemos la llamada HTTP GET para obtener el equipo
    await axios.get("https://localhost:7057/api/Equipos/"+id)
    .then(response => { console.log(response);
        // Guardamos la respuesta
        httpResponse = response.data;
    })
    // Devolvemos el resultado
    return httpResponse;
}

// Funcion asincrona para añadir un equipo a la lista
async function addEquipoAxios(tipo, descripcion) {
    // Variable para guardar la respuesta de la llamada HTTP
    var httpResponse = null;
    // Hacemos la llamada HTTP POST creando el nuevo equipo
    await axios.post("https://localhost:7057/api/Equipos", {
        tipo: tipo,
        descripcion: descripcion,
        estado: "Disponible"
    }).then(response => { console.log(response); 
        // Guardamos la respuesta
        httpResponse = response.data;
    })
    .catch(error => { console.log(error); });
    // Devolvemos el resultado
    return httpResponse;
}

// Funcion asincrona para actualizar un equipo
// Devuelve si ha podido modificarlo o no
async function updateEquipoAxios(equipo, tipo, descripcion) {
    // Obtenemos el ID del equipo
    var id = equipo.id;
    // Variable para guardar la respuesta de la llamada HTTP
    var httpResponse = false;
    // Hacemos la llamada HTTP PUT para actualizar el equipo
    await axios.put("https://localhost:7057/api/Equipos/"+id, {
        ID: id,
        tipo: tipo,
        descripcion: descripcion,
        estado: equipo.estado,
        misionDTO: equipo.misionDTO
    }).then(response => { console.log(response); httpResponse = true; })
    .catch(error => { console.log(error); httpResponse = false; });
    // Devolvemos el resultado
    return httpResponse;
}

// Funcion asincrona para eliminar un equipo de la lista
// Devuelve si ha podido eliminarlo o no
async function removeEquipoAxios(equipo) {
    // Obtenemos el id del equipo
    var id = equipo.id;
    // Variable para guardar la respuesta de la llamada HTTP
    var httpResponse = false;
    // Hacemos la llamada HTTP DELETE para eliminar el equipo
    await axios.delete("https://localhost:7057/api/Equipos/"+id)
        .then(async (response) => { console.log(response); httpResponse = true; })
        .catch(error => { console.log(error); httpResponse = false; });
    // Devolvemos el resultado
    return httpResponse;
}

export { getEquiposAxios, getEquipoAxios, addEquipoAxios, updateEquipoAxios, removeEquipoAxios };