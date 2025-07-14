import React from 'react'
import Search from './components/Search.jsx'
import { useState, useEffect } from 'react'
//In React, useEffect is a Hook that lets you run code as a side effect of rendering.
//This means it’s used for things that happen outside of directly rendering UI, like:
//Fetching data from an API
//Working with timers (e.g., setInterval, setTimeout)
//Listening to events (e.g., window resize)
//Manually changing the DOM
//Logging values to the console

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  //Cannot change searchMovie, only change it by changing setMovieSearch
  const [searchMovie, setSearchMovie] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const fetchMovie = async () => {
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint,API_OPTIONS);

      //alert(response);
      //throw new Error("Failed to fetch movies");
    }
    catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again.')
    }
  }

  useEffect(() => {
    fetchMovie();
  });

  return (
    <main>
      <div className = "pattern"/>

      <div className = "wrapper">
        <header>
          <img src = "./hero-img.png" alt = "Hero Banner"></img>
          <h1>Find <span className = "text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchMovie = {searchMovie} setSearchMovie = {setSearchMovie}/>
        </header>

        <section className = "all-movies">
          <h2>All Movies</h2>
          {/*}A && B means: If A is truthy, then return B*/}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </main>
  )
}

export default App



// const Card = ({ title }) => {
//   const [like, setLiked] = useState(false);
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     console.log(`${title} has been liked: ${like}`);
//   }, [like]); 

//     return (
//       <div className = 'card' onClick = {() => setCount(count + 1)}>
//         <h2>{title} <br/> {count ? count : null}</h2>

//         <button onClick = {() => setLiked(!like)}>
//           { like ? "❤️" : "🤍" }
//         </button>
//       </div>
//     )
// }

// const App = () => {

//   return (
//     <div className = "card-container">
//       <Card title = "Star Wars"/>
//       <Card title = "Spider-Man"/>
//       <Card title = "Avengers"/>
//     </div>
    
//   )
// }

// export default App
