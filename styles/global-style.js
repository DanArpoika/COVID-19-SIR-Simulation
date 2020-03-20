import { createGlobalStyle } from 'styled-components';
import { rem } from 'polished';

const GlobalStyle = createGlobalStyle`
  :root {
    --container-width: 1240px;
  }

  *,
  *::before,
  *::after { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ${props => props.theme.mainFont};
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    background-color: ${props => props.theme.background};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    font-weight: 600;
    line-height: 1;
    color: inherit;
  }

  h1 {
    font-size: ${rem(40)};
  }

  h3 {
    font-size: ${rem(30)};
  }

  img { max-width: 100%; }
  figure { margin: 0; }
  form { position: relative; }
`;

export default GlobalStyle;
