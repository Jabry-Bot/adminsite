document.addEventListener('DOMContentLoaded', function() {
    const localStorageKey = 'usuarios';
    let usuarios = JSON.parse(localStorage.getItem(localStorageKey));

    if (!usuarios) {
    fetch('js/usuarios.json')
        .then(response => response.json())
        .then(data => {
            // Asignar un ID único a cada usuario
            data.forEach((usuario, index) => usuario.id = index + 1);
            localStorage.setItem('usuarios', JSON.stringify(data));
            cargarUsuarios();
        })
        .catch(error => console.error('Error fetching users:', error));
    } else {
        cargarUsuarios();
    }



}

);

function cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios'));
    const tbody = document.querySelector('#usuariosTable tbody');
    tbody.innerHTML = '';

    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        if (usuario.bloqueado) {
            tr.classList.add('tr-bloqueado');
        }
        tr.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.apellidos}</td>
            <td>${usuario.correo}</td>
            <td style="text-align: center;">
            <button class="btn btn-edit m-3 m-sm-1" onclick="editarUsuario(${usuario.id})" ${usuario.bloqueado ? 'disabled' : ''}><i class="fas fa-edit"></i></button>
            <button class="btn btn-posts m-3 m-sm-1" onclick="verPublicaciones(${usuario.id})" ${usuario.bloqueado ? 'disabled' : ''}><i class="fas fa-eye"></i></button>
            <button class="btn btn-block m-3 m-sm-1" onclick="confirmarBloqueo(${usuario.id})"><i class="fas ${usuario.bloqueado ? 'fa-unlock' : 'fa-lock'}"></i></button>
            <button class="btn btn-delete m-3 m-sm-1" onclick="confirmarBorrado(${usuario.id})"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editarUsuario(id) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let usuario = usuarios.find(usuario => usuario.id === id);

    if (usuario) {
        document.getElementById('nombre').value = usuario.nombre;
        document.getElementById('apellidos').value = usuario.apellidos;
        document.getElementById('correo').value = usuario.correo;
        document.getElementById('fecha_nacimiento').value = usuario.fecha_nacimiento;
        document.getElementById('pais_residencia').value = usuario.pais_residencia;

        if (document.getElementById('contraseña').attributes.getNamedItem('required')) {
            document.getElementById('contraseña').attributes.removeNamedItem('required');
            document.getElementById('contraseña2').attributes.removeNamedItem('required')

            
        }
        
        document.getElementById('contraseña').parentElement.classList.add('d-none')
        document.getElementById('contraseña2').parentElement.classList.add('d-none')
        let modal = new bootstrap.Modal(document.getElementById('userFormModal'));
        modal.show();

        document.getElementById('userForm').addEventListener('submit', (event)=>{
        event.preventDefault();
            usuario.nombre = document.getElementById('nombre').value;
            usuario.apellidos = document.getElementById('apellidos').value;
            usuario.correo = document.getElementById('correo').value;
            usuario.fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
            usuario.pais_residencia = document.getElementById('pais_residencia').value;

            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            cargarUsuarios();

            let modalElement = document.getElementById('userFormModal');
            let modal = bootstrap.Modal.getInstance(modalElement);
            console.log(modal);
            
            modal.hide();
        });
    }
}

function borrarUsuario(id) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    usuarios = usuarios.filter(usuario => usuario.id !== id);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    cargarUsuarios();
}

function verPublicaciones(id) {
    localStorage.setItem('selectedUserId', id);
    window.location.href = 'userpubs.html';
}

function bloquearUsuario(id) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    usuarios = usuarios.map(usuario => {
        if (usuario.id === id) {
            usuario.bloqueado = !usuario.bloqueado;
        }
        return usuario;
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    cargarUsuarios();
}

function abrirFormulario() {

    document.getElementById('userForm').reset();


    if (!document.getElementById('contraseña').attributes.getNamedItem('required')) {
        document.getElementById('contraseña').attributes.setNamedItem(document.createAttribute('required'));
        document.getElementById('contraseña2').attributes.setNamedItem(document.createAttribute('required'));
    }
    document.getElementById('contraseña').parentElement.classList.remove('d-none')
    document.getElementById('contraseña2').parentElement.classList.remove('d-none')

    let modal = new bootstrap.Modal(document.getElementById('userFormModal'));
    modal.show();

    document.getElementById('userForm').onsubmit = function(event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const correo = document.getElementById('correo').value;
        const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
        const pais_residencia = document.getElementById('pais_residencia').value;
        const contraseña = document.getElementById('contraseña').value;
        const contraseña2 = document.getElementById('contraseña2').value;

        if (contraseña !== contraseña2) {
            alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const nuevoUsuario = {
            id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
            nombre,
            apellidos,
            correo,
            bloqueado: false,
            fecha_nacimiento,
            pais_residencia,
            contraseña
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        cargarUsuarios();

        let modalElement = document.getElementById('userFormModal');
        let modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
    };
}

function confirmarBorrado(id) {
    mostrarModalConfirmacion('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.', function () {
        borrarUsuario(id);
    });
}

function confirmarBloqueo(id) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let usuario = usuarios.find(usuario => usuario.id === id);

    if (usuario) {
        let mensaje = usuario.bloqueado
            ? '¿Quieres desbloquear a este usuario?'
            : '¿Quieres bloquear a este usuario?';

        mostrarModalConfirmacion(mensaje, function () {
            bloquearUsuario(id);
        });
    }
    
}

let confirmCallback = null; // Variable para almacenar la acción a ejecutar

function mostrarModalConfirmacion(mensaje, accion) {
    document.getElementById('confirmModalBody').innerText = mensaje;
    confirmCallback = accion;

    let modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

// Evento para el botón de confirmación
document.getElementById('confirmActionBtn').addEventListener('click', function () {
    if (confirmCallback) {
        confirmCallback();
    }
    let modalElement = document.getElementById('confirmModal');
    let modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
});
