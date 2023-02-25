import Globe from 'globe.gl';
import * as three from 'three';
import * as topojson from 'topojson-client';

const world = Globe()(document.getElementById('root'))
  .backgroundColor('rgba(0,0,0,0)')
  .showGlobe(false)
  .showAtmosphere(false);

fetch('//unpkg.com/world-atlas/land-110m.json')
  .then((res) => res.json())
  .then((landTopo) => {
    world
      .polygonsData(topojson.feature(landTopo, landTopo.objects.land).features)
      .polygonCapMaterial(
        new three.MeshLambertMaterial({
          color: 'darkslategrey',
          side: three.DoubleSide,
        })
      )
      .polygonSideColor(() => 'rgba(0,0,0,0)');
  });
