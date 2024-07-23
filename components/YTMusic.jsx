import ReactPlayer from "react-player";

export default function YTMusic(){
    return (
      <div style={{ position: "absolute", zIndex: -9999, opacity: 0 }}>
        <ReactPlayer
          url={"https://www.youtube.com/watch?v=jZSquuCHVZA"}
          width={320}
          height={180}
          volume={1}
          playsinline={true}
          playing={true}
          loop={true}
          aria-label="Background Battlefield Music"
        />
      </div>
    );
  };
  