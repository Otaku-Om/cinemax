import React from 'react';
import "./genres.scss";
import { useSelector } from 'react-redux';

function Genres({ data }) {
   const { genres } = useSelector((state) => state.home);
  return (
    <div className='genres'>
      {data?.map((gID) => {
         if(!genres[gID]?.name) return;
         return (
            <div key={gID} className="genre">
               {genres[gID]?.name}
            </div>
         )
      })}
    </div>
  )
}

export default Genres
