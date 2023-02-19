
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
    const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=110b152ac58bda8df6be0e4245d4d7ca&language=es-ES&page=${pagina}`);
      if (respuesta.status !== 200) {
        // Manejar el error si la respuesta no es exitosa

        console.error('Error al obtener las películas populares');
        return;

      }
      const datosPopulares = await respuesta.json();
      
      // Obtener los datos de las películas con mejores calificaciones
      const calificacion = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=110b152ac58bda8df6be0e4245d4d7ca&language=es-ES&page=${pagina}`);
      const datosCalificaciones = await calificacion.json();
      
      // Generar el HTML para mostrar las películas y sus calificaciones

      let peliculas = '';

      datosPopulares.results.forEach(pelicula => {

        // Buscar la calificación de la película en los datos de calificaciones

        const peliculaConCalificacion = datosCalificaciones.results.find(peliculaCalificada => peliculaCalificada.id === pelicula.id);

        // Obtener la calificación de la película o mostrar un mensaje alternativo si no tiene calificación

        const calificacion = peliculaConCalificacion ? peliculaConCalificacion.vote_average : '<span class="sin-calificacion">☆☆☆☆☆ <br> Sin calificación</span>';
        

      // Calcular el número de estrellas a mostrar (entre 0 y 5)
        const numEstrellas = Math.round(calificacion / 2);

      // Generar el HTML para mostrar la película y su calificación

        peliculas += `
        <div class="columna col-10 col-md-12">
        <div class="row pelicula">
          <a href="#" id="btnPelicula">
            <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
          </a>
          <h3 class="titulo">${pelicula.title}</h3>
          <div class="estrellas">
            ${'★'.repeat(numEstrellas)}
            ${'☆'.repeat(5 - numEstrellas)}
          </div>
          <p class="calificacion">${calificacion}</p>
        </div>
      </div>
        `;
      });
      
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
            <a id="btnPelicula">
              <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
            </a>
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

