import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';
import "./searchResult.scss";
import InfiniteScroll from 'react-infinite-scroll-component';
import ContentWrapper from '../../components/contentWrapper/ContentWrapper';
import noResults from "../../assets/no-results.png";
import Spinner from '../../components/spinner/Spinner';
import MovieCard from '../../components/movieCard/MovieCard';

function SearchResult() {

  const [data, setData] = useState(null); // to store the data
  const [pageNum, setPageNum] = useState(1); // to store the page as as amx data we got is 20 i.e. pagination
  const [loading, setLoading] = useState(false);
  const { query } = useParams(); // through react-router-dom that path we have provided in the app.js searchResults

  const fetchInitialData = () => {
    setLoading(true)
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`)
    .then((res) => {
      setData(res);
      setPageNum((prev) => prev + 1);
      setLoading(false);
    });
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`)
    .then((res) => {
      if(data?.results){
        setData({
          ...data,
          results: [...data?.results, ...res?.results]
          
        })
      }else{
        setData(res);
      }
      setPageNum((prev) => prev + 1);
    })
  }

  useEffect(() => {
    setPageNum(1);
    fetchInitialData();
  }, [query])

  return (
    <div className='searchResultsPage'>
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search ${data?.total_results > 1 ? "results" : "result"} of '${query}'`}
              </div>
              <InfiniteScroll
                className='content'
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.results?.map((item, index) => {
                  if(item.media_type === "person") return;
                  return (
                    <MovieCard key={index} data={item} fromSearch={true} />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <div className='resultNotFound'>
              <span className="resultNotFoundText">Sorry, Result Not Found</span>
              <img src={noResults} alt="noResult" />
            </div>
          )}
        </ContentWrapper>
      )}
    </div>
  )
}

export default SearchResult
