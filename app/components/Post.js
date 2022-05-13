"use strict"

const d = document,
 $cardContainer = d.querySelector(".cards__container"),
 $links = d.querySelector(".links"),
$template=d.querySelector('template')
 let pokeAPI = "https://pokeapi.co/api/v2/pokemon/";

 async function loadPokemons (url) {
     try {
        $cardContainer.innerHTML = `<img class="loader" src="app/assets/oval.svg" alt="Cargando...">`;

         let res = await fetch(url),
          json = await res.json(),
          $template = "",
          $prevLink,
          $nextLink;

          if (!res.ok) throw { status: res.status, statusText: res };

          for (let i = 0; i < json.results.length; i++) {
              try {
                  let res = await fetch (json.results[i].url),
                  pokemon = await res.json();

                  if (!res.ok) 
                   throw { status: res.status, statusText: res.statusText };
                
                   $template += `
                     <div class="card__container">
                      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" >
                      <div class="text__container">
                    <figcaption>${pokemon.name}</figcaption>
                      </div>
                      </div>
                   `;
              } catch (err) {
                  
                  let message = err.statusText || "Ocurrio un error";
                  $template += `
                    <figure>
                        <figcaption> Error ${err.status}: ${message}</figcaption>
                    </figure>
                  `;
              }
          } //Acaba el ciclo for
         
        $cardContainer.innerHTML = $template;
        $prevLink = json.previous ? `<a href="${json.previous}">&#11013;&#65039;</a>` :  "";
        $nextLink = json.next ? `<a href="${json.next}">&#10145;&#65039;</a>` : "";
        $links.innerHTML = $prevLink + " " + $nextLink;
     } catch (err) {
        console.log(err)
         let message = err.statusText || "Ocurrio un error";
         $cardContainer.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
     }
 }

 d.addEventListener("DOMContentLoaded", (e) => loadPokemons(pokeAPI));

d.addEventListener("click", e => {
    if (e.target.matches(".links a")) {
        e.preventDefault();
        loadPokemons(e.target.getAttribute("href"));
    }
});