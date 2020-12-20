import './styles/styles.scss';
import WorldMap from './scripts/world-map';
import Grid from './scripts/grid';
import pic from './scripts/schedule';
import Tables from './scripts/tables';

const grid = new Grid();
grid.init();

const worldMap = new WorldMap();
const tables = new Tables();
const area = document.querySelector('.graph');

worldMap.init();
tables.init();
area.append(pic);
