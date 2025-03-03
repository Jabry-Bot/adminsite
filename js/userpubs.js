document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('selectedUserId');
    if (!userId) {
        alert('No se ha seleccionado ningún usuario.');
        window.location.href = 'usuarios.html';
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios'));
    const usuario = usuarios.find(u => u.id == userId);

    if (!usuario) {
        alert('Usuario no encontrado.');
        window.location.href = 'usuarios.html';
        return;
    }
    if (document.getElementById('perfilUsuario')) {
        document.getElementById('perfilUsuario').innerHTML = `
            <div class="card mb-4 shadow-sm">
                <div class="card-header">
                    <h2 class="my-0 font-weight-normal">${usuario.nombre} ${usuario.apellidos}</h2>
                </div>
                <div class="card-body">
                    <p><strong>Correo:</strong> ${usuario.correo}</p>
                    <p><strong>Fecha de Nacimiento:</strong> ${usuario.fecha_nacimiento}</p>
                    <p><strong>País de Residencia:</strong> ${usuario.pais_residencia}</p>
                </div>
            </div>
        `;
        
    }


    const publicaciones = JSON.parse(localStorage.getItem('pubs'));
    if (!publicaciones) {
        fetch('js/pubs.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('pubs', JSON.stringify(data));
                displayPublicaciones(data);
            })
            .catch(error => console.error('Error fetching pubs.json:', error));
        
    } else {
        displayPublicaciones(publicaciones);
    }
  
});


function confirmarBloqueo(id) {
    let publicaciones = JSON.parse(localStorage.getItem('pubs'));
    let pub = publicaciones.find(pub => pub.id === id);

    if (pub) {
        let mensaje = pub.bloqueado
            ? '¿Quieres desbloquear a esta publicacion?'
            : '¿Quieres bloquear a esta publicacion?';

        mostrarModalConfirmacion(mensaje, function () {
            bloquearPublicacion(id);
        });
    }
}

function bloquearPublicacion(id) {
    console.log('Bloqueando publicacion con ID:', id);
    
    
    
    let publicaciones = JSON.parse(localStorage.getItem('pubs'));
    let pub = publicaciones.find(pub => pub.id === id);
    console.log(pub);
    
    if (pub) {
        pub.bloqueado = !pub.bloqueado;
        localStorage.setItem('pubs', JSON.stringify(publicaciones));
        displayPublicaciones(publicaciones);
    }

}


function displayPublicaciones(publicaciones) {
    const tbody = document.getElementById('publicacionesTableBody');
    tbody.innerHTML = '';
    console.log(tbody);
    
    publicaciones.forEach(pub => {
            const tr = document.createElement('tr');
            console.log(pub);
            
            tr.innerHTML = `
                <td>${pub.titulo}</td>
                <td>${pub.fecha}</td>
                <td>
                    <button class="btn btn-posts m-3 m-sm-1" onclick="verPublicacion(${pub.id})" ${pub.bloqueado ? 'disabled' : ''}><i class="fas fa-eye"></i></button>
                    <button class="btn btn-block m-3 m-sm-1" onclick="confirmarBloqueo(${pub.id})"><i class="fas ${pub.bloqueado ? 'fa-unlock' : 'fa-lock'}"></i></button>

                </td>
            `;
            tbody.appendChild(tr);
            console.log(pub);
            
    });
}
let confirmCallback = null; // Variable para almacenar la acción a ejecutar

function verPublicacion(id) {
    const publicaciones = JSON.parse(localStorage.getItem('pubs'));
    const pub = publicaciones.find(pub => pub.id === id);

    if (pub && !pub.bloqueado) {
        window.location.href = pub.url;
    }
}

function mostrarModalConfirmacion(mensaje, accion) {
    document.getElementById('confirmModalBody').innerText = mensaje;
    confirmCallback = accion;

    let modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

document.getElementById('confirmActionBtn').addEventListener('click', function () {
    if (confirmCallback) {
        confirmCallback();
    }
    let modalElement = document.getElementById('confirmModal');
    let modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
});