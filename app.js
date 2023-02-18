
/*Sesion de paginas */
let pagina = 1;
const btnAnterior = document.getElementById('btnAnterior')
const btnSiguiente = document.getElementById('btnSiguiente')

/*Sesion de botones*/
btnSiguiente.addEventListener('click', () => {
  if(pagina < 1000){
    pagina += 1;
    cargarPeliculas();
  }
})

btnAnterior.addEventListener('click' , () =>{
  if(pagina > 1){
    pagina -= 1;
    cargarPeliculas();
  }
});






const cargarPeliculas = async () =>{
  try{

    const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=110b152ac58bda8df6be0e4245d4d7ca&language=es-ES&page=${pagina}`)
    console.log(respuesta);

    if(respuesta.status === 200){

      const datos = await respuesta.json()

      let peliculas = '';

      datos.results.forEach(pelicula =>{
        peliculas += `
        <div class="columna col-10 col-md-12">
          <div class="row pelicula">
            <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
            <h3 class="titulo">${pelicula.title}</h3>
          </div>
        </div>
        `
        
      })

      /*Insertamos en el HTML el ciclo de las peliculas con el id del contenedor*/
      document.getElementById('contenedor').innerHTML = peliculas;


      /*Con este metodo ponemos la opacidad */
      const posters = document.querySelectorAll('.poster');
      posters.forEach(poster => {
        poster.addEventListener('mouseover', () => {
          poster.classList.add('oscurecer');
        });
        poster.addEventListener('mouseout', () => {
          poster.classList.remove('oscurecer');
        });
      });

    }else{
      console.log('Error inesperado')
    }

  

    }catch(error){
      console.log(error)
    }
  

}
cargarPeliculas();

/*Funcion para filtrar peliculas */

document.getElementById('formBusqueda').addEventListener('submit', (e) => {
  e.preventDefault();
  buscarPeliculas();
});

const buscarPeliculas = async () => {
  try {
    const busqueda = document.getElementById('inputBusqueda').value;

    const respuesta = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=110b152ac58bda8df6be0e4245d4d7ca&language=es-ES&query=${busqueda}`);

    if (respuesta.status === 200 ) {
      const datos = await respuesta.json();

      let peliculas = '';

      datos.results.forEach(pelicula =>{
        peliculas += `
          <div class="pelicula">
            <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
            <h3 class="titulo">${pelicula.title}</h3>
          </div>
        `
      })

      document.getElementById('contenedor').innerHTML = peliculas;

     /*Con este metodo ponemos la opacidad */
      const posters = document.querySelectorAll('.poster');
      posters.forEach(poster => {
        poster.addEventListener('mouseover', () => {
          poster.classList.add('oscurecer');
        });
        poster.addEventListener('mouseout', () => {
          poster.classList.remove('oscurecer');
        });
      });


    } else {
      console.log('Error al realizar la búsqueda');
    }
  } catch (error) {
    console.log(error);
  }
}


/* Verifica si el caudro de busqueda esta vacio*/

const cuadroBusqueda = document.querySelector("#inputBusqueda");
cuadroBusqueda.addEventListener("change", () => {
  // Verificar si el cuadro de búsqueda está vacío
  if (cuadroBusqueda.value === "") {
    pagina = 1; // reiniciar la página a 1
    cargarPeliculas(); // cargar las películas desde el principio
  }
});