import { db } from './database';
import type { Branch } from './types';

export function seedBranches() {
  const existingBranches = db.getBranches();
  
  // Only seed if no branches exist
  if (existingBranches.length > 0) {
    console.log('Branches already exist, skipping seed');
    return;
  }

  console.log('Seeding sample branches...');

  const sampleBranches: Omit<Branch, 'id'>[] = [
    {
      translations: {
        en: {
          name: 'eChefs Downtown',
          address: '123 Main Street, Downtown District',
        },
        ar: {
          name: 'إي شيفز وسط المدينة',
          address: '123 الشارع الرئيسي، منطقة وسط المدينة',
        },
        ru: {
          name: 'eChefs Центр',
          address: '123 Главная улица, Центральный район',
        },
        ky: {
          name: 'eChefs Шаар Борбору',
          address: '123 Башкы көчө, Шаар борбору',
        },
      },
      location: {
        latitude: 42.8746,
        longitude: 74.5698,
      },
      phone: '+996 312 123 456',
      email: 'downtown@echefs.com',
      hours: {
        monday: { open: '09:00', close: '23:00' },
        tuesday: { open: '09:00', close: '23:00' },
        wednesday: { open: '09:00', close: '23:00' },
        thursday: { open: '09:00', close: '23:00' },
        friday: { open: '09:00', close: '01:00' },
        saturday: { open: '10:00', close: '01:00' },
        sunday: { open: '10:00', close: '22:00' },
      },
      regions: [
        {
          id: 'region_dt_main',
          translations: {
            en: 'Main Dining Hall',
            ar: 'قاعة الطعام الرئيسية',
            ru: 'Основной зал',
            ky: 'Негизги зал',
          },
          type: 'mainHall',
          tables: [
            {
              id: 'table_dt_1',
              number: 1,
              seats: 4,
              qrCode: 'QR-DT-MAIN-001',
              nfcId: 'NFC-DT-001',
              status: 'available',
            },
            {
              id: 'table_dt_2',
              number: 2,
              seats: 4,
              qrCode: 'QR-DT-MAIN-002',
              nfcId: 'NFC-DT-002',
              status: 'available',
            },
            {
              id: 'table_dt_3',
              number: 3,
              seats: 6,
              qrCode: 'QR-DT-MAIN-003',
              nfcId: 'NFC-DT-003',
              status: 'available',
            },
            {
              id: 'table_dt_4',
              number: 4,
              seats: 2,
              qrCode: 'QR-DT-MAIN-004',
              status: 'available',
            },
            {
              id: 'table_dt_5',
              number: 5,
              seats: 8,
              qrCode: 'QR-DT-MAIN-005',
              status: 'available',
            },
          ],
          capacity: 24,
        },
        {
          id: 'region_dt_vip',
          translations: {
            en: 'VIP Lounge',
            ar: 'صالة كبار الشخصيات',
            ru: 'VIP зона',
            ky: 'VIP зона',
          },
          type: 'vip',
          tables: [
            {
              id: 'table_dt_vip1',
              number: 101,
              seats: 4,
              qrCode: 'QR-DT-VIP-101',
              nfcId: 'NFC-DT-VIP-101',
              status: 'available',
            },
            {
              id: 'table_dt_vip2',
              number: 102,
              seats: 6,
              qrCode: 'QR-DT-VIP-102',
              nfcId: 'NFC-DT-VIP-102',
              status: 'available',
            },
          ],
          capacity: 10,
        },
        {
          id: 'region_dt_outdoor',
          translations: {
            en: 'Outdoor Terrace',
            ar: 'التراس الخارجي',
            ru: 'Открытая терраса',
            ky: 'Сырткы терраса',
          },
          type: 'outdoor',
          tables: [
            {
              id: 'table_dt_out1',
              number: 201,
              seats: 4,
              qrCode: 'QR-DT-OUT-201',
              status: 'available',
            },
            {
              id: 'table_dt_out2',
              number: 202,
              seats: 4,
              qrCode: 'QR-DT-OUT-202',
              status: 'available',
            },
            {
              id: 'table_dt_out3',
              number: 203,
              seats: 2,
              qrCode: 'QR-DT-OUT-203',
              status: 'available',
            },
          ],
          capacity: 10,
        },
      ],
      enabledMenuTypes: ['main', 'breakfast', 'lunch', 'dinner', 'drinks', 'desserts'],
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      enabled: true,
    },
    {
      translations: {
        en: {
          name: 'eChefs Riverside',
          address: '456 River Road, Waterfront',
        },
        ar: {
          name: 'إي شيفز ريفرسايد',
          address: '456 طريق النهر، الواجهة المائية',
        },
        ru: {
          name: 'eChefs Риверсайд',
          address: '456 Речная дорога, Набережная',
        },
        ky: {
          name: 'eChefs Дарыя жээги',
          address: '456 Дарыя жолу, Суу боюнда',
        },
      },
      location: {
        latitude: 42.8456,
        longitude: 74.6123,
      },
      phone: '+996 312 456 789',
      email: 'mall@echefs.com',
      hours: {
        monday: { open: '10:00', close: '22:00' },
        tuesday: { open: '10:00', close: '22:00' },
        wednesday: { open: '10:00', close: '22:00' },
        thursday: { open: '10:00', close: '22:00' },
        friday: { open: '10:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '22:00' },
      },
      regions: [
        {
          id: 'region_mall_main',
          translations: {
            en: 'Main Dining Area',
            ar: 'منطقة تناول الطعام الرئيسية',
            ru: 'Основная зона питания',
            ky: 'Негизги тамактануу зонасы',
          },
          type: 'mainHall',
          tables: [
            {
              id: 'table_mall_1',
              number: 1,
              seats: 4,
              qrCode: 'QR-MALL-001',
              status: 'available',
            },
            {
              id: 'table_mall_2',
              number: 2,
              seats: 4,
              qrCode: 'QR-MALL-002',
              status: 'available',
            },
            {
              id: 'table_mall_3',
              number: 3,
              seats: 2,
              qrCode: 'QR-MALL-003',
              status: 'available',
            },
            {
              id: 'table_mall_4',
              number: 4,
              seats: 2,
              qrCode: 'QR-MALL-004',
              status: 'available',
            },
          ],
          capacity: 12,
        },
        {
          id: 'region_mall_bar',
          translations: {
            en: 'Bar Counter',
            ar: 'طاولة البار',
            ru: 'Барная стойка',
            ky: 'Бар столу',
          },
          type: 'bar',
          tables: [
            {
              id: 'table_mall_bar1',
              number: 10,
              seats: 1,
              qrCode: 'QR-MALL-BAR-10',
              status: 'available',
            },
            {
              id: 'table_mall_bar2',
              number: 11,
              seats: 1,
              qrCode: 'QR-MALL-BAR-11',
              status: 'available',
            },
            {
              id: 'table_mall_bar3',
              number: 12,
              seats: 1,
              qrCode: 'QR-MALL-BAR-12',
              status: 'available',
            },
          ],
          capacity: 3,
        },
      ],
      enabledMenuTypes: ['main', 'lunch', 'drinks', 'desserts', 'business'],
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      enabled: true,
    },
    {
      translations: {
        en: {
          name: 'eChefs Garden',
          address: '789 Park Avenue, Green District',
        },
        ar: {
          name: 'إي شيفز جاردن',
          address: '789 شارع الحديقة، المنطقة الخضراء',
        },
        ru: {
          name: 'eChefs Сад',
          address: '789 Парковая аллея, Зеленый район',
        },
        ky: {
          name: 'eChefs Багы',
          address: '789 Парк проспекти, Жашыл район',
        },
      },
      location: {
        latitude: 43.0612,
        longitude: 74.4776,
      },
      phone: '+996 312 789 012',
      email: 'garden@echefs.com',
      hours: {
        monday: { open: '05:00', close: '23:00' },
        tuesday: { open: '05:00', close: '23:00' },
        wednesday: { open: '05:00', close: '23:00' },
        thursday: { open: '05:00', close: '23:00' },
        friday: { open: '05:00', close: '23:00' },
        saturday: { open: '05:00', close: '23:00' },
        sunday: { open: '05:00', close: '23:00' },
      },
      regions: [
        {
          id: 'region_airport_quick',
          translations: {
            en: 'Quick Service Area',
            ar: 'منطقة الخدمة السريعة',
            ru: 'Зона быстрого обслуживания',
            ky: 'Тез тейлөө зонасы',
          },
          type: 'mainHall',
          tables: [
            {
              id: 'table_air_1',
              number: 1,
              seats: 2,
              qrCode: 'QR-AIR-001',
              status: 'available',
            },
            {
              id: 'table_air_2',
              number: 2,
              seats: 2,
              qrCode: 'QR-AIR-002',
              status: 'available',
            },
            {
              id: 'table_air_3',
              number: 3,
              seats: 4,
              qrCode: 'QR-AIR-003',
              status: 'available',
            },
          ],
          capacity: 8,
        },
      ],
      enabledMenuTypes: ['main', 'breakfast', 'drinks', 'business'],
      imageUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
      enabled: true,
    },
  ];

  // Add sample branches
  sampleBranches.forEach(branch => {
    try {
      const addedBranch = db.addBranch(branch);
      console.log(`✓ Added branch: ${branch.translations.en.name} (ID: ${addedBranch.id})`);
    } catch (error) {
      console.error(`✗ Failed to add branch: ${branch.translations.en.name}`, error);
    }
  });

  console.log('✓ Branch seeding completed!');
}