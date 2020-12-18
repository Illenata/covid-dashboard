import './styles/styles.scss';
import WorldMap from './scripts/world-map';
import Grid from './scripts/grid';

const worldMap = new WorldMap();
worldMap.init();

const grid = new Grid();
grid.init();
