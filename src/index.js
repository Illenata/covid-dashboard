import './styles/styles.scss';
import WorldMap from './scripts/world-map';
import Grid from './scripts/grid';
import pic from './scripts/schedule';

const grid = new Grid();
grid.init();

const worldMap = new WorldMap();
worldMap.init();

const area = document.querySelector('.graph');
area.append(pic);
