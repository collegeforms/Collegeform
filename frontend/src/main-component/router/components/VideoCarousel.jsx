import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import YouTube from 'react-youtube';
import './VideoCarousel.css';

const VideoCarousel = () => {
  const videoIds = [
    'dQw4w9WgXcQ', // Sample video IDs
    '9bZkp7q19f0',
    'kJQP7kiw5Fk',
    'JGwWNGJdvx8',
    'QH2-TGUlwu4',
    'nYh-n7EOtMA'
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [playingVideo, setPlayingVideo] = useState(null);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  const opts = {
    height: '360',
    width: '640',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0
    },
  };

  return (
    <div className="video-carousel">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {videoIds.map((id) => (
            <div className="embla__slide" key={id}>
              <div className="video-thumb" onClick={() => setPlayingVideo(id)}>
                <img
                  src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                />
                <div className="play-button">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        className="embla__button embla__button--prev"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
      >
        <svg viewBox="0 0 24 24">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
        </svg>
      </button>
      <button 
        className="embla__button embla__button--next"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
      >
        <svg viewBox="0 0 24 24">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </button>

      {playingVideo && (
        <div className="video-modal" onClick={() => setPlayingVideo(null)}>
          <div className="video-modal__content" onClick={(e) => e.stopPropagation()}>
            <YouTube videoId={playingVideo} opts={opts} />
            <button 
              className="video-modal__close"
              onClick={() => setPlayingVideo(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;