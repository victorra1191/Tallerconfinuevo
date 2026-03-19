// Función para obtener imagen por tipo de producto
export const getProductImageByType = (product) => {
  const productImages = {
    // Aceites
    "Aceite": "https://images.unsplash.com/photo-1590227763209-821c686b932f?w=300&h=300&fit=crop",
    "Aceite ATF": "https://images.pexels.com/photos/210126/pexels-photo-210126.jpeg?w=300&h=300&fit=crop", 
    "Aceite de Transmisión": "https://images.pexels.com/photos/4116171/pexels-photo-4116171.jpeg?w=300&h=300&fit=crop",
    
    // Filtros
    "Filtro": "https://images.pexels.com/photos/13177819/pexels-photo-13177819.jpeg?w=300&h=300&fit=crop",
    "Filtro de Aceite": "https://images.pexels.com/photos/7541975/pexels-photo-7541975.jpeg?w=300&h=300&fit=crop",
    
    // Productos de limpieza
    "Limpiador": "https://images.pexels.com/photos/11139243/pexels-photo-11139243.jpeg?w=300&h=300&fit=crop",
    "Limpiador de Motor": "https://images.unsplash.com/photo-1678383407772-317ee1ba9c5d?w=300&h=300&fit=crop",
    "Limpiador de Carburador": "https://images.pexels.com/photos/11139243/pexels-photo-11139243.jpeg?w=300&h=300&fit=crop",
    "Desengrasante": "https://images.pexels.com/photos/11139243/pexels-photo-11139243.jpeg?w=300&h=300&fit=crop",
    
    // Aditivos y fluidos
    "Aditivo": "https://images.pexels.com/photos/6870297/pexels-photo-6870297.jpeg?w=300&h=300&fit=crop",
    "Aditivo de Limpieza": "https://images.pexels.com/photos/6870297/pexels-photo-6870297.jpeg?w=300&h=300&fit=crop",
    "Fluido de Frenos": "https://images.pexels.com/photos/4116171/pexels-photo-4116171.jpeg?w=300&h=300&fit=crop",
    "Anticongelante": "https://images.pexels.com/photos/4116171/pexels-photo-4116171.jpeg?w=300&h=300&fit=crop",
    
    // Selladores y adhesivos
    "Sellador": "https://images.unsplash.com/photo-1623160850502-9bd1bfeec545?w=300&h=300&fit=crop",
    "Sellador/Silicona": "https://images.unsplash.com/photo-1623160850502-9bd1bfeec545?w=300&h=300&fit=crop",
    "Adhesivo": "https://images.unsplash.com/photo-1623160850502-9bd1bfeec545?w=300&h=300&fit=crop",
    
    // Grasa y lubricantes
    "Grasa": "https://images.pexels.com/photos/210126/pexels-photo-210126.jpeg?w=300&h=300&fit=crop",
    
    // Herramientas y accesorios
    "Escobilla": "https://images.unsplash.com/photo-1559416814-85b0a9b2af76?w=300&h=300&fit=crop",
    "Bombillo": "https://images.pexels.com/photos/9606744/pexels-photo-9606744.jpeg?w=300&h=300&fit=crop",
    "Accesorio": "https://images.unsplash.com/photo-1559416814-85b0a9b2af76?w=300&h=300&fit=crop",
    "Repuesto": "https://images.pexels.com/photos/9606744/pexels-photo-9606744.jpeg?w=300&h=300&fit=crop",
    
    // Otros
    "Kit de Limpieza": "https://images.pexels.com/photos/11139243/pexels-photo-11139243.jpeg?w=300&h=300&fit=crop",
    "Reparador de Neumáticos": "https://images.unsplash.com/photo-1559416814-85b0a9b2af76?w=300&h=300&fit=crop",
    "Eliminador de Olores": "https://images.pexels.com/photos/11139243/pexels-photo-11139243.jpeg?w=300&h=300&fit=crop",
    "Pintura": "https://images.pexels.com/photos/9606744/pexels-photo-9606744.jpeg?w=300&h=300&fit=crop",
    "Protector": "https://images.unsplash.com/photo-1623160850502-9bd1bfeec545?w=300&h=300&fit=crop",
    "Abrillantador": "https://images.pexels.com/photos/11139243/pexels-photo-11139243.jpeg?w=300&h=300&fit=crop",
    "Pulidor": "https://images.pexels.com/photos/11139243/pexels-photo-11139243.jpeg?w=300&h=300&fit=crop",
    "Desoxidante": "https://images.unsplash.com/photo-1623160850502-9bd1bfeec545?w=300&h=300&fit=crop"
  };

  // Imagen por defecto para productos automotrices
  const defaultImage = "https://images.unsplash.com/photo-1559416814-85b0a9b2af76?w=300&h=300&fit=crop";
  
  return productImages[product.type] || defaultImage;
};

// ALL 62 products from user's database with real Google Images URLs
export const products = [
  {
    id: 1,
    name: "Engine Flush Plus",
    price: 12.95,
    sku: "4100420026577",
    image: "https://www.google.com/search?tbm=isch&q=Engine+Flush+Plus+Genérico",
    type: "Aditivo de Limpieza",
    brand: "Genérico",
    uses: "Motores a gasolina o diésel",
    description: "Limpia residuos internos del motor y mejora la eficiencia.",
    keywords: ["motor", "limpieza", "aditivo", "gasolina", "diesel"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Engine+Flush+Plus+Genérico"
  },
  {
    id: 2,
    name: "Tapa Fugas De Aceite",
    price: 15.00,
    sku: "4100420025013",
    image: "https://www.google.com/search?tbm=isch&q=Tapa+Fugas+De+Aceite+Genérico",
    type: "Aceite",
    brand: "Genérico",
    uses: "Motores de autos, motos o maquinaria",
    description: "Lubrica el motor y mejora el rendimiento general.",
    keywords: ["aceite", "fugas", "motor", "lubricante"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Tapa+Fugas+De+Aceite+Genérico"
  },
  {
    id: 3,
    name: "Carburador Cleaner A1",
    price: 8.50,
    sku: "CASBU-450",
    image: "https://www.google.com/search?tbm=isch&q=Carburador+Cleaner+A1+A1",
    type: "Limpiador de Carburador",
    brand: "A1",
    uses: "Carburadores y sistemas de admisión",
    description: "Elimina depósitos en el carburador y mejora la mezcla aire-combustible.",
    keywords: ["carburador", "limpiador", "admision", "combustible"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Carburador+Cleaner+A1+A1"
  },
  {
    id: 4,
    name: "Filtro De Aceite Al-3593",
    price: 12.50,
    sku: "AL-3593",
    image: "https://www.google.com/search?tbm=isch&q=Filtro+De+Aceite+Al-3593+Genérico",
    type: "Filtro de Aceite",
    brand: "Genérico",
    uses: "Motores automotrices",
    description: "Retiene impurezas del aceite y protege componentes internos.",
    keywords: ["filtro", "aceite", "motor", "proteccion"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Filtro+De+Aceite+Al-3593+Genérico"
  },
  {
    id: 5,
    name: "Grasa Multiuso Wurth",
    price: 18.50,
    sku: "4046777424942",
    image: "https://www.google.com/search?tbm=isch&q=Grasa+Multiuso+Wurth+Wurth",
    type: "Grasa",
    brand: "Wurth",
    uses: "Chasis, rodamientos, piezas móviles",
    description: "Lubricación de alta resistencia para reducir fricción y desgaste.",
    keywords: ["grasa", "lubricacion", "chasis", "rodamientos"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Grasa+Multiuso+Wurth+Wurth"
  },
  {
    id: 6,
    name: "Liquido De Freno Brake Fluid A1",
    price: 6.50,
    sku: "6297001486382",
    image: "https://www.google.com/search?tbm=isch&q=Liquido+De+Freno+Brake+Fluid+A1+A1",
    type: "Fluido de Frenos",
    brand: "A1",
    uses: "Sistema de frenos automotriz",
    description: "Fluido de frenos de alta performance para sistemas hidráulicos.",
    keywords: ["frenos", "fluido", "hidraulico", "seguridad"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Liquido+De+Freno+Brake+Fluid+A1+A1"
  },
  {
    id: 7,
    name: "Electronics Cleaner A1",
    price: 6.50,
    sku: "A1-LE-450",
    image: "https://www.google.com/search?tbm=isch&q=Electronics+Cleaner+A1+A1",
    type: "Limpiador",
    brand: "A1",
    uses: "Piezas metálicas y mecánicas",
    description: "Disuelve grasa, polvo y residuos en superficies metálicas.",
    keywords: ["limpiador", "electronico", "grasa", "metal"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Electronics+Cleaner+A1+A1"
  },
  {
    id: 8,
    name: "Brake Cleaner A1",
    price: 6.00,
    sku: "A1-LF-500",
    image: "https://www.google.com/search?tbm=isch&q=Brake+Cleaner+A1+A1",
    type: "Limpiador",
    brand: "A1",
    uses: "Piezas metálicas y mecánicas",
    description: "Disuelve grasa, polvo y residuos en superficies metálicas.",
    keywords: ["frenos", "limpiador", "grasa", "polvo"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Brake+Cleaner+A1+A1"
  },
  {
    id: 9,
    name: "Acido Coil Brite",
    price: 8.50,
    sku: "COIL-BRITE",
    image: "https://www.google.com/search?tbm=isch&q=Acido+Coil+Brite+Genérico",
    type: "Limpiador",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["acido", "limpieza", "serpentines", "aire"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Acido+Coil+Brite+Genérico"
  },
  {
    id: 10,
    name: "Hsw 200 Plus Wurt Bombas Olor",
    price: 12.50,
    sku: "4065746391443",
    image: "https://www.google.com/search?tbm=isch&q=Hsw+200+Plus+Wurt+Bombas+Olor+Genérico",
    type: "Eliminador de Olores",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["olor", "bomba", "eliminador", "interior"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Hsw+200+Plus+Wurt+Bombas+Olor+Genérico"
  },
  {
    id: 11,
    name: "Car Clean Set Wurt",
    price: 25.00,
    sku: "4052703649211",
    image: "https://www.google.com/search?tbm=isch&q=Car+Clean+Set+Wurt+Genérico",
    type: "Kit de Limpieza",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["limpieza", "set", "completo", "auto"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Car+Clean+Set+Wurt+Genérico"
  },
  {
    id: 12,
    name: "Reparador De Pneus Auto Wurt 220 Ml",
    price: 15.00,
    sku: "7891799462574",
    image: "https://www.google.com/search?tbm=isch&q=Reparador+De+Pneus+Auto+Wurt+220+Ml+Genérico",
    type: "Reparador de Neumáticos",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["neumaticos", "reparador", "emergencia", "sellador"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Reparador+De+Pneus+Auto+Wurt+220+Ml+Genérico"
  },
  {
    id: 13,
    name: "Limpieza Del Motor Wurth 500Ml",
    price: 18.00,
    sku: "10649008",
    image: "https://www.google.com/search?tbm=isch&q=Limpieza+Del+Motor+Wurth+500Ml+Wurth",
    type: "Limpiador de Motor",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["motor", "limpieza", "desengrasante", "wurth"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Limpieza+Del+Motor+Wurth+500Ml+Wurth"
  },
  {
    id: 14,
    name: "Sellador De Radiador Wurt 250Ml",
    price: 12.00,
    sku: "910854511730",
    image: "https://www.google.com/search?tbm=isch&q=Sellador+De+Radiador+Wurt+250Ml.+Genérico",
    type: "Sellador",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["radiador", "sellador", "fugas", "refrigeracion"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Sellador+De+Radiador+Wurt+250Ml.+Genérico"
  },
  {
    id: 15,
    name: "Desengraxante Express Wurt 500Ml",
    price: 14.00,
    sku: "4099618249501",
    image: "https://www.google.com/search?tbm=isch&q=Desengraxante+Express+Wurt+500Ml+Genérico",
    type: "Desengrasante",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["desengrasante", "express", "grasa", "limpieza"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Desengraxante+Express+Wurt+500Ml+Genérico"
  },
  {
    id: 16,
    name: "Silicona En Spray Wurt 300Ml",
    price: 10.00,
    sku: "4056807076942",
    image: "https://www.google.com/search?tbm=isch&q=Silicona+En+Spray+Wurt+300Ml+Genérico",
    type: "Sellador/Silicona",
    brand: "Wurth",
    uses: "Sellado de componentes mecánicos",
    description: "Sella juntas y previene fugas en motores y carrocerías.",
    keywords: ["silicona", "sellador", "spray", "juntas"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Silicona+En+Spray+Wurt+300Ml+Genérico"
  },
  {
    id: 17,
    name: "Adictivo De Nafta Wurt 300Ml",
    price: 8.00,
    sku: "4065746019422",
    image: "https://www.google.com/search?tbm=isch&q=Adictivo+De+Nafta+Wurt+300Ml+Genérico",
    type: "Aditivo",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["aditivo", "nafta", "combustible", "motor"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Adictivo+De+Nafta+Wurt+300Ml+Genérico"
  },
  {
    id: 18,
    name: "Limpiador De Válvulas De Gasolina Wurt 300Ml",
    price: 9.50,
    sku: "8460075507330",
    image: "https://www.google.com/search?tbm=isch&q=Limpiador+De+Válvulas+De+Gasolina+Wurt+300Ml+Genérico",
    type: "Limpiador",
    brand: "Wurth",
    uses: "Piezas metálicas y mecánicas",
    description: "Disuelve grasa, polvo y residuos en superficies metálicas.",
    keywords: ["valvulas", "gasolina", "limpiador", "motor"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Limpiador+De+Válvulas+De+Gasolina+Wurt+300Ml+Genérico"
  },
  {
    id: 19,
    name: "Liquido De Frenos Wurt 250Ml",
    price: 8.50,
    sku: "4065746757737",
    image: "https://www.google.com/search?tbm=isch&q=Liquido+De+Frenos+Wurt+250Ml+Genérico",
    type: "Fluido de Frenos",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["frenos", "liquido", "hidraulico", "wurth"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Liquido+De+Frenos+Wurt+250Ml+Genérico"
  },
  {
    id: 20,
    name: "Limpia Parabrisas Wurt 100Ml",
    price: 6.00,
    sku: "4045989514038",
    image: "https://www.google.com/search?tbm=isch&q=Limpia+Parabrisas+Wurt+100Ml+Genérico",
    type: "Limpiador",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["parabrisas", "limpiador", "vidrio", "vision"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Limpia+Parabrisas+Wurt+100Ml+Genérico"
  },
  {
    id: 21,
    name: "Pintura Aerosol Wurt 400Ml",
    price: 12.00,
    sku: "4056807623832",
    image: "https://www.google.com/search?tbm=isch&q=Pintura+Aerosol+Wurt+400Ml+Genérico",
    type: "Pintura",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["pintura", "aerosol", "retoque", "color"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Pintura+Aerosol+Wurt+400Ml+Genérico"
  },
  {
    id: 22,
    name: "Tapafugas De Radiador",
    price: 8.50,
    sku: "4100420025051",
    image: "https://www.google.com/search?tbm=isch&q=Tapafugas+De+Radiador+Genérico",
    type: "Sellador",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["radiador", "tapafugas", "sellador", "refrigeracion"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Tapafugas+De+Radiador+Genérico"
  },
  {
    id: 23,
    name: "Grasa Dielectrica Wurt 85 Gr",
    price: 10.50,
    sku: "4056807695013",
    image: "https://www.google.com/search?tbm=isch&q=Grasa+Dielectrica+Wurt+85+Gr+Genérico",
    type: "Grasa",
    brand: "Wurth",
    uses: "Chasis, rodamientos, piezas móviles",
    description: "Lubricación de alta resistencia para reducir fricción y desgaste.",
    keywords: ["grasa", "dielectrica", "electrica", "contactos"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Grasa+Dielectrica+Wurt+85+Gr+Genérico"
  },
  {
    id: 24,
    name: "Bombillo Wurt",
    price: 8.00,
    sku: "BOMBILLO-WURT",
    image: "https://www.google.com/search?tbm=isch&q=Bombillo+Wurt+Genérico",
    type: "Bombillo",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["bombillo", "luz", "iluminacion", "electrico"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Bombillo+Wurt+Genérico"
  },
  {
    id: 25,
    name: "Limpiador De Inyectores Presurizado Wurt 500Ml",
    price: 16.50,
    sku: "INYECT-500",
    image: "https://www.google.com/search?tbm=isch&q=Limpiador+De+Inyectores+Presurizado+Wurt+500Ml+Genérico",
    type: "Limpiador",
    brand: "Wurth",
    uses: "Piezas metálicas y mecánicas",
    description: "Disuelve grasa, polvo y residuos en superficies metálicas.",
    keywords: ["inyectores", "limpiador", "presurizado", "combustible"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Limpiador+De+Inyectores+Presurizado+Wurt+500Ml+Genérico"
  },
  {
    id: 26,
    name: "Engine Clean Motor Systemreiniger Motul 300Ml",
    price: 18.50,
    sku: "5716304275994",
    image: "https://www.google.com/search?tbm=isch&q=Engine+Clean+Motor+Systemreiniger+Motul+300Ml+Motul",
    type: "Limpiador de Motor",
    brand: "Motul",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["motor", "limpiador", "system", "motul"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Engine+Clean+Motor+Systemreiniger+Motul+300Ml+Motul"
  },
  {
    id: 27,
    name: "Super Diésel Additiv Liqui Moly 250Ml",
    price: 14.50,
    sku: "4100420025044",
    image: "https://www.google.com/search?tbm=isch&q=Super+Diésel+Additiv+Liqui+Moly+250Ml+Liqui+Moly",
    type: "Aditivo",
    brand: "Liqui Moly",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["diesel", "aditivo", "liqui", "moly"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Super+Diésel+Additiv+Liqui+Moly+250Ml+Liqui+Moly"
  },
  {
    id: 28,
    name: "Bujias Iridium D-Lfr5Aix",
    price: 25.00,
    sku: "5648169728639",
    image: "https://www.google.com/search?tbm=isch&q=Bujias+Iridium+D-Lfr5Aix+Genérico",
    type: "Repuesto",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["bujias", "iridium", "encendido", "motor"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Bujias+Iridium+D-Lfr5Aix+Genérico"
  },
  {
    id: 29,
    name: "Varniz De Motor 135Ml Wurt",
    price: 9.50,
    sku: "7891799524609",
    image: "https://www.google.com/search?tbm=isch&q=Varniz+De+Motor+135Ml+Wurt+Genérico",
    type: "Protector",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["varniz", "motor", "protector", "acabado"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Varniz+De+Motor+135Ml+Wurt+Genérico"
  },
  {
    id: 30,
    name: "Brillant 750 Ml",
    price: 12.00,
    sku: "8027486744916",
    image: "https://www.google.com/search?tbm=isch&q=Brillant++750+Ml+Genérico",
    type: "Abrillantador",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["brillant", "abrillantador", "shine", "brillo"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Brillant++750+Ml+Genérico"
  },
  {
    id: 31,
    name: "Air Filter 28113-1W000 Filtro Motor",
    price: 12.50,
    sku: "28113-1W000",
    image: "https://www.google.com/search?tbm=isch&q=Air+Filter+28113-1W000+Filtro+Motor+Genérico",
    type: "Filtro",
    brand: "Genérico",
    uses: "Motores o sistemas hidráulicos",
    description: "Filtración eficiente de partículas y contaminantes.",
    keywords: ["filtro", "aire", "motor", "28113"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Air+Filter+28113-1W000+Filtro+Motor+Genérico"
  },
  {
    id: 32,
    name: "Cabin Filter Ac-87139-Yzz20 Filtro De Cabina",
    price: 15.50,
    sku: "AC-87139-YZZ20",
    image: "https://www.google.com/search?tbm=isch&q=Cabin+Filter+Ac-87139-Yzz20+Filtro+De+Cabina+Genérico",
    type: "Filtro",
    brand: "Genérico",
    uses: "Motores o sistemas hidráulicos",
    description: "Filtración eficiente de partículas y contaminantes.",
    keywords: ["filtro", "cabina", "aire", "ac"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Cabin+Filter+Ac-87139-Yzz20+Filtro+De+Cabina+Genérico"
  },
  {
    id: 33,
    name: "Cabin Filter Ac-83236 Filtro De Cabina",
    price: 14.50,
    sku: "AC-83236",
    image: "https://www.google.com/search?tbm=isch&q=Cabin+Filter+Ac-83236+Filtro+De+Cabina+Genérico",
    type: "Filtro",
    brand: "Genérico",
    uses: "Motores o sistemas hidráulicos",
    description: "Filtración eficiente de partículas y contaminantes.",
    keywords: ["filtro", "cabina", "aire", "83236"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Cabin+Filter+Ac-83236+Filtro+De+Cabina+Genérico"
  },
  {
    id: 34,
    name: "Cinta Eléctrica",
    price: 3.50,
    sku: "4045989541669",
    image: "https://www.google.com/search?tbm=isch&q=Cinta+Eléctrica+Genérico",
    type: "Accesorio",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["cinta", "electrica", "aislante", "cables"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Cinta+Eléctrica+Genérico"
  },
  {
    id: 35,
    name: "Cabin Filter Ac-81950 Filtro Cabina",
    price: 13.50,
    sku: "AC-81950",
    image: "https://www.google.com/search?tbm=isch&q=Cabin+Filter+Ac-81950++Filtro+Cabina+Genérico",
    type: "Filtro",
    brand: "Genérico",
    uses: "Motores o sistemas hidráulicos",
    description: "Filtración eficiente de partículas y contaminantes.",
    keywords: ["filtro", "cabina", "aire", "81950"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Cabin+Filter+Ac-81950++Filtro+Cabina+Genérico"
  },
  {
    id: 36,
    name: "Air Filter 28113-1W000",
    price: 11.50,
    sku: "28113-1W000-B",
    image: "https://www.google.com/search?tbm=isch&q=Air+Filter+28113-1W000+Genérico",
    type: "Filtro",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["filtro", "aire", "28113", "motor"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Air+Filter+28113-1W000+Genérico"
  },
  {
    id: 37,
    name: "Air Filter Ak 91001",
    price: 10.50,
    sku: "AK-91001",
    image: "https://www.google.com/search?tbm=isch&q=Air+Filter+Ak+91001+Genérico",
    type: "Filtro",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["filtro", "aire", "ak", "91001"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Air+Filter+Ak+91001+Genérico"
  },
  {
    id: 38,
    name: "Air Filter Ak-16546-02N00",
    price: 9.50,
    sku: "AK-16546-02N00",
    image: "https://www.google.com/search?tbm=isch&q=Air+Filter+Ak-16546-02N00+Genérico",
    type: "Filtro",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["filtro", "aire", "16546", "02n00"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Air+Filter+Ak-16546-02N00+Genérico"
  },
  {
    id: 39,
    name: "Filtros De Gasolina 16405-02N10",
    price: 8.50,
    sku: "16405-02N10",
    image: "https://www.google.com/search?tbm=isch&q=Filtros+De+Gasolina+16405-02N10+Genérico",
    type: "Filtro",
    brand: "Genérico",
    uses: "Motores o sistemas hidráulicos",
    description: "Filtración eficiente de partículas y contaminantes.",
    keywords: ["filtro", "gasolina", "combustible", "16405"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Filtros+De+Gasolina+16405-02N10+Genérico"
  },
  {
    id: 40,
    name: "Filtros De Gasolina 31112-1Rp000",
    price: 9.50,
    sku: "31112-1RP000",
    image: "https://www.google.com/search?tbm=isch&q=Filtros+De+Gasolina+31112-1Rp000+Genérico",
    type: "Filtro",
    brand: "Genérico",
    uses: "Motores o sistemas hidráulicos",
    description: "Filtración eficiente de partículas y contaminantes.",
    keywords: ["filtro", "gasolina", "combustible", "31112"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Filtros+De+Gasolina+31112-1Rp000+Genérico"
  },
  {
    id: 41,
    name: "Air Filter Ak-21050",
    price: 8.50,
    sku: "AK-21050",
    image: "https://www.google.com/search?tbm=isch&q=Air+Filter+Ak-21050+Genérico",
    type: "Filtro",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["filtro", "aire", "ak", "21050"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Air+Filter+Ak-21050+Genérico"
  },
  {
    id: 42,
    name: "Atf Multi Eni 1L",
    price: 12.50,
    sku: "8423178020175",
    image: "https://www.google.com/search?tbm=isch&q=Atf+Multi+Eni+1L+Genérico",
    type: "Aceite ATF",
    brand: "ENI",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["atf", "transmision", "automatica", "eni"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Atf+Multi+Eni+1L+Genérico"
  },
  {
    id: 43,
    name: "Mp 80W-90 Manual Transmisión Eni 4L",
    price: 35.00,
    sku: "8003699012646",
    image: "https://www.google.com/search?tbm=isch&q=Mp+80W-90+Manual+Transmisión+Eni+4L+Genérico",
    type: "Aceite de Transmisión",
    brand: "ENI",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["transmision", "manual", "80w90", "eni"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Mp+80W-90+Manual+Transmisión+Eni+4L+Genérico"
  },
  {
    id: 44,
    name: "10W-30 Aceite Motul 4L",
    price: 45.00,
    sku: "3374650415550",
    image: "https://www.google.com/search?tbm=isch&q=10W-30+Aceite+Motul+4L+Motul",
    type: "Aceite",
    brand: "Motul",
    uses: "Motores de autos, motos o maquinaria",
    description: "Lubrica el motor y mejora el rendimiento general.",
    keywords: ["aceite", "motor", "10w30", "motul"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=10W-30+Aceite+Motul+4L+Motul"
  },
  {
    id: 45,
    name: "10W-30 1L Aceite Motul",
    price: 15.00,
    sku: "370960410042",
    image: "https://www.google.com/search?tbm=isch&q=10W-30+1L+Aceite+Motul+Motul",
    type: "Aceite",
    brand: "Motul",
    uses: "Motores de autos, motos o maquinaria",
    description: "Lubrica el motor y mejora el rendimiento general.",
    keywords: ["aceite", "motor", "10w30", "1litro"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=10W-30+1L+Aceite+Motul+Motul"
  },
  {
    id: 46,
    name: "5W-30 Aceite Eni 1L",
    price: 12.00,
    sku: "8003699010826",
    image: "https://www.google.com/search?tbm=isch&q=5W-30+Aceite+Eni+1L+Genérico",
    type: "Aceite",
    brand: "ENI",
    uses: "Motores de autos, motos o maquinaria",
    description: "Lubrica el motor y mejora el rendimiento general.",
    keywords: ["aceite", "motor", "5w30", "eni"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=5W-30+Aceite+Eni+1L+Genérico"
  },
  {
    id: 47,
    name: "Aticogelante 1Galon",
    price: 18.00,
    sku: "ANTICONG-1GAL",
    image: "https://www.google.com/search?tbm=isch&q=Aticogelante+1Galon+Genérico",
    type: "Anticongelante",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["anticongelante", "refrigerante", "galon", "radiador"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Aticogelante+1Galon+Genérico"
  },
  {
    id: 48,
    name: "Aceite Diésel 15W-40 19L A1",
    price: 85.00,
    sku: "DIESEL-15W40-19L",
    image: "https://www.google.com/search?tbm=isch&q=Aceite+Diésel+15W-40+19L+A1+A1",
    type: "Aceite",
    brand: "A1",
    uses: "Motores de autos, motos o maquinaria",
    description: "Lubrica el motor y mejora el rendimiento general.",
    keywords: ["aceite", "diesel", "15w40", "19litros"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Aceite+Diésel+15W-40+19L+A1+A1"
  },
  {
    id: 49,
    name: "Limpiador De Manos Wurth 4L",
    price: 22.00,
    sku: "4099618626777",
    image: "https://www.google.com/search?tbm=isch&q=Limpiador+De+Manos+Wurth+4L+Wurth",
    type: "Limpiador",
    brand: "Wurth",
    uses: "Piezas metálicas y mecánicas",
    description: "Disuelve grasa, polvo y residuos en superficies metálicas.",
    keywords: ["limpiador", "manos", "wurth", "4litros"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Limpiador+De+Manos+Wurth+4L+Wurth"
  },
  {
    id: 50,
    name: "Silicon Negro Wurth 200Ml",
    price: 8.50,
    sku: "7891799499549",
    image: "https://www.google.com/search?tbm=isch&q=Silicon+Negro+Wurth+200Ml+Wurth",
    type: "Sellador/Silicona",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["silicon", "negro", "sellador", "wurth"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Silicon+Negro+Wurth+200Ml+Wurth"
  },
  {
    id: 51,
    name: "Super Limpiador De Parabrisas",
    price: 6.50,
    sku: "1003989678863",
    image: "https://www.google.com/search?tbm=isch&q=Super+Limpiador+De+Parabrisas+Genérico",
    type: "Limpiador",
    brand: "Genérico",
    uses: "Piezas metálicas y mecánicas",
    description: "Disuelve grasa, polvo y residuos en superficies metálicas.",
    keywords: ["limpiador", "parabrisas", "vidrio", "super"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Super+Limpiador+De+Parabrisas+Genérico"
  },
  {
    id: 52,
    name: "Aceite Motul 15W-40 5L",
    price: 38.00,
    sku: "3374650257730",
    image: "https://www.google.com/search?tbm=isch&q=Aceite+Motul+15W-40+5L+Motul",
    type: "Aceite",
    brand: "Motul",
    uses: "Motores de autos, motos o maquinaria",
    description: "Lubrica el motor y mejora el rendimiento general.",
    keywords: ["aceite", "motul", "15w40", "5litros"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Aceite+Motul+15W-40+5L+Motul"
  },
  {
    id: 53,
    name: "Adesivo Liquido Para Metal Wurth 25Gr",
    price: 12.50,
    sku: "4065746292412",
    image: "https://www.google.com/search?tbm=isch&q=Adesivo+Liquido+Para+Metal+Wurth+25Gr+Wurth",
    type: "Adhesivo",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["adhesivo", "metal", "wurth", "25gr"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Adesivo+Liquido+Para+Metal+Wurth+25Gr+Wurth"
  },
  {
    id: 54,
    name: "Colá Multiuso Wurth 400Ml",
    price: 14.00,
    sku: "COLA-MULTI-400",
    image: "https://www.google.com/search?tbm=isch&q=Colá+Multiuso+Wurth+400Ml+Wurth",
    type: "Adhesivo",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["cola", "multiuso", "adhesivo", "wurth"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Colá+Multiuso+Wurth+400Ml+Wurth"
  },
  {
    id: 55,
    name: "Pulidor De Metal Wurth",
    price: 11.50,
    sku: "PULIDOR-METAL",
    image: "https://www.google.com/search?tbm=isch&q=Pulidor+De+Metal+Wurth+Wurth",
    type: "Pulidor",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["pulidor", "metal", "brillo", "wurth"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Pulidor+De+Metal+Wurth+Wurth"
  },
  {
    id: 56,
    name: "Adesivo De Parabrisas",
    price: 16.00,
    sku: "ADESIVO-PARAB",
    image: "https://www.google.com/search?tbm=isch&q=Adesivo+De+Parabrisas+Genérico",
    type: "Adhesivo",
    brand: "Genérico",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["adhesivo", "parabrisas", "vidrio", "instalacion"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Adesivo+De+Parabrisas+Genérico"
  },
  {
    id: 57,
    name: "Sellador De Carrocería Wurth",
    price: 18.50,
    sku: "SELLADOR-CARROCERIA",
    image: "https://www.google.com/search?tbm=isch&q=Sellador+De+Carrocería+Wurth+Wurth",
    type: "Sellador",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["sellador", "carroceria", "estructura", "wurth"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Sellador+De+Carrocería+Wurth+Wurth"
  },
  {
    id: 58,
    name: "Adhesivo Instantáneo 2G Wurth",
    price: 8.50,
    sku: "4058794437478",
    image: "https://www.google.com/search?tbm=isch&q=Adhesivo+Instantáneo+2G+Wurth+Wurth",
    type: "Adhesivo",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["adhesivo", "instantaneo", "rapido", "2gr"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Adhesivo+Instantáneo+2G+Wurth+Wurth"
  },
  {
    id: 59,
    name: "Rost Off Aflojatuercas Wurth",
    price: 13.50,
    sku: "4058794504781",
    image: "https://www.google.com/search?tbm=isch&q=Rost+Off+Aflojatuercas+Wurth+Wurth",
    type: "Desoxidante",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["aflojatuercas", "oxidado", "penetrante", "wurth"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Rost+Off+Aflojatuercas+Wurth+Wurth"
  },
  {
    id: 60,
    name: "Limpia Parabrisas Wurth 21",
    price: 7.50,
    sku: "LIMPIA-21",
    image: "https://www.google.com/search?tbm=isch&q=Limpia+Parabrisas+Wurth+21+Wurth",
    type: "Escobilla",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["escobilla", "parabrisas", "21", "wurth"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Limpia+Parabrisas+Wurth+21+Wurth"
  },
  {
    id: 61,
    name: "Limpia Parabrisas Wurth 26",
    price: 8.00,
    sku: "LIMPIA-26",
    image: "https://www.google.com/search?tbm=isch&q=Limpia+Parabrisas+Wurth+26+Wurth",
    type: "Escobilla",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["escobilla", "parabrisas", "26", "wurth"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Limpia+Parabrisas+Wurth+26+Wurth"
  },
  {
    id: 62,
    name: "Limpia Parabrisas 14 Wurth",
    price: 6.50,
    sku: "LIMPIA-14",
    image: "https://www.google.com/search?tbm=isch&q=Limpia+Parabrisas+14+Wurth+Wurth",
    type: "Escobilla",
    brand: "Wurth",
    uses: "Aplicación automotriz general",
    description: "Producto automotriz para uso especializado.",
    keywords: ["escobilla", "parabrisas", "14", "wurth"],
    googleImageUrl: "https://www.google.com/search?tbm=isch&q=Limpia+Parabrisas+14+Wurth+Wurth"
  }
];

// Services data WITHOUT prices - only modal-based requests
export const services = [
  {
    id: 1,
    name: "Aire Acondicionado Automotriz",
    description: "Diagnóstico, reparación y mantenimiento completo del sistema de A/C con equipos de última generación",
    duration: "2-4 horas",
    includes: ["Diagnóstico computarizado completo", "Revisión de gas refrigerante", "Limpieza de filtros y evaporador", "Prueba de funcionamiento", "Garantía de 1 año"],
    image: "https://images.pexels.com/photos/8986070/pexels-photo-8986070.jpeg?w=500&h=300&fit=crop",
    specialty: true,
    badge: "ESPECIALIDAD"
  },
  {
    id: 2,
    name: "Chapistería y Pintura",
    description: "Reparación de carrocería y pintura profesional con técnicas avanzadas y garantía total",
    duration: "3-7 días",
    includes: ["Evaluación completa de daños", "Preparación profesional de superficie", "Aplicación de pintura automotriz", "Pulido y acabado final", "Garantía de color"],
    image: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=500&h=300&fit=crop",
    specialty: true,
    badge: "PREMIUM"
  },
  {
    id: 3,
    name: "Mecánica Ligera",
    description: "Reparaciones menores y mantenimiento preventivo con técnicos certificados",
    duration: "1-3 horas",
    includes: ["Diagnóstico inicial gratuito", "Cambio de piezas menores", "Ajustes y calibraciones", "Recomendaciones preventivas", "Garantía del trabajo"],
    image: "https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?w=500&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Cambio de Aceite y Filtros",
    description: "Servicio completo de lubricación con aceites premium Motul y ENI",
    duration: "45 minutos",
    includes: ["Aceite premium a elección", "Filtro de aceite original", "Revisión completa de niveles", "Inspección general gratuita", "Registro de mantenimiento"],
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=500&h=300&fit=crop",
    badge: "RÁPIDO"
  },
  {
    id: 5,
    name: "Diagnóstico Computarizado",
    description: "Escaneo completo con equipos profesionales de última generación",
    duration: "30-60 minutos",
    includes: ["Lectura completa de códigos", "Reporte técnico detallado", "Recomendaciones prioritarias", "Borrado de códigos", "Consulta técnica"],
    image: "https://images.unsplash.com/photo-1606577924006-27d39b132ae2?w=500&h=300&fit=crop",
    badge: "TECNOLOGÍA"
  },
  {
    id: 6,
    name: "Instalación de Papel Ahumado",
    description: "Polarizado profesional con films de alta calidad y garantía extendida",
    duration: "2-3 horas",
    includes: ["Medición y corte preciso", "Instalación libre de burbujas", "Films certificados", "Limpieza completa", "Garantía de 2 años"],
    image: "https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?w=500&h=300&fit=crop",
    badge: "GARANTÍA 2 AÑOS"
  },
  {
    id: 7,
    name: "Reparación de Frenos",
    description: "Servicio completo de sistema de frenos con repuestos originales",
    duration: "2-4 horas",
    includes: ["Inspección completa del sistema", "Cambio de pastillas/zapatas", "Revisión de discos/tambores", "Purgado del sistema", "Prueba de carretera"],
    image: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=500&h=300&fit=crop",
    badge: "SEGURIDAD"
  },
  {
    id: 8,
    name: "Suspensión y Dirección",
    description: "Diagnóstico y reparación de sistema de suspensión y dirección",
    duration: "3-5 horas",
    includes: ["Diagnóstico computarizado", "Revisión de amortiguadores", "Inspección de rótulas", "Alineación incluida", "Prueba de manejo"],
    image: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&h=300&fit=crop"
  }
];

// Updated promotions with real professional images and unified WhatsApp
export const promotions = [
  {
    id: 1,
    title: "Mantenimiento Preventivo Premium",
    description: "Aceite Motul o ENI + Filtros + Mano de Obra",
    originalPrice: 65,
    discountPrice: 49.99,
    image: "https://images.pexels.com/photos/10490621/pexels-photo-10490621.jpeg?w=800&h=500&fit=crop",
    validUntil: "2025-03-31",
    includes: ["4 litros de aceite premium", "Filtro de aceite original", "Mano de obra especializada", "Revisión completa gratuita"],
    badge: "ACEITES PREMIUM",
    vehicleTypes: ["Sedanes", "Hatchbacks"],
    note: "Puedes elegir entre aceite Motul 10W-30 4100 Protect o 10W-30 ENI i-Sint Professional",
    whatsapp: "66385935"
  },
  {
    id: 2,
    title: "Sistema Aire Acondicionado Completo",
    description: "Reparación integral con garantía de 1 año",
    originalPrice: 600,
    discountPrice: 480,
    image: "https://images.unsplash.com/photo-1708745427274-d5de5122fd57?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxhdXRvJTIwbWVjaGFuaWMlMjBhYyUyMHJlcGFpcnxlbnwwfHx8fDE3NDk2OTIwNzR8MA&ixlib=rb-4.1.0&q=85&w=800&h=500&fit=crop",
    validUntil: "2025-03-31",
    includes: [
      "Compresor de A/C",
      "Condensador",
      "Cambio de sellos",
      "Descontaminación del sistema",
      "Vacío del sistema",
      "Recarga de gas",
      "Prueba de fuga",
      "Mano de obra especializada"
    ],
    badge: "1 AÑO DE GARANTÍA",
    whatsapp: "66385935",
    instagram: "@confiautospanama"
  },
  {
    id: 3,
    title: "Mantenimiento Preventivo Completo",
    description: "Servicio integral con aceite premium y múltiples filtros",
    originalPrice: 95,
    discountPrice: 75,
    image: "https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?w=800&h=500&fit=crop",
    validUntil: "2025-03-31",
    includes: [
      "5L de aceite premium",
      "Filtro de aceite",
      "Arandela de cobre",
      "Filtro de aire de motor",
      "Filtro de aire de cabina",
      "Mano de obra especializada"
    ],
    badge: "SERVICIO COMPLETO",
    website: "www.confipartespty.com",
    whatsapp: "66385935"
  }
];

// Enhanced testimonials with more automotive focus
export const testimonials = [
  {
    id: 1,
    name: "Carlos Mendoza",
    service: "Aire Acondicionado",
    rating: 5,
    comment: "Excelente servicio de aire acondicionado. Mi auto quedó helando como nuevo y el trabajo fue muy profesional. La garantía de 1 año me da mucha tranquilidad.",
    date: "2024-11-15",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    vehicleType: "Toyota Corolla 2019"
  },
  {
    id: 2,
    name: "María González",
    service: "Chapistería y Pintura",
    rating: 5,
    comment: "Increíble trabajo de pintura en mi auto. Había un rayón profundo y quedó perfecto, no se nota absolutamente nada. El color coincide perfectamente.",
    date: "2024-11-10",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    vehicleType: "Honda Civic 2020"
  },
  {
    id: 3,
    name: "Roberto Silva",
    service: "Mantenimiento Preventivo",
    rating: 5,
    comment: "Siempre vengo aquí para el mantenimiento de mi pickup. Usan aceites Motul originales y el servicio es rápido. Muy confiables y honestos.",
    date: "2024-11-08",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    vehicleType: "Ford Ranger 2018"
  },
  {
    id: 4,
    name: "Ana Torres",
    service: "Diagnóstico Computarizado",
    rating: 5,
    comment: "Tenía un problema raro con mi auto y en otros talleres no sabían qué era. Aquí me lo diagnosticaron enseguida con sus equipos modernos.",
    date: "2024-11-05",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    vehicleType: "Hyundai Elantra 2021"
  }
];

// Enhanced blog posts with automotive focus
export const blogPosts = [
  {
    id: 1,
    title: "¿Cuándo hacer mantenimiento preventivo a tu auto?",
    excerpt: "Conoce los intervalos ideales según el tipo de aceite: convencional, semi-sintético o sintético. Guía completa con kilometrajes y tiempos.",
    content: "El mantenimiento preventivo es clave para la longevidad de tu vehículo. Con aceites Motul puedes extender los intervalos...",
    author: "Ing. Miguel Herrera",
    date: "2024-11-20",
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
    category: "Mantenimiento",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "Aire Acondicionado: Señales de que necesita servicio",
    excerpt: "Aprende a identificar cuándo tu sistema de A/C necesita atención. Desde ruidos extraños hasta aire caliente.",
    content: "El aire acondicionado es esencial en el clima panameño. Estas señales te indicarán cuándo necesita servicio...",
    author: "Téc. Luis Morales",
    date: "2024-11-18",
    image: "https://images.pexels.com/photos/8986070/pexels-photo-8986070.jpeg?w=600&h=400&fit=crop",
    category: "Aire Acondicionado",
    readTime: "4 min"
  },
  {
    id: 3,
    title: "Aceites Motul vs ENI: ¿Cuál elegir para tu motor?",
    excerpt: "Comparación técnica entre las marcas premium. Viscosidades, aditivos y rendimiento según el tipo de motor.",
    content: "Tanto Motul como ENI son aceites premium, pero cada uno tiene características específicas...",
    author: "Ing. Miguel Herrera",
    date: "2024-11-15",
    image: "https://images.pexels.com/photos/4489760/pexels-photo-4489760.jpeg?w=600&h=400&fit=crop",
    category: "Productos",
    readTime: "6 min"
  }
];

// Mock functions for enhanced functionality
export const mockFunctions = {
  submitContact: (data) => {
    console.log("Enviando formulario de contacto:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "¡Mensaje enviado exitosamente! Te contactaremos en las próximas 2 horas." });
      }, 1000);
    });
  },
  
  bookAppointment: (data) => {
    console.log("Reservando cita:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "¡Cita agendada exitosamente! Te confirmaremos por WhatsApp en los próximos 30 minutos." });
      }, 1000);
    });
  },
  
  requestServiceQuote: (data) => {
    console.log("Solicitando cotización de servicio:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: `¡Solicitud enviada para ${data.serviceName}! Te responderemos con precios y disponibilidad en máximo 2 horas.`
        });
      }, 1000);
    });
  },

  requestProductQuote: (data) => {
    console.log("Solicitando cotización de productos:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          success: true, 
          message: `¡Cotización solicitada para ${data.products.length} producto(s)! Te enviaremos precios y disponibilidad por WhatsApp.`
        });
      }, 1000);
    });
  },
  
  subscribeNewsletter: (email) => {
    console.log("Suscribiendo al newsletter:", email);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "¡Suscripción exitosa! Recibirás ofertas especiales y consejos automotrices." });
      }, 1000);
    });
  },
  
  addToQuoteList: (product) => {
    // Simulate adding to quote list stored in localStorage
    const currentList = JSON.parse(localStorage.getItem('quoteList') || '[]');
    const existingIndex = currentList.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
      currentList[existingIndex].quantity += 1;
    } else {
      currentList.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('quoteList', JSON.stringify(currentList));
    return currentList;
  },

  getQuoteList: () => {
    return JSON.parse(localStorage.getItem('quoteList') || '[]');
  },

  removeFromQuoteList: (productId) => {
    const currentList = JSON.parse(localStorage.getItem('quoteList') || '[]');
    const newList = currentList.filter(item => item.id !== productId);
    localStorage.setItem('quoteList', JSON.stringify(newList));
    return newList;
  }
};