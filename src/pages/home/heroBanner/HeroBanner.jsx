import React, { useEffect, useState } from 'react';
import "./heroBanner.scss";
import { useNavigate } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import { useSelector } from 'react-redux';
import Img from '../../../components/lazyLoadImage/Img';
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper';

function HeroBanner() {
  const navigate = useNavigate();
  const [background, setBackground] = useState("");//so after every refresh we call api and got new img
  const [query, setQuery] = useState("");
  const { data, loading } = useFetch("/movie/upcoming");
  const {url} = useSelector((state) => state.home);

  useEffect(() => {
    const bg = url.backdrop + data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
    setBackground(bg);
  }, [data])

  function searchQueryHandler(event){
    if(event.key === "Enter" && query.length > 0){
      navigate(`/search/${query}`);
    }
  }

  return (
    <div className='heroBanner'>
      {!loading && <div className="heroBanner-bgimg">
         <Img src={background} />
      </div>}

      <div className="opacity-layer"></div>

      <ContentWrapper>
        <div className="heroBanner-content">
          <h1 className="title">Welcome.</h1>
          <h3 className="subtitle">Millions of movies, TV shows and people to discover. Explore now.</h3>
        </div>

        <div className="heroBanner-searchInput">
          <input
            id='search'
            type="text" 
            placeholder='Search for a movie or tv show....'
            onKeyUp={searchQueryHandler}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button>Search</button>
        </div>
      </ContentWrapper>
    </div>
  )
}

export default HeroBanner
