import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function HomePage() {
  const navigate = useNavigate();
  const [featuredGames, setFeaturedGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [genreGames, setGenreGames] = useState({
    Shooter: [],
    Adventure: [],
    Platform: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carouselRefs = useRef({});

  // Helper function to check for duplicates
  const isDuplicate = (game, existingGames) => {
    return existingGames.some((existingGame) => existingGame.igdb_id === game.igdb_id);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const allGames = [];

        // Fetch Featured Games
        const featuredResponse = [];
        for (let i = 0; i < 5; i++) {
          let validGame = null;
          while (!validGame) {
            const randomId = Math.floor(Math.random() * 20000) + 1;
            try {
              const response = await axios.get(`http://localhost:5001/api/games/${randomId}`);
              if (!isDuplicate(response.data, allGames)) {
                validGame = response.data;
                featuredResponse.push(validGame);
                allGames.push(validGame);
              }
            } catch {
              console.warn(`Game not found for ID: ${randomId}. Retrying...`);
            }
          }
        }
        setFeaturedGames(featuredResponse);

        // Fetch Popular Games
        const popularResponse = await axios.get('http://localhost:5001/api/games/popular');
        const filteredPopularGames = popularResponse.data.filter(
          (game) => !isDuplicate(game, allGames)
        );
        setPopularGames(filteredPopularGames);
        allGames.push(...filteredPopularGames);

        // Fetch Games by Genre
        const [shooterResponse, adventureResponse, platformResponse] = await Promise.all([
          axios.get('http://localhost:5001/api/games/genre/shooter'),
          axios.get('http://localhost:5001/api/games/genre/adventure'),
          axios.get('http://localhost:5001/api/games/genre/platform'),
        ]);

        setGenreGames({
          Shooter: shooterResponse.data.filter((game) => !isDuplicate(game, allGames)),
          Adventure: adventureResponse.data.filter((game) => !isDuplicate(game, allGames)),
          Platform: platformResponse.data.filter((game) => !isDuplicate(game, allGames)),
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching games.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleGameClick = (id) => {
    navigate(`/game/${id}`);
  };

  const scrollCarousel = (genre, direction) => {
    const carousel = carouselRefs.current[genre];
    if (carousel) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      carousel.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h2 className="hero-title">Discover Your Next Adventure</h2>
        <p className="hero-subtitle">Explore featured games, popular picks, and games by genre!</p>
      </section>

      {/* Featured Games Section */}
      <section className="featured-games">
        <h3 className="section-title">Featured Games</h3>
        <div className="featured-games-container">
          {featuredGames.map((game) => (
            <div
              key={game.igdb_id}
              className="game-card"
              onClick={() => handleGameClick(game.igdb_id)}
            >
              <img
                src={game.cover_url || 'placeholder-image-url'}
                alt={game.name}
                className="game-card-image"
              />
              <h4 className="game-card-title">{game.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="popular-games">
        <h3 className="section-title">Popular Games</h3>
        <div className="carousel-wrapper">
          <button
            className="carousel-button carousel-button-left"
            onClick={() => scrollCarousel('Popular', 'left')}
          >
            &#8249;
          </button>
          <div
            className="carousel-container"
            ref={(el) => (carouselRefs.current['Popular'] = el)}
          >
            {popularGames.map((game) => (
              <div
                key={game.igdb_id}
                className="carousel-item"
                onClick={() => handleGameClick(game.igdb_id)}
              >
                <img
                  src={game.cover_url || 'placeholder-image-url'}
                  alt={game.name}
                  className="carousel-item-image"
                />
                <p className="carousel-item-title">{game.name}</p>
              </div>
            ))}
          </div>
          <button
            className="carousel-button carousel-button-right"
            onClick={() => scrollCarousel('Popular', 'right')}
          >
            &#8250;
          </button>
        </div>
      </section>

      {/* Games by Genre Section */}
      <section className="genre-games">
        {Object.entries(genreGames).map(([genre, games]) => (
          <div key={genre} className="genre-section">
            <h3 className="section-title">{genre} Games</h3>
            <div className="carousel-wrapper">
              <button
                className="carousel-button carousel-button-left"
                onClick={() => scrollCarousel(genre, 'left')}
              >
                &#8249;
              </button>
              <div
                className="carousel-container"
                ref={(el) => (carouselRefs.current[genre] = el)}
              >
                {games.map((game) => (
                  <div
                    key={game.igdb_id}
                    className="carousel-item"
                    onClick={() => handleGameClick(game.igdb_id)}
                  >
                    <img
                      src={game.cover_url || 'placeholder-image-url'}
                      alt={game.name}
                      className="carousel-item-image"
                    />
                    <p className="carousel-item-title">{game.name}</p>
                  </div>
                ))}
              </div>
              <button
                className="carousel-button carousel-button-right"
                onClick={() => scrollCarousel(genre, 'right')}
              >
                &#8250;
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HomePage;
