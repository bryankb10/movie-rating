import React from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useState, useEffect } from 'react'
import { useDebounce } from 'react-use'
import { updateSearchCount, getTrendingMovies } from './appwrite.js'

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
  //useState is to create state variables inside your functional component. It lets your component "remember" values across renders.
  //Cannot change searchMovie, only change it by changing setMovieSearch
  const [searchMovie, setSearchMovie] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [trending, setTrending] = useState([]);

  useDebounce(() => setDebouncedSearch(searchMovie),700,[searchMovie]);

  const fetchMovie = async (query = '') => {
    setLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query 
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint,API_OPTIONS);

      //alert(response);
      //throw new Error("Failed to fetch movies");

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if (data.Response == "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      console.log(data);
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0]);
      }

    }
    catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again.')
    }
    finally {
      setLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movie = await getTrendingMovies();

      setTrending(movie);
    }
    catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovie(debouncedSearch);
  }, [debouncedSearch]);

    useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className = "pattern"/>

      <div className = "wrapper">
        <header>
          <img src = "./hero-img.png" alt = "Hero Banner"></img>
          <h1>Find <span className = "text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchMovie = {searchMovie} setSearchMovie = {setSearchMovie}/>
        </header>

        {trending.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trending.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src = {movie.poster_url} alt = {movie.title}/>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className = "all-movies">
          <h2 className = "mt-[40px]">All Movies</h2>

          {/*A && B means: If A is truthy, then return B*/}
          {
            loading ? (
              <Spinner/>
            ) : errorMessage ? (
              <p className = "text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )
          }

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
