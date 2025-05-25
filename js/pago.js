const form = document.getElementById("paymentForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Obtener los valores del formulario
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const email = document.getElementById("email").value.trim();
  const metodoPago = document.getElementById("metodoPago").value;

  if (!nombre || !apellido || !direccion || !telefono || !email || !metodoPago) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor completá todos los campos.",
    });
    return;
  }

  const productos = JSON.parse(localStorage.getItem("carrito")) || [];

  if (productos.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Carrito vacío",
      text: "No hay productos para pagar.",
    });
    return;
  }

  // Crear el objeto comprobante
  const comprobante = {
    nombre,
    apellido,
    direccion,
    telefono,
    email,
    metodoPago,
    productos,
  };

  // Guardar en localStorage
  localStorage.setItem("comprobante", JSON.stringify(comprobante));

  // Limpiar carrito
  localStorage.removeItem("carrito");

  // Confirmación con SweetAlert
  Swal.fire({
    icon: "success",
    title: "Pago procesado",
    text: "Redirigiendo al comprobante...",
    showConfirmButton: false,
    timer: 2000,
  }).then(() => {
    window.location.href = "comprobante.html";
  });
});
document.getElementById("metodoPago").addEventListener("change", function () {
    const tarjetaInfo = document.getElementById("tarjetaInfo");
    tarjetaInfo.classList.toggle("d-none", this.value !== "tarjeta");
  });
  
  document.getElementById("formPago").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const metodoPago = document.getElementById("metodoPago").value;
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
  
    if (!nombre.trim() || !telefono.trim()) {
      Swal.fire("Campos incompletos", "Por favor, completá los datos obligatorios.", "warning");
      return;
    }
  
    if (metodoPago === "tarjeta") {
      const numeroTarjeta = document.getElementById("numeroTarjeta").value;
      const titular = document.getElementById("titularTarjeta").value;
      const codigo = document.getElementById("codigoSeguridad").value;
      const vencimiento = document.getElementById("vencimiento").value;
  
      if (!numeroTarjeta || !titular || !codigo || !vencimiento) {
        Swal.fire("Faltan datos de tarjeta", "Completá todos los campos de la tarjeta.", "error");
        return;
      }
    }
  
    localStorage.setItem("metodoPago", metodoPago);
    window.location.href = "comprobante.html";
  });
