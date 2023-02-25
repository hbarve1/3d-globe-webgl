import * as THREE from 'three';
import {
  twoline2satrec,
  propagate,
  gstime,
  eciToGeodetic,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  radiansToDegrees,
} from 'satellite.js';
import Globe from 'globe.gl';

const EARTH_RADIUS_KM = 6371; // km
const SAT_SIZE = 100; // km
const TIME_STEP = 3 * 1000; // per frame

const timeLogger = document.getElementById('time-log');

const world = Globe()(document.getElementById('root'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .objectLat('lat')
  .objectLng('lng')
  .objectAltitude('alt')
  .objectLabel('name');

setTimeout(() => world.pointOfView({ altitude: 3.5 }));

const satGeometry = new THREE.OctahedronGeometry(
  (SAT_SIZE * world.getGlobeRadius()) / EARTH_RADIUS_KM / 2,
  0
);
const satMaterial = new THREE.MeshLambertMaterial({
  color: 'palegreen',
  transparent: true,
  opacity: 0.7,
});
world.objectThreeObject(() => new THREE.Mesh(satGeometry, satMaterial));

fetch('assets/space-track-leo.txt')
  .then((r) => r.text())
  .then((rawData) => {
    const tleData = rawData
      .replace(/\r/g, '')
      .split(/\n(?=[^12])/)
      .filter((d) => d)
      .map((tle) => tle.split('\n'));
    const satData = tleData
      .map(([name, tleLine1, tleLine2]) => ({
        satrec: twoline2satrec(tleLine1, tleLine2),
        name: name.trim().replace(/^0 /, ''),
      }))
      // exclude those that can't be propagated
      .filter((d) => !!propagate(d.satrec, new Date()).position)
      .slice(0, 2000);

    // time ticker
    let time = new Date();
    (function frameTicker() {
      requestAnimationFrame(frameTicker);

      time = new Date(+time + TIME_STEP);
      timeLogger.innerText = time.toString();

      // Update satellite positions
      const gmst = gstime(time);
      satData.forEach((d: any) => {
        const eci = propagate(d.satrec, time) as any;
        if (eci.position) {
          const gdPos = eciToGeodetic(eci.position, gmst);
          d.lat = radiansToDegrees(gdPos.latitude);
          d.lng = radiansToDegrees(gdPos.longitude);
          d.alt = gdPos.height / EARTH_RADIUS_KM;
        }
      });

      world.objectsData(satData);
    })();
  });
