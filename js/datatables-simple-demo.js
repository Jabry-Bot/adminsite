window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple, {
            labels: {
                placeholder: "Buscar...",
                perPage: "Entradas por página",
                noRows: "No se encontraron entradas",
                info: "mostrando {start} a {end} de {rows} entradas",
                noResults: "No se encontraron entradas",
            },
            layout: {
                top: "{search}",
                bottom: "{info}{pager}",
            },
        });
    }
});