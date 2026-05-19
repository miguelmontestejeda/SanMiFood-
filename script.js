document.addEventListener("DOMContentLoaded", function () {

    const btnGuardar = document.getElementById("btnGuardar");
    const btnIniciarSesion = document.getElementById("btnIniciarSesion");

    const irRegistro = document.getElementById("irRegistro");
    const irLogin = document.getElementById("irLogin");

    if (btnGuardar) {
        btnGuardar.addEventListener("click", guardar);
    }

    if (btnIniciarSesion) {
        btnIniciarSesion.addEventListener("click", iniciarSesion);
    }

    // IR A REGISTRO
    if (irRegistro) {

        irRegistro.addEventListener("click", function (e) {

            e.preventDefault();

            document.getElementById("seccionInicioSesion").style.display = "none";

            document.getElementById("seccionLogin").style.display = "flex";
        });
    }

    // IR A LOGIN
    if (irLogin) {

        irLogin.addEventListener("click", function (e) {

            e.preventDefault();

            document.getElementById("seccionLogin").style.display = "none";

            document.getElementById("seccionInicioSesion").style.display = "flex";
        });
    }

    verificarSesion();
    actualizarContador();
});


// =========================
// VERIFICAR SESIÓN
// =========================
function verificarSesion() {

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (usuarioActivo) {

        document.getElementById("menuNav").style.display = "flex";

        document.getElementById("seccionInicio").style.display = "block";

        document.getElementById("seccionInicioSesion").style.display = "none";

        document.getElementById("seccionLogin").style.display = "none";

    } else {

        document.getElementById("menuNav").style.display = "none";

        document.getElementById("seccionInicio").style.display = "none";

        document.getElementById("seccionInicioSesion").style.display = "flex";

        document.getElementById("seccionLogin").style.display = "none";
    }
}


// =========================
// REGISTRO
// =========================
function guardar() {

    const nombre = document.getElementById("Nombre").value.trim();

    const telefono = document.getElementById("Telefono").value.trim();

    const direccion = document.getElementById("Direccion").value.trim();

    const correo = document.getElementById("Correo").value.trim();

    const password = document.getElementById("Password").value.trim();

    if (!nombre || !telefono || !direccion || !correo || !password) {

        mostrarMensaje("Completa todos los campos", "error");

        return;
    }

    let personas = JSON.parse(localStorage.getItem("personas")) || [];

    const existe = personas.some(p => p.correo === correo);

    if (existe) {

        mostrarMensaje("Correo ya registrado", "error");

        return;
    }

    const persona = {
        nombre,
        telefono,
        direccion,
        correo,
        password
    };

    personas.push(persona);

    localStorage.setItem("personas", JSON.stringify(personas));

    localStorage.setItem("usuarioActivo", JSON.stringify(persona));

    mostrarMensaje("Registro exitoso", "exito");

    document.getElementById("Nombre").value = "";
    document.getElementById("Telefono").value = "";
    document.getElementById("Direccion").value = "";
    document.getElementById("Correo").value = "";
    document.getElementById("Password").value = "";

    verificarSesion();
}


// =========================
// LOGIN
// =========================
function iniciarSesion() {

    const correo = document.getElementById("CorreoLogin").value.trim();

    const password = document.getElementById("PasswordLogin").value.trim();

    const personas = JSON.parse(localStorage.getItem("personas")) || [];

    const usuario = personas.find(p =>
        p.correo === correo &&
        p.password === password
    );

    if (usuario) {

        localStorage.setItem("usuarioActivo", JSON.stringify(usuario));

        mostrarMensaje("Bienvenido " + usuario.nombre, "exito");

        verificarSesion();

    } else {

        mostrarMensaje("Datos incorrectos", "error");
    }
}


// =========================
// CERRAR SESIÓN
// =========================
function cerrarSesion() {

    localStorage.removeItem("usuarioActivo");

    location.reload();
}


// =========================
// PRODUCTOS
// =========================
const productos = {

    tacos: [
        {
            nombre: "Taco al Pastor",
            precio: 25,
            imagen: "Imagenes/tacos.jpg"
        },

        {
            nombre: "Taco de Asada",
            precio: 30,
            imagen: "Imagenes/tacos.jpg"
        }
    ],

    pizzas: [
        {
            nombre: "Pizza Pepperoni",
            precio: 120,
            imagen: "Imagenes/Pizza.jpeg"
        }
    ],

    hamburguesas: [
        {
            nombre: "Hamburguesa Clásica",
            precio: 90,
            imagen: "Imagenes/Hamburguesas.jpeg"
        }
    ],

    birria: [
        {
            nombre: "Quesabirria",
            precio: 85,
            imagen: "Imagenes/Birria 2.jpeg"
        }
    ],

    postres: [
        {
            nombre: "Pastel de Chocolate",
            precio: 60,
            imagen: "Imagenes/postres.jpeg"
        }
    ],

    bebidas: [
        {
            nombre: "Limonada",
            precio: 35,
            imagen: "Imagenes/Bebidas.jpeg"
        }
    ]
};


// =========================
// MOSTRAR CATEGORÍA
// =========================
function mostrarCategoria(categoria) {

    document.querySelector(".contenedor-tarjetas").style.display = "none";

    document.getElementById("seccionProductos").style.display = "block";

    document.getElementById("tituloCategoria").textContent =
        categoria.toUpperCase();

    const contenedor = document.getElementById("contenedorProductos");

    contenedor.innerHTML = "";

    productos[categoria].forEach(producto => {

        contenedor.innerHTML += `
        
            <div class="producto">

                <img src="${producto.imagen}">

                <h3>${producto.nombre}</h3>

                <p>$${producto.precio}</p>

                <button onclick="agregarCarrito('${producto.nombre}')">
                    Agregar al carrito
                </button>

            </div>
        `;
    });
}


// =========================
// VOLVER
// =========================
function volverInicio() {

    document.querySelector(".contenedor-tarjetas").style.display = "grid";

    document.getElementById("seccionProductos").style.display = "none";
}


// =========================
// AGREGAR CARRITO
// =========================
function agregarCarrito(nombreProducto) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const producto = Object.values(productos)
        .flat()
        .find(p => p.nombre === nombreProducto);

    carrito.push(producto);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarMensaje("Producto agregado", "exito");

    actualizarContador();
}


// =========================
// MOSTRAR CARRITO
// =========================
function mostrarCarrito() {

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const contenedor = document.getElementById("contenedorCarrito");

    const total = document.getElementById("totalCarrito");

    contenedor.innerHTML = "";

    let suma = 0;

    carrito.forEach((producto, index) => {

        contenedor.innerHTML += `
        
            <div class="item-carrito">

                <p>${producto.nombre}</p>

                <p>$${producto.precio}</p>

                <button onclick="eliminarDelCarrito(${index})">
                    ❌
                </button>

            </div>
        `;

        suma += producto.precio;
    });

    total.textContent = "Total: $" + suma;

    document.getElementById("modalCarrito").style.display = "flex";
}


// =========================
// ELIMINAR PRODUCTO
// =========================
function eliminarDelCarrito(index) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.splice(index, 1);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCarrito();

    actualizarContador();
}


// =========================
// CERRAR MODAL
// =========================
function cerrarCarrito() {

    document.getElementById("modalCarrito").style.display = "none";
}


// =========================
// CONTADOR
// =========================
function actualizarContador() {

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    document.getElementById("contadorCarrito").textContent =
        carrito.length;
}


// =========================
// MENSAJES
// =========================
function mostrarMensaje(texto, tipo) {

    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = texto;

    mensaje.style.display = "block";

    mensaje.className = "";

    if (tipo === "error") {

        mensaje.classList.add("mensaje-error");

    } else {

        mensaje.classList.add("mensaje-exito");
    }

    setTimeout(() => {

        mensaje.style.display = "none";

    }, 3000);
}