let map = L.map('map').setView([-37.46973,-72.35366],15)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function agregarMarcador() {
    var nombre = document.getElementById('name').value;
    var latitud = parseFloat(document.getElementById('latitude').value);
    var longitud = parseFloat(document.getElementById('longitude').value);
    var fecha = document.getElementById('date').value;
    var altura = parseFloat(document.getElementById('height').value);

    // Crea un marcador con información personalizada
    var marker = L.marker([latitud, longitud]).addTo(map);
    marker.bindPopup(`<b>${nombre}</b><br>Fecha: ${fecha}<br>Altura: ${altura} metros`).openPopup();

    // Guarda el marcador en el almacenamiento local
    guardarMarcador({ nombre: nombre, latitud: latitud, longitud: longitud, fecha: fecha, altura: altura });
}

function guardarMarcador(marcador) {
    // Obtener los marcadores existentes del archivo en GitHub
    // Puedes usar una biblioteca para realizar solicitudes HTTP, como axios o fetch
    // Aquí se asume el uso de fetch
    fetch('https://raw.githubusercontent.com/TopoDeLaPaz/TopoDeLaPaz.github.io/main/marcadores.json')
        .then(response => response.json())
        .then(data => {
            // Agregar el nuevo marcador
            data.push(marcador);

            // Guardar la lista actualizada en el archivo en GitHub
            fetch('https://api.github.com/repos/TopoDeLaPaz/TopoDeLaPaz.github.io/contents/marcadores.json', {
                method: 'PUT',
                headers: {
                    'Authorization': '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', // Necesitarás un token de acceso para autenticar la solicitud
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Actualizar marcadores',
                    content: btoa(JSON.stringify(data)),
                    sha: 'sha-del-archivo' // Puedes obtener esto haciendo una solicitud GET al mismo archivo
                })
            });
        })
        .catch(error => console.error('Error al guardar marcador:', error));
}

function cargarMarcadores() {
    // Obtener los marcadores del archivo en GitHub
    fetch('https://raw.githubusercontent.com/TopoDeLaPaz/TopoDeLaPaz.github.io/main/marcadores.json')
        .then(response => response.json())
        .then(data => {
            // Agregar los marcadores al mapa
            for (var i = 0; i < data.length; i++) {
                var marcador = data[i];
                var marker = L.marker([marcador.latitud, marcador.longitud]).addTo(map);
                marker.bindPopup(`<b>${marcador.nombre}</b><br>Fecha: ${marcador.fecha}<br>Altura: ${marcador.altura} metros`);
            }
        })
        .catch(error => console.error('Error al cargar marcadores:', error));
}

// Cargar los marcadores al iniciar la aplicación
cargarMarcadores();


// Función para cargar los marcadores desde un archivo CSV
function cargarDesdeCSV(url) {
    Papa.parse(url, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function (result) {
            // Itera sobre los datos del CSV y agrega los marcadores
            result.data.forEach(function (row) {
                agregarMarcador(row.nombre, row.latitud, row.longitud, row.fecha, row.altura);
            });
        }
    });
}

// Llama a la función para cargar desde el archivo CSV (asegúrate de proporcionar la ruta correcta)
cargarDesdeCSV('Libro1.csv');
