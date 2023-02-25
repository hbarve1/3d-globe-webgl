import * as d3 from 'd3';
import Globe from 'globe.gl';

const weightColor = d3
  .scaleLinear()
  .domain([0, 60])
  .range(['lightblue', 'darkred'])
  .clamp(true);

const myGlobe = Globe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
  .hexBinPointLat((d: any) => d.geometry.coordinates[1])
  .hexBinPointLng((d: any) => d.geometry.coordinates[0])
  .hexBinPointWeight((d: any) => d.properties.mag)
  .hexAltitude(({ sumWeight }) => sumWeight * 0.0025)
  .hexTopColor((d: any) => weightColor(d.sumWeight))
  .hexSideColor((d: any) => weightColor(d.sumWeight))
  .hexLabel(
    (d: any) => `
  <b>${d.points.length}</b> earthquakes in the past month:<ul><li>
    ${d.points
      .slice()
      .sort((a, b) => b.properties.mag - a.properties.mag)
      .map((d: any) => d.properties.title)
      .join('</li><li>')}
  </li></ul>
`
  )(document.getElementById('root'));

fetch('//earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson')
  .then((res) => res.json())
  .then((equakes) => {
    myGlobe.hexBinPointsData(equakes.features);
  });
