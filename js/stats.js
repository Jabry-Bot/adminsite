document.addEventListener('DOMContentLoaded', function() {
    const localStorageKeyUsuarios = 'usuarios';
    const localStorageKeyPubs = 'pubs';
    let usuarios = JSON.parse(localStorage.getItem(localStorageKeyUsuarios));
    let pubs = JSON.parse(localStorage.getItem(localStorageKeyPubs));

    if (!usuarios) {
        fetch('usuarios.json')
            .then(response => response.json())
            .then(data => {
                usuarios = data;
                localStorage.setItem(localStorageKeyUsuarios, JSON.stringify(usuarios));
                displayStats(usuarios);
            })
            .catch(error => console.error('Error fetching usuarios.json:', error));
    } else {
        displayStats(usuarios);
    }

    if (!pubs) {
        fetch('js/pubs.json')
            .then(response => response.json())
            .then(data => {
                pubs = data;
                displayPubsCount(pubs);
                localStorage.setItem(localStorageKeyPubs, JSON.stringify(pubs));

            })
            .catch(error => console.error('Error fetching pubs.json:', error));
    } else {
        displayPubsCount(pubs);
        console.log('Pubs:', pubs);
    }

    function displayStats(usuarios) {
        console.log('Usuarios:', usuarios);
        
        const numUsuariosElement = document.getElementById('num-usuarios');
        const numUsuariosBlockElement = document.getElementById('num-usuarios-block');
        const numUsuariosPendientesElement = document.getElementById('num-usuarios-pendientes');

        const totalUsuarios = usuarios.length;
        const bloqueados = usuarios.filter(usuario => usuario.bloqueado).length;
        const pendientes = usuarios.filter(usuario => usuario.pendiente).length;

        numUsuariosElement.textContent = totalUsuarios;
        numUsuariosBlockElement.textContent = bloqueados;
        numUsuariosPendientesElement.textContent = pendientes;

        console.log(`Total de usuarios: ${totalUsuarios}`);
        console.log(`Usuarios bloqueados: ${bloqueados}`);
    }

    function displayPubsCount(pubs) {
        const numPubElement = document.getElementById('num-pub');
        numPubElement.textContent = pubs.length;
    }
});