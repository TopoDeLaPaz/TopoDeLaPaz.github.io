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
    // Obtiene los marcadores existentes del almacenamiento local
    var marcadoresGuardados = JSON.parse(localStorage.getItem('marcadores')) || [];

    // Agrega el nuevo marcador
    marcadoresGuardados.push(marcador);

    // Guarda la lista actualizada en el almacenamiento local
    localStorage.setItem('marcadores', JSON.stringify(marcadoresGuardados));

    // Agrega el marcador al mapa
    var marker = L.marker([marcador.latitud, marcador.longitud]).addTo(map);
    marker.bindPopup(`<b>${marcador.nombre}</b><br>Fecha: ${marcador.fecha}<br>Altura: ${marcador.altura} metros`);
}

function cargarMarcadores() {
    // Obtiene los marcadores del almacenamiento local
    var marcadoresGuardados = JSON.parse(localStorage.getItem('marcadores')) || [];

    // Agrega los marcadores al mapa
    for (var i = 0; i < marcadoresGuardados.length; i++) {
        var marcador = marcadoresGuardados[i];
        var marker = L.marker([marcador.latitud, marcador.longitud]).addTo(map);
        marker.bindPopup(`<b>${marcador.nombre}</b><br>Fecha: ${marcador.fecha}<br>Altura: ${marcador.altura} metros`);
    }
}

// Carga los marcadores al iniciar la aplicación
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
