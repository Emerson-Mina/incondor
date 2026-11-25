// Datos públicos de la empresa (fuente: incondor.com y su portafolio de servicios).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://incondor.com').replace(/\/$/, '');

export const COMPANY = {
  name: 'Incondor S.A.S',
  legalName: 'Inversiones El Cóndor de Colombia S.A.S.',
  slogan: 'La solución al transporte de manera concreta',
  description:
    'Transporte terrestre de carga en Villavicencio y todo el país: materiales agregados, mezcla asfáltica, agua, maquinaria pesada y fertilizantes. Empresa habilitada por el Ministerio de Transporte.',
  phone: '+57 608 665 9914',
  phoneHref: 'tel:+576086659914',
  whatsapp: [
    { label: '317 574 1605', href: 'https://wa.me/573175741605' },
    { label: '320 473 9156', href: 'https://wa.me/573204739156' },
  ],
  email: 'logisticaincondorsas@gmail.com',
  instagram: 'https://www.instagram.com/incondorsas',
  address: {
    street: 'Km 10 vía Acacías, Planta Gravicon S.A.',
    city: 'Villavicencio',
    region: 'Meta',
    country: 'CO',
  },
  hours: [
    { days: 'Lunes', time: '8:00 a. m. – 4:00 p. m.' },
    { days: 'Martes a viernes', time: '7:00 a. m. – 4:30 p. m.' },
    { days: 'Sábados', time: '7:00 a. m. – 12:00 m.' },
    { days: 'Domingos', time: 'Cerrado' },
  ],
  clients: ['Gravicon', 'Ecobras', 'Titán', 'Accanto', 'Hormigón Urbano', 'Concremóvil', 'Argos', 'Agrobrokers', 'Oleaginosas San Marcos'],
  // Logos tomados del portafolio de servicios.
  clientLogos: {
    Gravicon: '/img/clientes/gravicon.png', Ecobras: '/img/clientes/ecobras.png', Titán: '/img/clientes/titan.png', Accanto: '/img/clientes/accanto.png',
    'Hormigón Urbano': '/img/clientes/hormigon-urbano.png', Concremóvil: '/img/clientes/concremovil.png', Argos: '/img/clientes/argos.png',
    Agrobrokers: '/img/clientes/agrobrokers.png', 'Oleaginosas San Marcos': '/img/clientes/oleaginosas-san-marcos.png',
  } as Record<string, string>,
} as const;

// Contenido institucional. Fuentes: documentos I-011 Misión V9 e I-012 Visión V9 (18 de julio de 2023),
// texto "Quiénes somos" y principios/valores entregados por la empresa (carpeta INFO_FRANK).
export const ABOUT = {
  founded: 2010,
  who:
    'Inversiones El Cóndor de Colombia S.A.S. – Incondor S.A.S. fue creada en el año 2010 por iniciativa de sus propietarios, ante la demanda del mercado y la necesidad de que una empresa se dedicara exclusivamente al transporte de sus productos para fortalecer el clúster del negocio.',
  // I-011 Misión, versión 09 – 18 de julio de 2023.
  mission:
    'Inversiones El Cóndor de Colombia S.A.S. – Incondor S.A.S. es una empresa dedicada a la prestación del servicio público de transporte terrestre automotor de carga, en lo relacionado con los diferentes materiales como: agregados, mezcla asfáltica, agua, movimientos de maquinaria, entre otros; con un alto grado de confiabilidad y compromiso para nuestros clientes.',
  // I-012 Visión, versión 09 – 18 de julio de 2023.
  vision: { pending: false, text: 'Inversiones El Cóndor de Colombia S.A.S. – Incondor S.A.S. se proyecta como una empresa líder en el servicio de transporte para los diferentes sectores, aportando al crecimiento de las regiones de nuestro país.' },
  docRef: 'I-011 Misión e I-012 Visión · Versión 09 · 18 de julio de 2023 · Hugo Andrés Baquero Medina, Representante Legal',
  letter: 'Es para Inversiones El Cóndor de Colombia S.A.S. un gusto poner a su disposición nuestro equipo de transporte terrestre de carga, debidamente habilitado por el Ministerio de Transporte mediante la Resolución 134 de 2013. Contamos con un inventario de vehículos en óptimas condiciones, diseñados para el trabajo en carreteras de todo el país y conducidos por personal debidamente preparado.',
  principles: [
    { t: 'Respeto', d: 'Profesamos el respeto a la dignidad humana de nuestros clientes, trabajadores y de todas las personas con las que interactuamos, así como al entorno y al medio ambiente. Promovemos relaciones basadas en la tolerancia, la inclusión y la no discriminación, manteniendo siempre un trato digno y cordial.' },
    { t: 'Honestidad', d: 'Actuamos con rectitud, transparencia e integridad en todos nuestros actos, cumpliendo las normas legales y organizacionales, y rechazando cualquier forma de fraude, corrupción o conducta indebida.' },
    { t: 'Justicia', d: 'Propiciamos un trato equitativo e imparcial en todas nuestras relaciones, garantizando el respeto por los derechos de las personas y el cumplimiento de las normas aplicables.' },
    { t: 'Generación de valor', d: 'Trabajamos de manera eficiente, innovadora y responsable para generar valor sostenible para clientes, trabajadores, accionistas y la sociedad, en armonía con el cumplimiento normativo y la gestión de riesgos.' },
    { t: 'Servicio', d: 'Orientamos nuestras acciones a satisfacer las necesidades de nuestros clientes internos y externos, brindando un servicio oportuno, confiable, respetuoso y de calidad.' },
    { t: 'Cumplimiento', d: 'Actuamos conforme a la legislación vigente, las políticas internas y los sistemas de gestión implementados por la compañía, promoviendo una cultura de cumplimiento y prevención de riesgos, especialmente en materia de LA/FT/FPADM.' },
    { t: 'Seguridad', d: 'Promovemos la protección de la vida, la salud y la integridad de las personas, mediante la adopción de prácticas seguras en el trabajo y en la vía, fomentando la cultura de autocuidado, prevención y reporte de riesgos.' },
  ],
  values: [
    { t: 'Lealtad', d: 'Actuamos con fidelidad, compromiso y respeto hacia la compañía, sus trabajadores, clientes y demás grupos de interés, velando por el cumplimiento de los objetivos organizacionales.' },
    { t: 'Compromiso social', d: 'Contribuimos al desarrollo de la sociedad, promoviendo prácticas responsables con el entorno, el medio ambiente y las comunidades.' },
    { t: 'Entusiasmo, actitud positiva y trabajo en equipo', d: 'Fomentamos un ambiente laboral armónico, colaborativo y motivador, afrontando los retos con disposición, respeto y orientación al logro.' },
    { t: 'Sentido de pertenencia y orgullo organizacional', d: 'Nos identificamos con los valores y objetivos de la compañía, cuidando su imagen, reputación y recursos.' },
    { t: 'Profesionalidad', d: 'Desempeñamos nuestras funciones con responsabilidad, ética, competencia y calidad, cumpliendo con los estándares organizacionales y normativos.' },
    { t: 'Perseverancia', d: 'Mantenemos la disciplina, constancia y compromiso en el logro de los objetivos, superando las dificultades con determinación.' },
    { t: 'Transparencia', d: 'Actuamos de manera clara, verificable y coherente, facilitando el control interno, la confianza y la toma de decisiones informadas.' },
    { t: 'Responsabilidad', d: 'Asumimos las consecuencias de nuestras acciones, cumpliendo con nuestras obligaciones y contribuyendo al mejoramiento continuo de la compañía.' },
  ],
  history: [
    { y: '2010', t: 'Fundación', d: 'Los propietarios crean Incondor ante la demanda del mercado y la necesidad de una empresa dedicada exclusivamente al transporte de sus productos, para fortalecer el clúster del negocio.', pending: false },
    { y: '2013', t: 'Habilitación', d: 'El Ministerio de Transporte habilita a Incondor para el servicio público de transporte terrestre automotor de carga (Resolución 134 de 2013).', pending: false },
    { y: '20__', t: 'Crecimiento de la flota', d: 'Hito pendiente: llegada de tractocamiones, cama baja y carro tanque.', pending: true },
    { y: '2023', t: 'Misión y visión versión 09', d: 'La empresa actualiza su misión y visión: transporte de agregados, mezcla asfáltica, agua y maquinaria para los diferentes sectores, aportando al crecimiento de las regiones del país.', pending: false },
    { y: 'Hoy', t: 'Sistema de gestión SST certificado', d: 'Certificados por Applus+ Colombia Ltda. en el sistema de gestión de Seguridad y Salud en el Trabajo.', pending: false },
  ],
};

const PDF = 'https://img1.wsimg.com/blobby/go/658230e4-adcd-4ed0-9a9a-6ffeac5c17af/';
export const POLICIES = [
  {
    id: 'sst', code: 'I-003', t: 'Política de Seguridad y Salud en el Trabajo',
    d: 'Compromiso con la prevención de lesiones y enfermedades laborales de conductores, personal operativo y administrativo, y con el mejoramiento continuo del SG-SST.',
    pdf: `${PDF}I-003%20POLITICA%20DE%20SEGURIDAD%20Y%20SALUD%20EN%20EL%20TRAB.pdf`,
  },
  {
    id: 'seguridad-vial', code: 'I-004', t: 'Política de Seguridad Vial',
    d: 'Lineamientos del Plan Estratégico de Seguridad Vial: velocidad, descanso, mantenimiento preventivo y comportamiento seguro en vía.',
    pdf: `${PDF}I-004%20POLITICA%20DE%20SEGURIDAD%20VIAL%20V9.pdf`,
  },
  {
    id: 'siplaft', code: 'I-008', t: 'SIPLAFT · Administración del riesgo',
    d: 'Sistema de prevención y control del riesgo de lavado de activos y financiación del terrorismo, exigido a las empresas de transporte de carga.',
    pdf: `${PDF}I-008%20POLITICAS%20DE%20LA%20ADMINISTRACI%C3%93N%20DE%20RIESGO.pdf`,
  },
  {
    id: 'datos', code: 'Pendiente', t: 'Política de tratamiento de datos personales',
    d: 'Requerida por la Ley 1581 de 2012 para el formulario PQRS. Documento pendiente de publicar.',
    pdf: null,
  },
] as const;

export const CERTIFICATION = 'Inversiones El Cóndor de Colombia S.A.S. se encuentra certificada por Applus+ Colombia Ltda. en el sistema de gestión de SST para la prestación del servicio público de transporte terrestre automotor de carga.';
