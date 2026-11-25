// Catálogo de la flota. Medidas y capacidades son de referencia.
export type VehicleSlug =
  | 'volqueta-doble-troque'
  | 'volqueta-sencilla'
  | 'tracto-camion-volco'
  | 'carro-tanque'
  | 'tractomula-cama-baja'
  | 'tractocamion';

export type Vehicle = {
  slug: VehicleSlug;
  name: string;
  short: string;
  service: string;
  config: string;
  axles: number;
  capacity: string;
  length: string;
  height: string;
  paint: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  uses: string[];
  cargo?: { a: string; b: string };
  dump?: boolean;
  photo?: string;
};

export const FLEET: Vehicle[] = [
  {
    slug: 'volqueta-doble-troque',
    photo: '/img/flota/volqueta-doble-troque.webp',
    name: 'Volqueta doble troque',
    short: 'Doble troque',
    service: 'Transporte de materiales agregados y mezcla asfáltica',
    config: 'C3',
    axles: 3,
    capacity: '14 m³',
    length: '8,3 m',
    height: '3,6 m',
    paint: '#e9ebe8',
    dump: true,
    seoTitle: 'Volqueta doble troque en Villavicencio',
    seoDescription:
      'Alquiler y servicio de volqueta doble troque en Villavicencio y el Meta para transporte de agregados, arena, gravilla, recebo y mezcla asfáltica.',
    intro:
      'La volqueta doble troque (configuración C3) es el caballo de batalla de nuestra flota: tándem trasero con llantas gemelas, volco hidráulico telescópico y compuerta de bisagra superior para descargar agregados y mezcla asfáltica de forma controlada.',
    uses: ['Arena, gravilla y triturados', 'Recebo y material de afirmado', 'Mezcla asfáltica para pavimentación', 'Retiro de escombros y movimiento de tierra'],
  },
  {
    slug: 'volqueta-sencilla',
    photo: '/img/flota/volqueta-sencilla.webp',
    name: 'Volqueta sencilla',
    short: 'Sencilla',
    service: 'Transporte de materiales agregados en obra urbana',
    config: 'C2',
    axles: 2,
    capacity: '7 m³',
    length: '6,8 m',
    height: '3,6 m',
    paint: '#d9a404',
    dump: true,
    seoTitle: 'Volqueta sencilla en Villavicencio',
    seoDescription:
      'Volqueta sencilla de dos ejes para obras urbanas en Villavicencio: entrega ágil de arena, gravilla, triturado y mezcla asfáltica en vías estrechas.',
    intro:
      'La volqueta sencilla (C2) combina maniobrabilidad y capacidad: ideal para entregas en barrios, obras urbanas y vías estrechas donde una doble troque no entra con facilidad.',
    uses: ['Entregas en obra urbana', 'Material para placas y andenes', 'Bacheo con mezcla asfáltica', 'Viajes cortos y frecuentes'],
  },
  {
    slug: 'tracto-camion-volco',
    photo: '/img/flota/tracto-camion-volco.webp',
    name: 'Tracto camión tipo volco',
    short: 'Tracto volco',
    service: 'Transporte de agregados en gran volumen',
    config: '3S3',
    axles: 6,
    capacity: '30 m³',
    length: '16,1 m',
    height: '3,9 m',
    paint: '#a3231a',
    dump: true,
    seoTitle: 'Tractocamión volco (góndola) para agregados',
    seoDescription:
      'Tractocamión con semirremolque volco para transporte de grandes volúmenes de agregados desde plantas y canteras del Meta hacia todo el país.',
    intro:
      'El tracto camión tipo volco acopla un tractor 6x4 con un semirremolque volqueta de tres ejes. Mueve grandes volúmenes de material por carretera con menos viajes y menor costo por metro cúbico.',
    uses: ['Despachos desde planta y cantera', 'Suministro a proyectos viales', 'Material para concreteras', 'Rutas intermunicipales'],
  },
  {
    slug: 'carro-tanque',
    photo: '/img/flota/carro-tanque.webp',
    name: 'Carro tanque',
    short: 'Carro tanque',
    service: 'Transporte de agua para construcción, agro e industria petrolera',
    config: 'C3',
    axles: 3,
    capacity: '3.000 gal',
    length: '9,3 m',
    height: '3,9 m',
    paint: '#1c4f8f',
    seoTitle: 'Carro tanque de agua en Villavicencio',
    seoDescription:
      'Servicio de carro tanque para transporte y riego de agua en Villavicencio y el Meta: construcción, sector agropecuario e industria petrolera.',
    intro:
      'Nuestros carros tanque llevan agua a obras, fincas y locaciones petroleras. Tanque en acero inoxidable, flauta de riego trasera para humectación de vías y control de polvo.',
    uses: ['Humectación y compactación de vías', 'Control de material particulado', 'Suministro en fincas y cultivos', 'Apoyo a locaciones petroleras'],
  },
  {
    slug: 'tractomula-cama-baja',
    photo: '/img/flota/tractomula-cama-baja.webp',
    name: 'Tractomula cama baja',
    short: 'Cama baja',
    service: 'Transporte de maquinaria pesada y maquinaria amarilla',
    config: '3S3',
    axles: 6,
    capacity: '35 t',
    length: '19,8 m',
    height: '4,5 m',
    paint: '#e9ebe8',
    cargo: { a: 'Con excavadora', b: 'Vacía' },
    seoTitle: 'Cama baja para transporte de maquinaria pesada',
    seoDescription:
      'Tractomula cama baja para movilizar excavadoras, motoniveladoras, buldóceres y maquinaria amarilla en el Meta y todo Colombia.',
    intro:
      'La cama baja tiene un piso rebajado entre el cuello y los ejes traseros para transportar maquinaria pesada con el centro de gravedad bajo y dentro de los límites de altura en vía.',
    uses: ['Excavadoras y retroexcavadoras', 'Motoniveladoras y buldóceres', 'Vibrocompactadores', 'Equipos para la industria petrolera'],
  },
  {
    slug: 'tractocamion',
    photo: '/img/flota/tractocamion.webp',
    name: 'Tractocamión',
    short: 'Tractocamión',
    service: 'Transporte de fertilizantes y carga general',
    config: '3S3',
    axles: 6,
    capacity: '34 t',
    length: '18,3 m',
    height: '4,4 m',
    paint: '#1f6b3b',
    cargo: { a: 'Carpada', b: 'Big bags' },
    seoTitle: 'Tractocamión para transporte de fertilizantes',
    seoDescription:
      'Tractocamión con plataforma de estacas y carpa para transporte seguro de fertilizantes, big bags y carga seca a nivel nacional.',
    intro:
      'El tractocamión con semirremolque de plataforma y estacas transporta fertilizantes en big bags o bultos, protegidos con carpa contra lluvia y sol durante todo el recorrido.',
    uses: ['Fertilizantes en big bags', 'Insumos agrícolas', 'Carga seca paletizada', 'Rutas nacionales'],
  },
];

export const getVehicle = (slug: string) => FLEET.find((v) => v.slug === slug);
