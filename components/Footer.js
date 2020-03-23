import React from 'react';
import styled from 'styled-components';
import Container from './Container';

const StyledFooter = styled.footer`
  padding: 40px 0;
`;

const Disclaimer = styled.p``;
const Highlighted = styled.span`
  background-color: #df6f7c;
`;

const BMAC = styled.a`
  max-width: 200px;

  img {
    max-width: 200px;

  }
`;

const Footer = () => (

  <StyledFooter>
    <Container>
      <Disclaimer>
        <Highlighted>DISCLAIMER:</Highlighted> This model is based off the SIR model with the idea stemming from <a href="http://www.pandemsim.com/data/index.php/make-your-own-sir-model/">this article</a>. This is a simulation only to show the possible effects of government mandated social polices and how they might "flatten the curve". This is a model only and not based off any real data.
      </Disclaimer>
      <BMAC href="https://www.buymeacoffee.com/covidsimulator" target="_blank">
        <img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" style={{ height: '51px !important', width: '217px !important'}} />
      </BMAC>
    </Container>
  </StyledFooter>
);

export default Footer;
