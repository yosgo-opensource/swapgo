import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import StyledVideoWrapper from './StyledVideoWrapper';
import propTypes from 'prop-types';

const VideoPlayer = ({ poster, src }) => {

  const videoRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (videoRef.current) {
        const player = videojs(videoRef.current, {
          controls: true,
          preload: 'auto',
          poster: poster,
          loop: true,
        });

        return () => {
          if (player) {
            player.dispose();
          }
        };
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [poster, src]);

  return (
    <StyledVideoWrapper>
      <video
        ref={videoRef}
        id="my-video"
        className="video-js my-video-player"
        controls
        preload="auto"
      >
        <source
          src={src}
          type="video/mp4"
        />
      </video>
    </StyledVideoWrapper>
  );
};

VideoPlayer.propTypes = {
  poster: propTypes.string.isRequired,
  src: propTypes.string.isRequired,
};


export default VideoPlayer;
