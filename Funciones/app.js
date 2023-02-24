
/*Sesion de paginas */
let pagina = 1;

/*Mostrar en que pagina me encuentro */

const btnAnterior = document.getElementById('btnAnterior')
const btnSiguiente = document.getElementById('btnSiguiente')

/*Sesion de botones
  1. Ciclo para pasar de pagina.
  2. Ciclo para muestre en que pagina nos encontramos 
*/
btnSiguiente.addEventListener('click', () => {
  if(pagina < 1000){
    pagina += 1;
    let paginaNumero = document.getElementById('pagina-numero');
    paginaNumero.textContent = pagina;
    cargarPeliculas();
  }
})

btnAnterior.addEventListener('click' , () =>{
  if(pagina > 1){
    pagina -= 1;
    let paginaNumero = document.getElementById('pagina-numero');
    paginaNumero.textContent = pagina;
    cargarPeliculas();
  }
});




const cargarPeliculas = async () => {
  try {
    const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=110b152ac58bda8df6be0e4245d4d7ca&language=es-ES&page=${pagina}`);

    if (respuesta.status !== 200) {
      console.error('Error al obtener las películas populares');
      return;
    }

    const datosPopulares = await respuesta.json();

    // Obtener los datos de las películas con mejores calificaciones
    const calificacion = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=110b152ac58bda8df6be0e4245d4d7ca&language=es-ES&page=${pagina}`);
    const datosCalificaciones = await calificacion.json();

    // Obtener la lista de géneros
    const generos = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=110b152ac58bda8df6be0e4245d4d7ca&language=es-ES`);
    const datosGeneros = await generos.json();

    // Generar el HTML para mostrar las películas y sus calificaciones
    let peliculas = '';

    function generarCalificacionAleatoria() {
      return (Math.random() * 9 + 1).toFixed(1);
    }

    datosPopulares.results.forEach(pelicula => {
      // Obtener el ID de la película
      // Fecha en letras
      const fecha = new Date(pelicula.release_date);
      const fechaEnLetras = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

      // Buscar la calificación de la película en los datos de calificaciones
      const peliculaConCalificacion = datosCalificaciones.results.find(peliculaCalificada => peliculaCalificada.id === pelicula.id);

      // Obtener la calificación de la película o asignar una calificación aleatoria si no tiene
      let calificacion = peliculaConCalificacion ? peliculaConCalificacion.vote_average : generarCalificacionAleatoria();

      // Calcular el número de estrellas a mostrar (entre 0 y 5)
      const numEstrellas = Math.round(calificacion / 2);

      // Obtener los géneros de la película
      const generosPelicula = pelicula.genre_ids.map(generoID => {
        const genero = datosGeneros.genres.find(genero => genero.id === generoID);
        return genero ? genero.name : 'Desconocido';
      });
      
      // Generar el HTML para mostrar la película y su calificación
      peliculas += `
      <div class="columna col-10 col-md-12">
        <div class="row pelicula">
          <a href="#" class="btn-pelicula" data-id="${pelicula.id}">
            <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
          </a>
          <h3 class="titulo">${pelicula.title}</h3>
          <div class="estrellas">
            ${'★'.repeat(numEstrellas)}
            ${'☆'.repeat(5 - numEstrellas)}
          </div>
          <p class="calificacion">${calificacion}</p>
          <p>Fecha de lanzamiento: ${fechaEnLetras}</p>
          <p>Géneros: ${generosPelicula.join(', ')}</p>
        </div>
      </div>`;
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


    //Obtener los generos de las peliculas
    const ObtenerGeneros = async (idPelicula) =>{
      try{
        const Generos = await fetch(`https://api.themoviedb.org/3/movie/${idPelicula}?api_key=110b152ac58bda8df6be0e4245d4d7ca&language=es-ES&page=${pagina}`)
        const datosPelicula = await Generos.json();
        console.log(datosPelicula.genres); // Imprime los géneros de la película
      }catch(error){
        console.log(error)
      }
    }


    // Obtener las reseñas de las películas
    const FiltrarReseñas = async (idPelicula) => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${idPelicula}/reviews?api_key=110b152ac58bda8df6be0e4245d4d7ca&language=es-ES`);
        const reseñas = await res.json();
        console.log(reseñas.results);
      } catch (error) {
        console.log(error);
      }
    };

    // Agregar evento click al botón de la película para mostrar las reseñas en la consola
    const obtenerReseñas = document.querySelectorAll('.btn-pelicula');
    obtenerReseñas.forEach(poster => {
      const idPelicula = poster.dataset.id;
      poster.addEventListener('click', () => {
        FiltrarReseñas(idPelicula);
      });
    });

}catch(error){
  console.log(error);
}
};
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