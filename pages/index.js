import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const swapgoBg = '/logo/swapgo_b_big_new.png';
const swapgoBgBlack = '/logo/swapgo_b_big.png';
const swapgoTrans = '/logo/swapgo_trans.png';
const swapgo = '/logo/swapgo.png';
const swapgoWhite = '/logo/swapgo_w.png';
const backgroundWhite = '/logo/white.png';
const oceanSound = '/ocean-waves-112906.mp3';

const Page = styled.div`
  * {
    cursor: pointer;
  }
  html,
  body {
    background: #efefef;
    color: #212121;
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    height: 100%;
    overflow: hidden; 
    max-height: 100vh;
  }
  ::selection {
    background: #efefef;
    color: #212121;
    mix-blend-mode: difference;
  }
  ::-moz-selection {
    background: #efefef;
    color: #212121;
  }
  h1, h2, h3, h4, h5 {
    font-weight: 900;
  }
  h1 {
    font-size: 3em;
  }
  .hero-title {
    font-size: 8vw;
    line-height: 1em;
    font-weight: 900;
  }
  .nav-title {
    position: relative;
    width: 250px;
    height: 250px;
    background-image: url(${swapgo});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: background-image 0.3s ease;

    &:hover {
      background-image: url(${swapgoWhite});
    }
  }
  .nav-subTitle {
    margin-left: 15px;
    font-size: 35px;
  }
  a {
    transition: all .25s ease-in-out;
  }
  .white, a.white {
    color: #efefef;
  }
  .black {
    color: #212121;
  }
  .pearl, a.pearl {
    color: #fff;
  }
  .green, a.green {
    color: #00BCD4;
  }
  .pink {
    color: #b73b3b;
  }
  .blend {
    mix-blend-mode: difference !important;
    color: #efefef;
    position: relative;
    z-index: 2;
  }
  .bg-black {
    background-color: #212121;
  }
  .bg-green {
    background-color: #00BCD4;
  }
  .bg-topographic {
    background-image: url(https://assets.codepen.io/319606/bg-topographic.svg);
    background-size: 5000px;
    opacity: .1;
    pointer-events: none;
  }
  .custom-cursor {
    position: fixed;
    opacity: 0;
    pointer-events: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #000;
    transition: transform 350ms ease, background-color 350ms ease;
    transform: translate(-50%, -50%) scale(.3);
    z-index: 1000;
  }
  .custom-cursor--link {
    background-color: #fff;
    transform: translate(-50%, -50%) scale(1.25);
  }
  .swoosh {
    background-size: 100%;
    background-repeat: no-repeat;
    top: 20px;
    left: 18px;
    width: 230px;
    height: 45px;
    z-index: 1000;
    background-position: left;
    color: #fff;
    font-size: 2em;
    display: flex;
    align-items: center;
    justify-content: left;
  }
  .sticky-nav {
    top: 20px;
    left: 20px;
    position: fixed;
    width: calc(100% - 40px);
    z-index: 999;
    
    &.difference {
      background-repeat: no-repeat;
      background-size: contain;
      mix-blend-mode: difference;
      
      #nav-btn {
        filter: invert(0);
      }
    }
    
    .logo {
      width: 220px;
      height: 45px;
      background-image: none;
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: left;
      z-index: 998;
      color: #fff;
      display: flex;
      align-items: center;
      font-size: 2em;
    }
    
    #nav-btn {
      width: 60px;
      z-index: 999;
      filter: invert(1);
      
      .icon {
        position: relative;
        width: 100%; 
        height: 100%;
        fill: none;
        stroke-width: 8;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: #fff;
      }
    }
  }
  
  #takeover-nav {
    position: fixed;
    width: 100vw;
    height: 100vh;
    overflow-y: hidden;
    left: 0;
    top: -200%;
    transition: all .5s ease-in-out;
    z-index: 996;
    
    &.shown {
      top: 0;
    }
    
    .nav-col {
      min-height: 100vh;
      
      a {
        color: #efefef;
        
        &:hover {
          color: #212121;
        }
      }
    }
    
    .nav-contact {
      .content {
        max-width: 700px;
      }
    }
    
    .nav-items {
      font-size: 2.5em;
      font-weight: 700;
    }
    
    .contact-items {
      font-size: 1.25em;
      font-weight: 700;
      
      a:hover {
        color: #00BCD4;
      }
    }
    
    .social {
      font-size: .75em;
      
      a {
        color: #00BCD4;
  
        &:hover {
          color: #efefef;
        }
      }
    }
  }
  
  .gradient-overlay {
    bottom: 0;
    height: 50%;
    background: none; 
    z-index: 1;
    pointer-events: none;
  }
  .video-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-bottom-right-radius: 0vw;
    pointer-events: none;
  }
  #video-bg {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translateX(-50%) translateY(-50%) rotate(180deg) scale(1.3);
    object-fit: cover;
  }
  
  section {
    min-height: 100vh;
    height: 100vh;
    width: 100%;
    
    &.hero {
      background-color: #212121;
      border-bottom-right-radius: 15vw;
      position: relative;
    }
  }
  
  @media screen and (min-width: 1200px) {
    .hero {
      height: 100vh;
    
      #video-bg {
        object-position: 0 5vw;
      }
    }
  }
  
  @media screen and (max-width: 1199px) {
    .hero {
      height: 100vh;
      #video-bg {
        object-position: 0 15vw;
      }
    }
  }
  
  @media screen and (max-width: 575px) {
    header {
      .swoosh {
        width: 165px;
        height: 35px;
        top: 10px;
      }
      .sticky-nav {
        top: 10px;
        
        .logo {
          width: 150px;
          height: 35px;
        }
        
        #nav-btn {
          width: 40px;
        }
      }
      #takeover-nav {
        .contact-items {
          font-size: 1em;
        }
      }
    }
    .hero {
      min-height: 100vh;
      height: 100vh;
      
      .hero-title {
        font-size: 12vw;
      }
      
      #video-bg {
        object-position: 0 30vw;
      }
    }
  }
`;

const Header = styled.header`
  .swoosh {
    background-size: 100%;
    background-repeat: no-repeat;
    top: 20px;
    left: 18px;
    width: 230px;
    height: 45px;
    z-index: 1000;
    background-position: left;
    color: #fff;
    font-size: 2em;
    display: flex;
    align-items: center;
    justify-content: left;
  }
`;

const StickyNav = styled.div`
  top: 20px;
  left: 20px;
  position: fixed;
  width: calc(100% - 40px);
  z-index: 999;
  display: flex;
  justify-content: space-between;

  &.difference {
    background-repeat: no-repeat;
    background-size: contain;

    .blend-difference {
      mix-blend-mode: difference;
    }


    #nav-btn {
      filter: invert(0);
    }
  }

  .logo {
    width: 220px;
    height: 45px;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: left;
    z-index: 998;
    color: #fff;
    display: flex;
    align-items: center;
    font-size: 2em;
  }

  #nav-btn {
    width: 60px;
    z-index: 999;
    filter: invert(1);

    .icon {
      position: relative;
      width: 100%;
      height: 100%;
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke: #fff;
    }
  }
`;

const TakeoverNav = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  left: 0;
  top: -200%;
  transition: all .5s ease-in-out;
  z-index: 996;

  &.shown {
    top: 0;
  }

  .nav-col {
    min-height: 100vh;

    a {
      color: #efefef;

      &:hover {
        color: #212121;
      }
    }
  }

  .nav-contact {
    .content {
      max-width: 700px;
    }
  }

  .nav-items {
    font-size: 2.5em;
    font-weight: 700;
  }

  .contact-items {
    font-size: 1.25em;
    font-weight: 700;

    a:hover {
      color: #00BCD4;
    }
  }

  .social {
    font-size: .75em;

    a {
      color: #00BCD4;

      &:hover {
        color: #efefef;
      }
    }
  }
`;

const Hero = styled.section`
  background-color: #212121;
  border-bottom-right-radius: 15vw;
  position: relative;
  max-height: 100vh;
  height: 100vh;
  width: 100%;

  .logo-background {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    background-color: rgba(0, 0, 0, 0.2); // 可以调整颜色和透明度
    filter: blur(10px);
    z-index: 0;
  }

.hero-title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -200px;
    transition: transform 0.3s ease;
    position: relative;
    z-index: 2;

    &:hover {
      transform: scale(1.05);
    }

    img {
      width: 100%;
      max-width: 600px;
      transition: opacity 0.3s ease;
    }
  }

  .hero-title-black {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.3s ease;

    img {
      width: 100%;
      max-width: 600px;
    }
  }

  .hero-title:hover {
    .hero-title-white {
      opacity: 0;
    }
    .hero-title-black {
      opacity: 1;
    }
  }

  @media screen and (min-width: 1200px) {
    height: 100vh;

    #video-bg {
      object-position: 0 5vw;
    }
  }

  @media screen and (max-width: 1199px) {
    height: 100vh;
    #video-bg {
      object-position: 0 15vw;
    }
  }

  @media screen and (max-width: 575px) {
    min-height: 100vh;
    height: 100vh;

    .hero-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .hero-title {
      position: relative;
      z-index: 2;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }

      img {
        width: 100%;
        max-width: 600px;
      }
    }

    #video-bg {
      object-position: 0 30vw;
    }
  }

  .hero-title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -300px;

    img {
      width: 100%;
      max-width: 600px;
    }
  }

  .background-white {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    background-image: url(${backgroundWhite});
    background-size: cover;
    background-position: center;
    opacity: 0.5;
    filter: blur(10px);
    transition: opacity 0.3s ease;
    z-index: 1;
  }

  .hero-title:hover + .background-white {
    opacity: 0;
  }
`;

const CustomCursor = styled.div`
  position: fixed;
  opacity: 0;
  pointer-events: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #000;
  transition: transform 350ms ease, background-color 350ms ease;
  transform: translate(-50%, -50%) scale(.3);
  z-index: 1000;

  &.custom-cursor--link {
    background-color: #fff;
    transform: translate(-50%, -50%) scale(1.25);
  }
`;

const AudioPlayer = styled.div`
  position: fixed;
  top: 50%;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 10px;
  border-radius: 10px;
  width: 120px;

  button {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    width: 20px;
    cursor: pointer;
    margin-right: 10px;
  }

  .volume-control {
    width: 70px;
  }
`;

const useCustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, button, #nav-btn, input.btn');
    let initCursor = false;

    links.forEach(link => {
      link.addEventListener('mouseover', () => {
        cursor.classList.add('custom-cursor--link');
      });
      link.addEventListener('mouseout', () => {
        cursor.classList.remove('custom-cursor--link');
      });
    });

    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (!initCursor) {
        cursor.style.opacity = 1;
        initCursor = true;
      }

      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const handleTouchMove = (e) => {
      const mouseX = e.touches[0].clientX;
      const mouseY = e.touches[0].clientY;

      if (!initCursor) {
        cursor.style.opacity = 1;
        initCursor = true;
      }

      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const handleMouseOut = () => {
      cursor.style.opacity = 0;
      initCursor = false;
    };

    const handleTouchStart = () => {
      cursor.style.opacity = 1;
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        cursor.style.opacity = 0;
      }, 200);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
};

const useMenuToggle = () => {
  useEffect(() => {
    const navBtn = document.getElementById('nav-btn');
    const takeoverNav = document.getElementById('takeover-nav');
    const stickyNav = document.querySelector('.sticky-nav');

    navBtn.addEventListener('click', () => {
      takeoverNav.classList.toggle('shown');
      stickyNav.classList.toggle('difference');
      navBtn.classList.toggle('active');
    });
  }, []);
};


export default function Home() {
  useCustomCursor();
  useMenuToggle();

  const router = useRouter();

  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.log("Audio autoplay was prevented:", error);
          setIsPlaying(false);
        });
      }
    };

    playAudio();

    const handleInteraction = () => {
      playAudio();
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().then(() => {
          let vol = 0;
          const interval = setInterval(() => {
            vol += 0.1;
            if (vol <= volume) {
              audioRef.current.volume = vol;
            } else {
              clearInterval(interval);
            }
          }, 100);
        }).catch(error => console.log("Audio autoplay was prevented:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <Page>
      <Header>
        <StickyNav className="sticky-nav d-flex justify-content-between mt-10">
          <div className="logo" style={{ opacity: 0.65}} onClick={() => router.push('/')} >                    
            <img src={swapgoTrans} width={120} alt="swapgo logo navbar"></img>
          </div>
          <div id="nav-btn" className="menu box bg-blend-luminosity">
            <svg id="i1" className="icon" viewBox="20 30 60 40">
              <path id="top-line-1" d="M30,37 L70,37 Z"></path>
              <path id="middle-line-1" d="M30,50 L70,50 Z"></path>
              <path id="bottom-line-1" d="M30,63 L70,63 Z"></path>
            </svg>
          </div>
        </StickyNav>
        <TakeoverNav id="takeover-nav">
          <div className="container-fluid h-full flex">
            <div className="nav-col nav-contact w-1/4 bg-black flex flex-col justify-center items-center relative py-5 px-3">
              <div className="absolute w-full h-full bg-topographic"></div>
              <div className="relative mt-36 ml-5">
                <div className="nav-title white mb-5" onClick={() => router.push('/SWAPGO/start')}>
                </div>
              </div>
            </div>
            <div className="nav-col nav-menu bg-green flex flex-col justify-center items-center pt-5 pb-3 px-[7px]">
              {/* <ul className="nav-items list-unstyled text-center"> */}
                {/* <li className="pb-3">
                  <a className="text-decoration-none" href="#">services</a>
                </li>
                <li className="pb-3">
                  <a className="text-decoration-none" href="#">portfolio</a>
                </li>
                <li className="pb-3">
                  <a className="text-decoration-none" href="#">contact</a>
                </li>
                <li>
                  <a className="text-decoration-none" href="#">about</a>
                </li> */}
              {/* </ul> */}
            </div>
          </div>
        </TakeoverNav>
      </Header>
      <Hero className="hero d-flex justify-content-center">
        <div className="video-wrap">
          <video autoPlay playsInline loop muted id="video-bg">
            <source src="https://tactusmarketing.com/wp-content/uploads/tactus-waves-hero.mp4" 
                    type="video/mp4" />
          </video>
        </div>
        <div className="position-absolute w-100 gradient-overlay"></div>
        <div className="logo-background"></div>
        <div className="content position-relative text-center ">
          <div className="hero-title blend flex justify-center" onClick={() => router.push('/SWAPGO/start')}>
            <div className="hero-title-white">
              <img src={swapgoBg} alt="SwapGo" />
            </div>
            <div className="hero-title-black">
              <img src={swapgoBgBlack} alt="SwapGo" />
            </div>
          </div>
        </div>
      </Hero>
      <CustomCursor className="custom-cursor"></CustomCursor>
      <audio ref={audioRef} loop preload="auto">
        <source src={oceanSound} type="audio/mpeg" />
      </audio>
      <AudioPlayer>
        <button onClick={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-control"
        />
      </AudioPlayer>
      <CustomCursor className="custom-cursor"></CustomCursor>
    </Page>
  );
}


         {/* <ul className="contact-items white list-unstyled mb-5">
              <li className="pb-4">
                <a className="text-decoration-none" href="#">+1 386-235-4062</a>
              </li>
              <li className="pb-4">
                <a className="text-decoration-none" href="#">morgan@tactusmarketing.com</a>
              </li>
              <li>
                <a className="text-decoration-none" href="#">Aguadilla, PR 00603</a>
              </li>
            </ul>
            <div className="social">
              <a className="text-decoration-none green" href="#">linkedin</a>
              <span className="mx-2 white">|</span>
              <a className="text-decoration-none green" href="#">facebook</a>
              <span className="mx-2 white">|</span>
              <a className="text-decoration-none green" href="#">instagram</a>
            </div> */}

                        {/* <ul className="nav-items list-unstyled text-center"> */}
                {/* <li className="pb-3">
                  <a className="text-decoration-none" href="#">services</a>
                </li>
                <li className="pb-3">
                  <a className="text-decoration-none" href="#">portfolio</a>
                </li>
                <li className="pb-3">
                  <a className="text-decoration-none" href="#">contact</a>
                </li>
                <li>
                  <a className="text-decoration-none" href="#">about</a>
                </li> */}
              {/* </ul> */}


// Copyright (c) 2024 - YOSGO - https://codepen.io/jalinb/pen/ExOgOBZ

// Permission is hereby granted, free of charge, to any person 
// obtaining a copy of this software and associated documentation 
// files (the "Software"), to deal in the Software without restriction,
//  including without limitation the rights to use, copy, modify, 
// merge, publish, distribute, sublicense, and/or sell copies of 
// the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall 
// be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.// Copyright (c) 2024 - YOSGO - https://codepen.io/jalinb/pen/ExOgOBZ