let menus=[];

let carrito = [];

const contenedorProductos = document.getElementById('contenedorProductos');

const precioTotal = document.getElementById('precioTotal');

const contenedorCarrito = document.querySelector("#lista-carrito tbody");

const contadorCarrito = document.getElementById('contCarrito');

const vaciar = document.getElementById('vaciar');

const finalizarCompra = document.getElementById('finalizarCompra');

//verifico si hay algo en el localStorage
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito')) ?? [];
    actualizarCarrito();
  };
});

//Vaciar carrito de compras y actualizar el localStorage
vaciar.addEventListener('click', () => {
  carrito.length = 0
  actualizarCarrito()
  localStorage.clear()
//usando libreria sweetalert2
Swal.fire({
  title: 'Carrito vacio',
  background: '#000',
  color: '#fff',
  });
});

//Fetch
fetch("./bebidas.json")
  .then(resp => resp.json())
  .then(data =>{ 
    menus = [...data];
      //recorro datos del json mediante un forEash para mostrar productos en el dom
      menus.forEach(prod => {
      const div = document.createElement('div');
      div.classList.add('producto');
      div.innerHTML += `
      <div class="tarjetas" style="width: 300px">
        <img class="imgProductos" src=${prod.imagen} alt=${prod.nombre} style="width: 320px">
        <h2>${prod.nombre}</h2>
        <p class="precio"><b>$ ${prod.precio} </b></p>
        <p><button class="boton" id="agregar${prod.id}">Agregar al Carrito</button></p>
      </div>
      `;
      contenedorProductos.appendChild(div);

      const boton = document.getElementById(`agregar${prod.id}`);

      boton.addEventListener('click', () => {
          agregarAlCarrito(prod.id);
          //Agrego libreria Toastify para mensaje de agregar
          Toastify({
            text: "Producto agregado",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "#000090",
            },
          }).showToast();
      });
    });
  });

//Agregar items a nuestro carrito
//Verificar si existe o no algun item similar en el carrito y sumarlo
const agregarAlCarrito = (prodId) => {
  const existe = carrito.some(prod => prod.id === prodId);
  if(existe){
    const prod = carrito.map (prod => {
      if (prod.id === prodId){
        prod.cantidad++
      }
    })
  }else{
    const item = menus.find((prod) =>  prod.id === prodId)
    item.cantidad = 1;
    carrito.push(item)
  };
    actualizarCarrito();
};

//Eliminar items del carrito

const eliminarDelCarrito = (prodId) => {
  const item = carrito.find((prod) => prod.id === prodId)
  const indice = carrito.indexOf(item)
  carrito.splice(indice, 1)
  localStorage.setItem('carrito', JSON.stringify(carrito))
  actualizarCarrito()
  //Agrego libreria Toastify para mensaje de eliminar items
  Toastify({
    text: "Producto eliminado",
    duration: 3000,
    gravity: "top",
    position: "left",
    style: {
      background: "red",
    },
  }).showToast();

};

//Mostrar y agregar items dentro del carrito y actualización del localStorage
const actualizarCarrito = () => {
  contenedorCarrito.innerHTML =""; 

  carrito.forEach((prod) => {
    const etiqueta = document.createElement('tr')
    etiqueta.innerHTML =`
      <td class="imagenCarrito"><img src="${prod.imagen}" width="60px"></td>
      <td class="nombreCarrito">${prod.nombre}</td>
      <td class="precioCarrito">$ ${prod.precio}</td>
      <td class="cantidadCarrito"><span id="cantidad">${prod.cantidad} un</span></td>
      <td class="precioTotalCarrito">$ ${prod.precio * prod.cantidad}</td>
      <td><button  onclick= "eliminarDelCarrito(${prod.id})" class="boton-eliminar">X</button><td>
    `
    contenedorCarrito.appendChild(etiqueta);

    localStorage.setItem('carrito', JSON.stringify(carrito));

  });
  //contador de items distintos del carrito
    contadorCarrito.innerText = carrito.length;
    precioTotal.innerText = carrito.reduce((acc, prod)=> acc + prod.precio * prod.cantidad, 0)
};


//finalizo compra, actualizo el carrito y localStorage envio mensajes mediante alertas
finalizarCompra.addEventListener('click', () => {
  if(carrito.length >= 1) {
  carrito.length = 0;
  actualizarCarrito();
  localStorage.clear();
  contenedorCarrito.innerHTML =""; 
  precioTotal.innerText = 0;
  //Agrego libreria sweetalert2 para mensaje de finalizar compra
  Swal.fire({
    title: 'Compra finalizada!',
    text: 'Gracias por elegirnos!!',
    imageUrl: './img/logo.png',
    imageWidth: 150,
    imageHeight: 120,
    imageAlt: 'Custom image',
    background: '#000',
    color: '#fff',
   })
  }else{
  //Agrego libreria sweetalert2 para mensaje de carrito vacio
  Swal.fire({
  title: 'El carrito esta vacio',
  background: '#000',
  color: '#fff',
  });
  };
});