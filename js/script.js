let carritoProductos = JSON.parse(localStorage.getItem('carrito')) || [];
let productosCargados = false;
let productosCache = null;



async function cargarProductosDesdeJSON() {
  try {
    if (productosCargados && productosCache) {
      renderizarProductos(productosCache);
      return;
    }

    const respuesta = await fetch("../data/productos.json");
    if (!respuesta.ok) {
      throw new Error(`HTTP error! Código: ${respuesta.status}`);
    }

    const data = await respuesta.json();
    productosCache = data;
    productosCargados = true;
    renderizarProductos(data);

  } catch (error) {
    console.error("Error al cargar productos:", error);
    const contenedor = document.querySelector("main");
    if (contenedor) {
      contenedor.innerHTML = `
        <div class="d-flex justify-content-center align-items-center vh-100">
          <div class="card text-white bg-danger shadow p-4" style="max-width: 500px;">
            <div class="card-body text-center">
              <h3 class="card-title mb-3">
                <span class="me-2">⚠️</span>Error al cargar el menú
              </h3>
              <p class="card-text">No pudimos cargar los productos. Verificá tu conexión o intentá nuevamente.</p>
              <button id="reintentarCarga" class="btn btn-light mt-3">Reintentar</button>
            </div>
          </div>
        </div>
      `;
    
      document.getElementById("reintentarCarga").addEventListener("click", () => {
        contenedor.innerHTML = ""; // limpia mensaje
        cargarProductosDesdeJSON(); // reintenta carga
      });
    }
  }
}

function renderizarProductos(data) {
  const burgasCont = document.getElementById("burgas-container");
  const papasCont = document.getElementById("papas-container");
  const bebidasCont = document.getElementById("bebidas-container");

  burgasCont.innerHTML = "";
  papasCont.innerHTML = "";
  bebidasCont.innerHTML = "";

  imprimirProductosEnArticulos(data.burgas, "burgas-container");
  imprimirProductosEnArticulos(data.papas, "papas-container");
  imprimirProductosEnArticulos(data.bebidas, "bebidas-container");
}

function imprimirProductosEnArticulos(productos, nombreContenedor) {
    const contenedor = document.getElementById(nombreContenedor);
	productos.forEach(function(producto) {
    const card = crearTarjetaProducto(producto, true, "Agregar Al Carrito", agregarAlCarrito);
    contenedor.appendChild(card);
	});
}

function agregarAlCarrito(producto) {
  const existente = carritoProductos.find(p => p.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carritoProductos.push({ ...producto, cantidad: 1 });
  }
  localStorage.setItem('carrito', JSON.stringify(carritoProductos));
}

function actualizarCarritoEnPantalla(pago) {
  const contenedor = document.getElementById("carritoArticulos");
  contenedor.innerHTML = ""; 
  if (carritoProductos.length === 0 && pago === 1){
    contenedor.innerHTML = "<p class='text-center'>Gracias por su compra.</p>";
    return;
  }
  if (carritoProductos.length === 0) {
      contenedor.innerHTML = "<p class='text-center'>Tu carrito está vacío.</p>";
      return;
  }
  let precioTotal = 0;
  carritoProductos.forEach(function(producto) {
    const card = crearTarjetaProducto(producto, false);
    
  
    const botonAgregar = crearBotonConEstilo(
      `agregar-${producto.id}`,
      "+",
      ["btn", "btn-success", "m-1"],
      () => {
        agregarAlCarrito(producto);
        actualizarCarritoEnPantalla(0);
      }
    );
  
    const botonQuitar = crearBotonConEstilo(
      `quitar-${producto.id}`,
      "-",
      ["btn", "btn-danger", "m-1"],
      () => {
        removerDelCarrito(producto);
      }
    );
  
    card.appendChild(botonAgregar);
    card.appendChild(botonQuitar);
  
    contenedor.appendChild(card);
    precioTotal += producto.precio * producto.cantidad;
  });
  if (precioTotal > 0) {
    const total = document.createElement("p");
    const botonPagar = document.createElement("button");
    total.classList.add("fs-5", "roboto-mono", "ms-5");
    botonPagar.classList.add("btn", "btn-danger", "bgd", "ms-5", "m-5");
    botonPagar.textContent = `Pagar`;
    total.textContent = `Precio total del Pedido: ${precioTotal}`;
    contenedor.appendChild(total);
    contenedor.appendChild(botonPagar);
    botonPagar.addEventListener("click", () => pagado())
  }
}

function removerDelCarrito(producto) {
  const index = carritoProductos.findIndex(p => p.id === producto.id);
  if (index !== -1) {
    if (carritoProductos[index].cantidad > 1) {
      carritoProductos[index].cantidad -= 1;
    } else {
      carritoProductos.splice(index, 1);
    }
    localStorage.setItem('carrito', JSON.stringify(carritoProductos));
    actualizarCarritoEnPantalla(0);
  }
}

function pagado() {
  // Solo redirige si hay productos
  if (carritoProductos.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Carrito vacío",
      text: "Agregá productos antes de pagar.",
    });
    return;
  }
  // Guardar el carrito actual antes de redirigir
  localStorage.setItem("carrito", JSON.stringify(carritoProductos));
  window.location.href = "pago.html";
}

function crearBotonConEstilo(id, texto, clases, onClick) {
  const boton = document.createElement("button");
  boton.id = id;
  boton.textContent = texto;
  clases.forEach(clase => boton.classList.add(clase));
  boton.addEventListener("click", onClick);
  return boton;
}

function crearTarjetaProducto(producto, incluirBoton, botonTexto = "Agregar Al Carrito", botonCallback) {
  const card = document.createElement("div");
  card.classList.add("col-sm-12", "col-md-6", "col-lg-3", "m-5", "border", "border-black", "p-3", "bgd-brown");

  card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <p class="fs-5 roboto-mono">${producto.nombre}</p>
      <p class="fs-5 roboto-mono">Precio: ${producto.precio}</p>
  `;

  // Mostrar cantidad si ya está en el carrito
  const enCarrito = carritoProductos.find(p => p.id === producto.id);
  if (enCarrito) {
    const cantidadInfo = document.createElement("p");
    cantidadInfo.classList.add("fs-6", "roboto-mono", "text-success");
    cantidadInfo.textContent = `En carrito: ${enCarrito.cantidad}`;
    card.appendChild(cantidadInfo);
  }

  if (incluirBoton && botonCallback) {
    const boton = crearBotonConEstilo(
      producto.id,
      botonTexto,
      ["btn", "btn-danger", "bgd"],
      () => {
        botonCallback(producto);
        if (location.pathname.endsWith("menu.html")) {
          renderizarProductos(productosCache); // sin recargar todo
        }
      }
    );
    card.appendChild(boton);
  }

  return card;
}

if (location.pathname.endsWith("menu.html")) {
  cargarProductosDesdeJSON();
}
if (location.pathname.endsWith("carrito.html")){
    actualizarCarritoEnPantalla(0)
}