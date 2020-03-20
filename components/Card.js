import styled from 'styled-components';
import screen from 'superior-mq';

const Card = styled.div`
  background-color: ${props => props.theme.white};
  box-shadow: 0px 4px 26px -3px rgba(0,0,0,0.61);
  border-radius: ${props => props.theme.borderRadius};
  padding: 20px;
  margin: 20px 0;

  ${screen.below('992px', `
    margin: 10px 0;
  `)}
`;

export default Card;
