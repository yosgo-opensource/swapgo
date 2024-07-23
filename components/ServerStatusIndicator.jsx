import { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';

const StatusDot = styled.div`
  position: fixed;
  ${props => props.position === 'left' ? 'top: 10px; left: 10px;' : 'top: 10px; right: 10px;'}
  width: 12px;
  height: 12px;
  border-radius: 50%;

  ${props => css`
    background-color: ${props.$isUp ? '#4CAF50' : '#9E9E9E'};
  `}
  
  z-index: 1000;
  transition: background-color 0.3s ease;
  
  &:hover::after {
    content: '${props => props.$isUp ? 'Server is up' : 'Server is down'}';
    position: absolute;
    ${props => props.position === 'left' ? 'left: 20px;' : 'right: 20px;'}
    top: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const ServerStatusIndicator = ({ position = 'right' }) => {
  const [isServerUp, setIsServerUp] = useState(true);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await axios.get('https://swapgo.yosgo.com/ping', { timeout: 5000 });
        setIsServerUp(response.data === 'pong');
      } catch (error) {
        setIsServerUp(false);
      }
    };

    checkServerStatus(); 
    const intervalId = setInterval(checkServerStatus, 30000); 

    return () => clearInterval(intervalId);
  }, []);

  return <StatusDot $isUp={isServerUp} position={position} />;
};

export default ServerStatusIndicator;