import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import "./detailsBanner.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../PlayIcon";
import VideoPopup from "../../../components/videoPopup/VideoPopup";

const DetailsBanner = ({ video, crew }) => {
	// console.log(video)
	// console.log(crew)
  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}`);
  const { url } = useSelector((state) => state.home);
  const directors = crew?.filter((f) => f.job === "Director");
  const writers = crew?.filter((f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer");
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours > 0 ? `${hours}h` : ""}${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  const _genres = data?.genres?.map((item) => item.id);

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!data && (
            <React.Fragment>
              <div className="backdrop-img">
                <Img src={url?.backdrop + data?.backdrop_path} />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data?.poster_path ? (
                      <Img
                        src={url?.poster + data?.poster_path}
                        className="posterImg"
                      />
                    ) : (
                      <Img src={PosterFallback} className="posterImg" />
                    )}
                  </div>
                  <div className="right">
							<div className="title">
								{`${data?.title || data?.name} (${dayjs(data?.release_date).format("YYYY") || dayjs(data?.last_air_date).format("YYYY")})`}
							</div>
							<div className="subtitle">
								{data?.tagline}
							</div>
							<div className="genres">
								<Genres data={_genres} />
							</div>
							<div className="row">
								<CircleRating rating={data?.vote_average?.toFixed(1)} />
								<div className="playbtn" onClick={() => {
									setShow(true)
									setVideoId(video?.key)
								}}>
									<PlayIcon />
									<span className="text">Watch Trailer</span>
								</div>
							</div>
							<div className="overview">
								<div className="heading">
									Overview
								</div>
								<div className="description">
									{data?.overview}
								</div>
							</div>
							<div className="info">
								{data?.status && (
									<div className="infoItem">
										<span className="text bold">
											Status:{" "}
										</span>
										<span className="text">
											{data?.status}
										</span>
									</div>
								)}
								{(data?.release_date || data?.last_air_date) && (
									<div className="infoItem">
										<span className="text bold">
											Release Date:{" "}
										</span>
										<span className="text">
											{dayjs(data?.release_date).format("MMM D, YYYY") || dayjs(data?.last_air_date).format("MMM D, YYYY")}
										</span>
									</div>
								)}
								{(data?.runtime || data?.episode_run_time) && (
									<div className="infoItem">
										<span className="text bold">
											Runtime:{" "}
										</span>
										<span className="text">
											{data?.runtime ? toHoursAndMinutes(data?.runtime) : toHoursAndMinutes(data?.episode_run_time)}
										</span>
									</div>
								)}
							</div>
							{directors?.length > 0 && (
								<div className="info">
									<span className="text bold">
										Director:{" "}
									</span>
									<span className="text">
										{directors?.map((d, i) =>(
											<span key={i}>
												{d?.name}
												{directors?.length - 1 !== i && ", "}
											</span>
										))}
									</span>
								</div>
							)}
							{writers?.length > 0 && (
								<div className="info">
									<span className="text bold">
										Writer:{" "}
									</span>
									<span className="text">
										{writers?.map((d, i) =>(
											<span key={i}>
												{d?.name}
												{writers?.length - 1 !== i && ", "}
											</span>
										))}
									</span>
								</div>
							)}
							{data?.created_by?.length > 0 && (
								<div className="info">
									<span className="text bold">
										Creator:{" "}
									</span>
									<span className="text">
										{data?.created_by?.map((d, i) =>(
											<span key={i}>
												{d?.name}
												{data?.created_by?.length - 1 !== i && ", "}
											</span>
										))}
									</span>
								</div>
							)}
						</div>
                </div>
					 <VideoPopup
						show={show}
						setShow={setShow}
						videoId={videoId}
						setVideoId={setVideoId}
					 />
              </ContentWrapper>
            </React.Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;
