const datos = JSON.parse(localStorage.getItem("comprobante"));
const contenedor = document.getElementById("comprobante");


if (!datos) {
  Swal.fire({
    icon: "error",
    title: "Sin datos de pago",
    text: "No se encontró ningún comprobante disponible.",
    confirmButtonText: "Volver al inicio"
  }).then(() => {
    window.location.href = "menu.html";
  });
} else {
  // Mostrar alerta de éxito
  Swal.fire({
    icon: "success",
    title: "Pago realizado con éxito",
    text: "Gracias por tu compra. A continuación, el comprobante.",
    confirmButtonText: "Ver comprobante"
  });

  let html = `
    <h4 class="mb-3">Datos del Cliente</h4>
    <p><strong>Nombre:</strong> ${datos.nombre} ${datos.apellido}</p>
    <p><strong>Dirección:</strong> ${datos.direccion}</p>
    <p><strong>Teléfono:</strong> ${datos.telefono}</p>
    <p><strong>Email:</strong> ${datos.email}</p>
    <p><strong>Método de Pago:</strong> ${formatearMetodo(datos.metodoPago)}</p>
    <hr>
    <h4 class="mt-4 mb-3">Productos Comprados</h4>
  `;

  let total = 0;
  datos.productos.forEach(p => {
    html += `<p>${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}</p>`;
    total += p.precio * p.cantidad;
  });

  html += `
    <hr>
    <h5 class="mt-4">Total Pagado: $${total}</h5>
  `;

  contenedor.innerHTML = html;

  // Eliminar comprobante del localStorage
  localStorage.removeItem("comprobante");

  // Agregar función al botón "Volver al inicio"
  const volverBtn = document.getElementById("volverBtn");
  volverBtn.addEventListener("click", () => {
    window.location.href = "menu.html";
  });
}

// Función auxiliar para mostrar el nombre del método de pago
function formatearMetodo(metodo) {
  switch (metodo) {
    case "efectivo": return "Efectivo";
    case "mercadoPago": return "MercadoPago";
    case "tarjeta": return "Tarjeta de Crédito";
    default: return "Otro";
  }
}
