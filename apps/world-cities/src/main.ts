import Globe from 'globe.gl';

fetch('assets/ne_110m_populated_places_simple.geojson')
  .then((res) => res.json())
  .then((places) => {
    Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .labelsData(places.features)
      .labelLat((d: any) => d.properties.latitude)
      .labelLng((d: any) => d.properties.longitude)
      .labelText((d: any) => d.properties.name)
      .labelSize((d: any) => Math.sqrt(d.properties.pop_max) * 4e-4)
      .labelDotRadius((d: any) => Math.sqrt(d.properties.pop_max) * 4e-4)
      .labelColor(() => 'rgba(255, 165, 0, 0.75)')
      .labelResolution(2)(document.getElementById('root'));
  });
