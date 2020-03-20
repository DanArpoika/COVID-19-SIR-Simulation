import React, { useState, useEffect, useReducer } from 'react';
import Head from 'next/head'
import screen from 'superior-mq';
import { rem, darken } from 'polished';
import styled from 'styled-components';
import Container from '../components/Container';
import Card from '../components/Card';
import Footer from '../components/Footer';
import { ResponsiveLine } from '@nivo/line';
import { formatNumber } from '../util';

const App = styled.section`
  padding: 40px 0;
`;

const GraphCard = styled(Card)`
  height: 400px;
  margin-top: 40px;
`;

const Heading = styled.h1`
  padding: 0 0 20px 0;
`;

const NextDay = styled.button`
  border-radius: 4px;
  background-color: #6577E0;
  color: ${props => props.theme.white};
  padding: 10px 20px;
  font-size: ${rem(18)};
  font-weight: 600;
  letter-spacing: 0.015em;

  &:hover {
    cursor: pointer;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-column-gap: 40px;
  grid-template-columns: repeat(20, 1fr);

  ${screen.below('992px', `
    grid-column-gap: 0px;
  `)}
`;

const GridItem = styled.div`
  grid-column: span 10;

  ${screen.below('992px', `
    grid-column: span 20;
    grid-column-gap: 0px;
  `)}
`;

const Stat = styled.span`
  flex: 0 0 50%;
  position: relative;
  line-height: ${rem(16)};

  ${props => props.actionPad && `
    margin-bottom: 15px;
  `}
`;

const Value = styled.span`
  flex: 0 0 50%;
  text-align: right;

  ${props => props.active && `
    color: #b64372;
  `}
`;

const StatGroup = styled.div`
  padding: 20px 0 0 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  ${props => props.twoThird && `
    ${Stat} { flex: 66%; }
    ${Value} { flex: 34%; }
  `}
`;

const Action = styled.button`
  padding: 0;
  color: #6577E0;
  font-size: ${rem(12)};
  font-weight: 600;
  letter-spacing: 0.015em;
  background-color: transparent;
  appearance: none;
  border: 0;
  text-transform: uppercase;
  position: absolute;
  left: 0;
  bottom: -14px;

  &:hover { cursor: pointer; }
`;

const Divider = styled.div`
  background-color: ${props => darken(.05, props.theme.background)};
  height: 2px;
  margin: 20px auto 0 auto;
`;

const Notice = styled.span`
  font-size: ${rem(12)};
  text-align: right;
  display: block;
`;

const Home = () => {
  const SUSCEPTIBLE = 327200000;
  const INFECTED = 60;
  const RECOVERED = 0;
  const BETA = .508; // SUSCEPTIBLES INFECTED PER DAY
  const Y = 0.0094; // FFRACTION OF INFECTIVES WHO RECOVER PER DAY
  const TIME_INTERVAL = 1; // TIME INTERVAL IN DAYS

  const initialState = {
    points: [
      // {
      //   label: 'Suscetible',
      //   data: [[1, SUSCEPTIBLE - INFECTED]]
      // },
      {
        id: "recovered",
        data: [{x: 1, y: 0}],
      },
      {
        id: 'infected',
        data: [{ x: 1, y: 60}],
      },
    ],
    day: 1,
  };

  const [s, setS] = useState(SUSCEPTIBLE); // susceptible; initial
  const [i, setI] = useState(INFECTED); // infected; initial
  const [r, setR] = useState(RECOVERED); // recovered; initial
  const [b, setB] = useState(BETA); // fraction of susceptibles infected/day
  const [y, setY] = useState(Y); // fraction of infectives who recover/day
  const [day, setDay] = useState(1); // start date
  let nu = s + i + r; // total number of people

  const addPoints = (state, payload) => {
    const { s, i, r } = payload;
    const sets = [r, i];

    return state.points.map((set, index) => {
      const newData = [...set.data, sets[index]];

      return {
        ...set,
       data: newData,
      }
    });
  }

  const dataReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_DAY': {
        return {
          ...state,
          day: state.day + 1,
        };
      }
      case 'ADD_POINT': {
        return {
          ...state,
          points: addPoints(state, action.payload),
        }
      }
      default: return new Error();
    }
  };

  const [data, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    if (data.day === 1) return;

    const bTemp = (b * (1 - socialDistancing));

    const Sn = s - ((s / SUSCEPTIBLE) * (bTemp * i));
    const In = i + (s / SUSCEPTIBLE * bTemp * i) - (i * Y);
    const Rn = r + i * Y;

    console.log(Rn)

    // 0 = sus
    // 1 = infected
    // 2 = recovered

    dispatch({
      type: 'ADD_POINT',
      payload: {
        //s: [data.day, Sn],
        i: { x: data.day, y: In.toFixed(3) - Rn.toFixed(3) },
        r: { x: data.day, y: Rn.toFixed(3) },
      },
    });

    setS(Sn)
    setI(In);
    setR(Rn);


  }, [data.day]);

  const [schoolsOpen, setSchools] = useState(true);
  const [foodOpen, setFood] = useState(true);
  const [shelter, setShelter] = useState(false);
  const [socialDistancing, setSocialDistancing] = useState(.10);

  const handleSchools = () => {
    setB(prevB => (prevB - (schoolsOpen ? .15 : -.15)));
    setSchools(prevState => (!prevState));
  }

  const handleFood = () => {
    setB(prevB => (prevB - (foodOpen ? .1 : -.1)));
    setFood(prevState => (!prevState));
  }

  const handleShelter = () => {
    setB(prevB => (prevB - (shelter ? -.25 : .25)));
    setShelter(prevState => (!prevState));
  }

  const handleSocial = (e) => {
    const { target } = e;
    const { value } = target;
    const newVal = parseFloat(value, 10);

    setSocialDistancing(1 - newVal);
  }

  return (
    <App>
      <Head>
        <title>COVID-19 SIR Simulation</title>
      </Head>

      <Container>
        <Heading>COVID-19 SIR Simulation</Heading>

        <Grid>
          <GridItem>
            <Card>
              <h3>Statistics</h3>
              <StatGroup>
                <Stat>Current Day:</Stat>
                <Value>{data.day}</Value>
                <Stat>Infected Per Day:</Stat>
                <Value>{(b * (1 - socialDistancing)).toFixed(3)}%</Value>
              </StatGroup>

              <Divider />

              <StatGroup>
                <Stat>Suscetible</Stat>
                <Value>{formatNumber(Math.round(s))}</Value>
                <Stat>Infected</Stat>
                <Value>{formatNumber(Math.round(i))}</Value>
                <Stat>Recovered</Stat>
                <Value>{formatNumber(Math.round(r))}</Value>
              </StatGroup>
              <Notice># of people</Notice>
            </Card>
          </GridItem>
          <GridItem>
            <Card>
              <h3>Social Policies</h3>
              <StatGroup twoThird>
                <Stat actionPad>
                  Schools Are
                  <Action
                    onClick={handleSchools}
                  >
                    Click to {schoolsOpen ? 'close' : 'open'}
                  </Action>
                </Stat>
                <Value active={!schoolsOpen}>{schoolsOpen ? 'open' : 'closed'}</Value>

                <Stat actionPad>
                  Bars/Restaraunts Are
                  <Action
                    onClick={handleFood}
                  >
                    Click to {foodOpen ? 'close' : 'open'}
                  </Action>
                </Stat>
                <Value active={!foodOpen}>{foodOpen ? 'open' : 'closed'}</Value>

                <Stat actionPad>
                  Shelter in Place:
                  <Action
                    onClick={handleShelter}
                  >
                    Click to {shelter ? 'disable' : 'order'}
                  </Action>
                </Stat>
                <Value active={shelter}>{shelter ? 'ordered' : 'not ordered'}</Value>

                <Stat>
                  Social Distancing Effectiveness
                </Stat>
                <Value>
                <select onChange={handleSocial}>
                    <option value=".10" selected={socialDistancing == .10}>10%</option>
                    <option value=".25" selected={socialDistancing == .25}>25%</option>
                    <option value=".50" selected={socialDistancing == .50}>50%</option>
                    <option value=".75" selected={socialDistancing == .75}>75%</option>
                  </select>
                </Value>
              </StatGroup>
            </Card>
          </GridItem>
        </Grid>

        <NextDay onClick={() => dispatch({ type: 'ADD_DAY' })}>Next Day</NextDay>
        <GraphCard>
          <ResponsiveLine
            data={data.points}
            margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
            xScale={{ type: 'linear' }}
            yScale={{ type: 'linear', stacked: true }}
            curve="monotoneX"
            axisTop={null}
            axisBottom={{
                tickSize: 1,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Day',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                format: '.2s',
                legend: 'Number of People',
                legendOffset: -50,
                legendPosition: 'middle'
            }}
            enableGridX={false}
            colors={{ scheme: 'spectral' }}
            lineWidth={1}
            pointSize={4}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={1}
            pointBorderColor={{ from: 'serieColor' }}
            enablePointLabel={false}
            pointLabel="y"
            pointLabelYOffset={-12}
            useMesh={true}
            gridXValues={[ 0, 20, 40, 60, 80, 100, 120 ]}
            gridYValues={[ 0, 500, 1000, 1500, 2000, 2500 ]}
            legends={[
                {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 140,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 12,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
        </GraphCard>
      </Container>

      <Footer />
    </App>
  );
};

export default Home
