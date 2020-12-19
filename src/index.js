import './styles/styles.scss';
import WorldMap from './scripts/world-map';
import Tables from './scripts/tables';

const worldMap = new WorldMap();
const tables = new Tables();
worldMap.init();
tables.init();
