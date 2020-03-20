/* Equations */
const { table } = require('table');

const SUSCEPTIBLE = 327200000;
const INFECTED = 60;
const RECOVERED = 0;
const BETA = .008; // SUSCEPTIBLES INFECTED PER DAY
const Y = 0.0094; // FFRACTION OF INFECTIVES WHO RECOVER PER DAY
const TIME_INTERVAL = 1; // TIME INTERVAL IN DAYS

let s = SUSCEPTIBLE; // susceptible; initial
let i = INFECTED; // infected; initial
let r = RECOVERED; // recovered; initial
let b = BETA; // fraction of susceptibles infected/day
let y = Y; // fraction of infectives who recover/day
let t = TIME_INTERVAL; // time interval, usually days
let nu = s + i + r; // total number of people

const tableConfig = {
    columns: {
        0: {
            alignment: 'left',
            width: 5,
        },
        1: {
            alignment: 'left',
            width: 12,
        },
        2: {
            alignment: 'left',
            width: 10,
        },
        3: {
            alignment: 'left',
            width: 10,
        },
        4: {
            alignment: 'left',
            width: 10,
        },
    }
}

const data = [];
data.push(['Day #', 'Susceptible', 'Infected', 'Recovered', 'Total People']);
data.push([1, s, i, r, nu]);

for (let n = 2; n <= 205; n++) {
    const Sn = s - ((s / SUSCEPTIBLE) * (BETA * i));
    const In = i + (s / SUSCEPTIBLE * BETA * i) - (i * Y);
    const Rn = r + i * Y;

    s = Sn;
    i = In;
    r = Rn;

    data.push([n, s.toFixed(2), i.toFixed(2), r.toFixed(2), nu]);
}

console.log(table(data, tableConfig));

