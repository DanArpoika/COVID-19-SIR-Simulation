import React, { useState, useEffect, useReducer } from 'react';
import Head from 'next/head'
import Switch from '../components/Switch';
import { ResponsiveLine } from '@nivo/line';

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
    <div className="container">
      <Head>
        <title>COVID-19 SIR Simulation</title>
      </Head>

      <main>
        <h3>Current Day: {data.day}</h3>
        <h3>Infected Per Day: {(b * (1 - socialDistancing)).toFixed(3)}</h3>
        <ul>
          <li>Suscetible: {Math.round(s)}</li>
          <li>Infected: {Math.round(i)}</li>
          <li>Recovered: {Math.round(r)}</li>
        </ul>

        <ul>
          <li>
            Social Distancing %:
            <select onChange={handleSocial}>
              <option value=".10" selected={socialDistancing == .10}>10%</option>
              <option value=".25" selected={socialDistancing == .25}>25%</option>
              <option value=".50" selected={socialDistancing == .50}>50%</option>
              <option value=".75" selected={socialDistancing == .75}>75%</option>
            </select>
          </li>
          <li>Schools: <Switch value={schoolsOpen ? 1 : 0} setChecked={handleSchools} /></li>
          <li>Bars/Restaraunts: <Switch value={foodOpen ? 1 : 0} setChecked={handleFood} /></li>
          <li>Shelter In Place: <Switch value={shelter ? 1 : 0} setChecked={handleShelter} /></li>
        </ul>
        <button onClick={() => dispatch({ type: 'ADD_DAY' })}>Next Day</button>
        <div
          style={{
            margin: '200px auto 0 auto',
            width: '90%',
            height: '400px'
          }}
        >
          <ResponsiveLine
            data={data.points}
            margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
            xScale={{ type: 'linear' }}
            yScale={{ type: 'linear', stacked: true, min: 0, max: 328000000 }}
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
        </div>
      </main>

      <footer>

      </footer>
    </div>
  );
};

export default Home
