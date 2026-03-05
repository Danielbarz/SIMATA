// Mock data — Indonesian locale, matching reference design

export const rideTypes = [
  {
    id: 'reguler',
    name: 'Reguler',
    eta: '5-10 Menit',
    description: 'Semua jenis mobil',
    price: 30000,
    priceDisplay: 'Rp30.000',
    image: 'car_reguler', // placeholder key
  },
  {
    id: 'hemat',
    name: 'Hemat',
    eta: '11-25 Menit',
    description: 'Pilihan termurah',
    price: 21500,
    priceDisplay: 'Rp21.500',
    image: 'car_hemat',
  },
  {
    id: 'premium',
    name: 'Premium',
    eta: '8-10 Menit',
    description: 'Mobil lebih nyaman',
    price: 45000,
    priceDisplay: 'Rp45.000',
    image: 'car_premium',
  },
];

export const recentPlaces = [
  {
    id: '1',
    name: 'Stasiun Cisauk - Intermoda BSD',
    address: 'Jl. Raya Cisauk, Tangerang Selatan',
    icon: 'train-outline',
    type: 'station',
  },
  {
    id: '2',
    name: 'AEON Mall BSD City - Gate A',
    address: 'Jl. BSD Raya Utama, Tangerang Selatan',
    icon: 'bag-outline',
    type: 'mall',
  },
  {
    id: '3',
    name: 'Indonesia Convention Exhibition',
    address: 'Jl. BSD Grand Boulevard, BSD City',
    icon: 'business-outline',
    type: 'venue',
  },
  {
    id: '4',
    name: 'The Breeze BSD City',
    address: 'Jl. Grand Boulevard, BSD City',
    icon: 'cafe-outline',
    type: 'lifestyle',
  },
];

export const savedPlaces = [
  {
    id: 'home',
    name: 'Rumah',
    address: 'Jl. Buah Batu No. 42, Bandung',
    icon: 'home',
  },
  {
    id: 'work',
    name: 'Kantor',
    address: 'Jl. Asia Afrika No. 65, Bandung',
    icon: 'briefcase',
  },
];

export const mockDriver = {
  id: 'DRV001',
  name: 'Asep Widiprasetyo',
  rating: 4.92,
  totalRides: 2847,
  vehicleMake: 'Toyota',
  vehicleModel: 'Avanza',
  vehicleColor: 'Silver',
  vehiclePlate: 'B 1234 ABC',
  vehicleYear: 2023,
  avatar: require('../resources/images/Mockup/Asep Widiprasetyo.png'),
  eta: '3 menit',
  phone: '+62812345678',
};

export const rideHistory = [
  {
    id: 'RIDE001',
    date: '2 Mar 2026',
    time: '14:30',
    pickup: 'Stasiun Cisauk',
    dropoff: 'AEON Mall BSD City',
    price: 'Rp30.000',
    status: 'completed',
    rideType: 'Reguler',
    rating: 5,
  },
  {
    id: 'RIDE002',
    date: '1 Mar 2026',
    time: '09:15',
    pickup: 'Rumah',
    dropoff: 'Stasiun Cisauk',
    price: 'Rp18.000',
    status: 'completed',
    rideType: 'Hemat',
    rating: 4,
  },
  {
    id: 'RIDE003',
    date: '28 Feb 2026',
    time: '20:00',
    pickup: 'The Breeze BSD',
    dropoff: 'Rumah',
    price: 'Rp25.000',
    status: 'completed',
    rideType: 'Reguler',
    rating: 5,
  },
  {
    id: 'RIDE004',
    date: '27 Feb 2026',
    time: '07:45',
    pickup: 'Rumah',
    dropoff: 'ICE BSD',
    price: 'Rp15.000',
    status: 'cancelled',
    rideType: 'Hemat',
    rating: null,
  },
];

export const promoOffers = [
  {
    id: 'PROMO1',
    title: 'Diskon 50% Perjalanan Pertama',
    description: 'Khusus pengguna baru',
    code: 'SIMATA50',
    validUntil: '31 Mar 2026',
  },
  {
    id: 'PROMO2',
    title: 'Gratis Ongkir Weekend',
    description: 'Setiap hari Sabtu',
    code: 'WEEKEND',
    validUntil: '30 Apr 2026',
  },
  {
    id: 'PROMO3',
    title: 'Cashback 30%',
    description: 'Bayar pakai SIMATA Wallet',
    code: 'WALLET30',
    validUntil: '15 Mar 2026',
  },
];

export const userProfile = {
  name: 'Lily Maharani',
  email: 'lily@simata.id',
  phone: '+62 812 3456 789',
  avatar: require('../resources/images/Mockup/Lily Maharani.png'),
  walletBalance: 'Rp150.000',
  memberSince: 'Jan 2025',
  totalRides: 156,
  rating: 4.85,
};

export const paymentMethods = [
  {
    id: 'qris',
    name: 'QRIS',
    icon: 'qr-code-outline',
    type: 'digital',
  },
  {
    id: 'wallet',
    name: 'SIMATA Pay',
    icon: 'wallet-outline',
    type: 'wallet',
    balance: 'Rp150.000',
  },
  {
    id: 'cash',
    name: 'Tunai',
    icon: 'cash-outline',
    type: 'cash',
  },
];
