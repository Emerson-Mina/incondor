import type { VehicleSlug } from '@/lib/fleet';
import { COMPANY } from '@/lib/site';

// Servicios: cada uno tiene su propia página en /servicios/<slug>/.
export type Service = {
  slug: string;
  t: string;
  short: string;
  intro: string;
  bullets: string[];
  materials: string[];
  vehicles: VehicleSlug[];
  photos: string[];
  seoTitle: string;
  seoDescription: string;
};

export const SERVICES: Service[] = [
  {
    slug: 'materiales-agregados',
    photos: ['/img/hero-volqueta.webp', '/img/flota/tracto-volco-frente.webp', '/img/flota/tracto-camion-volco.webp'],
    t: 'Materiales agregados',
    short: 'Arena, gravilla, triturados y recebo desde planta o cantera hasta su obra.',
    intro: 'Transportamos materiales agregados y sus derivados desde planta o cantera hasta el frente de obra, con volquetas doble troque, sencillas y tracto camión tipo volco. Es el servicio con el que nació la empresa.',
    bullets: ['Volquetas doble troque y sencillas', 'Cargue en planta o cantera', 'Entregas por viaje o por jornada', 'Retiro de escombros y movimiento de tierra'],
    materials: ['Arena', 'Gravilla', 'Triturados', 'Recebo', 'Material de afirmado', 'Escombros'],
    vehicles: ['volqueta-doble-troque', 'volqueta-sencilla', 'tracto-camion-volco'],
    seoTitle: 'Transporte de materiales agregados en Villavicencio',
    seoDescription: 'Transporte de arena, gravilla, triturados y recebo en Villavicencio y el Meta con volquetas doble troque, sencillas y tracto volco.',
  },
  {
    slug: 'mezcla-asfaltica',
    photos: ['/img/flota/tracto-camion-volco.webp', '/img/flota-patio.webp'],
    t: 'Mezcla asfáltica',
    short: 'Traslado de mezcla en caliente para pavimentación y bacheo.',
    intro: 'Llevamos mezcla asfáltica en caliente desde la planta hasta la obra de pavimentación o bacheo, coordinando la salida con la planta para que la mezcla llegue a temperatura de colocación.',
    bullets: ['Salida coordinada con la planta', 'Volcos aptos para mezcla en caliente', 'Descarga directa a la terminadora', 'Pavimentación urbana y vial'],
    materials: ['Mezcla densa en caliente', 'Mezcla para bacheo', 'Fresado'],
    vehicles: ['tracto-camion-volco', 'volqueta-doble-troque'],
    seoTitle: 'Transporte de mezcla asfáltica en el Meta',
    seoDescription: 'Transporte de mezcla asfáltica en caliente para pavimentación y bacheo en Villavicencio y el Meta.',
  },
  {
    slug: 'transporte-de-agua',
    photos: ['/img/flota/carro-tanque.webp'],
    t: 'Transporte de agua',
    short: 'Carro tanque para construcción, sector agropecuario e industria petrolera.',
    intro: 'Suministramos agua en carro tanque para obras de construcción, el sector agropecuario y la industria petrolera. La flauta de riego permite humectar vías y controlar el polvo en frentes de obra.',
    bullets: ['Tanque en acero inoxidable', 'Flauta de riego para humectar vías', 'Suministro en obra y en campo', 'Control de polvo'],
    materials: ['Agua para construcción', 'Agua para riego', 'Humectación de vías'],
    vehicles: ['carro-tanque'],
    seoTitle: 'Carro tanque de agua en Villavicencio',
    seoDescription: 'Transporte de agua en carro tanque para construcción, agro e industria petrolera en Villavicencio y el Meta.',
  },
  {
    slug: 'maquinaria-pesada',
    photos: ['/img/flota/tractomula-cama-baja.webp', '/img/flota/cama-baja-roja.webp', '/img/flota/cama-baja-motoniveladora.webp'],
    t: 'Maquinaria pesada',
    short: 'Cama baja para excavadoras, motoniveladoras, buldóceres y maquinaria amarilla.',
    intro: 'Movilizamos maquinaria amarilla entre frentes de obra y ciudades en tractomula cama baja, con aseguramiento de la carga con cadenas y tensores.',
    bullets: ['Tractomula cama baja 3S3', 'Aseguramiento con cadenas y tensores', 'Movilización entre frentes de obra', 'Rutas regionales y nacionales'],
    materials: ['Excavadoras', 'Motoniveladoras', 'Buldóceres', 'Vibrocompactadores', 'Retroexcavadoras'],
    vehicles: ['tractomula-cama-baja'],
    seoTitle: 'Transporte de maquinaria pesada en cama baja',
    seoDescription: 'Transporte de maquinaria pesada en tractomula cama baja desde Villavicencio a todo el país.',
  },
  {
    slug: 'fertilizantes',
    photos: ['/img/flota/tractocamion.webp', '/img/flota/tractocamion-morado.webp', '/img/flota/tractocamion-carpado.webp'],
    t: 'Fertilizantes',
    short: 'Tractocamión con estacas y carpa para big bags e insumos agrícolas.',
    intro: 'Transportamos fertilizantes e insumos agrícolas en tractocamión con estacas y carpa, protegiendo la carga del agua y el sol, hacia el Llano y el interior del país.',
    bullets: ['Carga carpada y protegida', 'Big bags y sacos', 'Rutas a todo el país', 'Cargue en puerto o bodega'],
    materials: ['Fertilizantes en big bags', 'Sacos de insumos', 'Carga general paletizada'],
    vehicles: ['tractocamion'],
    seoTitle: 'Transporte de fertilizantes a nivel nacional',
    seoDescription: 'Transporte de fertilizantes e insumos agrícolas en tractocamión carpado desde y hacia el Meta.',
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const STEPS = [
  { k: 'Por WhatsApp o teléfono', t: 'Cotización', d: 'Nos dice qué material, cuánto, desde dónde y hasta dónde. Le damos precio por viaje o por jornada.' },
  { k: 'Según la carga', t: 'Asignación', d: 'Elegimos el vehículo que corresponde: volqueta, tanque, cama baja o tractocamión.' },
  { k: 'En planta o cantera', t: 'Cargue', d: 'El conductor llega a la hora acordada y verifica la carga antes de salir.' },
  { k: 'Seguimiento', t: 'En ruta', d: 'Le avisamos la salida y cualquier novedad en vía, sin que tenga que llamar.' },
  { k: 'Remisión firmada', t: 'Entrega', d: 'Descargamos donde lo necesita y cerramos el viaje con su firma.' },
];

export const FAQ = [
  { q: '¿Qué tipo de carga transportan?', a: 'Materiales agregados (arena, gravilla, triturados, recebo), mezcla asfáltica, agua, maquinaria pesada y fertilizantes. Cada carga va en el vehículo adecuado de nuestra flota.' },
  { q: '¿En qué zonas prestan el servicio?', a: 'Nuestra base está en Villavicencio, Meta. Atendemos la ciudad, los municipios del departamento y rutas a nivel nacional.' },
  { q: '¿Cómo pido una cotización?', a: `Escríbanos por WhatsApp al ${COMPANY.whatsapp[0].label} o al ${COMPANY.whatsapp[1].label}, o llame al ${COMPANY.phone}. Indique material, cantidad, origen y destino.` },
  { q: '¿Están habilitados para transporte de carga?', a: 'Sí. Incondor está habilitada por el Ministerio de Transporte mediante la Resolución 134 de 2013, con conductores capacitados y vehículos en óptimas condiciones.' },
  { q: '¿Tienen certificación en seguridad?', a: 'Sí. Nuestro sistema de gestión de Seguridad y Salud en el Trabajo está certificado por Applus+ Colombia Ltda.' },
  { q: '¿Las capacidades de la flota son exactas?', a: 'Las medidas y capacidades publicadas son de referencia. Confirme con nosotros la capacidad del vehículo asignado a su viaje.' },
  { q: '¿Cómo radico una petición, queja o reclamo?', a: 'En la página de PQRS. Al enviarla recibe un número de radicado para hacer seguimiento.' },
  { q: '¿Cómo me vinculo como cliente o proveedor?', a: 'En la página de Vinculación encuentra los documentos requeridos y el formulario de registro.' },
];
