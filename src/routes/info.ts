import { Hono } from 'hono';
import type { Env, ApiResponse } from '../types';

export const infoRouter = new Hono<{ Bindings: Env }>();

// Company and store information
const COMPANY_INFO = {
  name: "Demo E-shop",
  legal_name: "Demo E-shop s.r.o.",
  address: {
    street: "Wenceslas Square 1",
    city: "Prague",
    postal_code: "110 00",
    country: "Czech Republic"
  },
  contact: {
    phone: "+420 123 456 789",
    email: "info@demo-eshop.cz",
    support_email: "support@demo-eshop.cz"
  },
  business_info: {
    ico: "12345678",
    dic: "CZ12345678",
    bank_account: "123456789/0100"
  },
  website: "https://demo-eshop.cz"
};

// Delivery information
const DELIVERY_INFO = {
  methods: [
    {
      id: "czech_post",
      name: "Česká pošta - obyčejné",
      price: 99,
      currency: "CZK",
      delivery_time: "3-5 pracovních dnů",
      description: "Standardní doručení na adresu"
    },
    {
      id: "czech_post_registered",
      name: "Česká pošta - doporučené",
      price: 149,
      currency: "CZK",
      delivery_time: "2-4 pracovní dny",
      description: "Doporučené doručení s možností sledování"
    },
    {
      id: "pickup_point",
      name: "Výdejní místo",
      price: 79,
      currency: "CZK",
      delivery_time: "1-3 pracovní dny",
      description: "Vyzvednutí na výdejním místě"
    },
    {
      id: "courier",
      name: "Kurýr",
      price: 199,
      currency: "CZK",
      delivery_time: "1-2 pracovní dny",
      description: "Osobní doručení kurýrem"
    },
    {
      id: "express",
      name: "Expresní doručení",
      price: 299,
      currency: "CZK",
      delivery_time: "Následující pracovní den",
      description: "Rychlé doručení do 24 hodin"
    }
  ],
  free_delivery_threshold: 1500,
  delivery_zones: [
    {
      name: "Czech Republic",
      available_methods: ["czech_post", "czech_post_registered", "pickup_point", "courier", "express"]
    },
    {
      name: "Slovakia",
      available_methods: ["czech_post", "czech_post_registered"],
      surcharge: 50
    }
  ]
};

// Payment information
const PAYMENT_INFO = {
  methods: [
    {
      id: "card",
      name: "Platební karta",
      description: "Visa, Mastercard, Maestro",
      fee: 0,
      security: "3D Secure"
    },
    {
      id: "bank_transfer",
      name: "Bankovní převod",
      description: "Standardní bankovní převod",
      fee: 0,
      payment_term: "7 dní"
    },
    {
      id: "cash_on_delivery",
      name: "Dobírka",
      description: "Platba při převzetí",
      fee: 49,
      currency: "CZK"
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Rychlá a bezpečná platba",
      fee: 0
    }
  ],
  currencies: ["CZK", "EUR"],
  security_note: "Všechny platby jsou zabezpečeny SSL šifrováním"
};

// Return and warranty information
const RETURN_INFO = {
  return_period: 14,
  return_period_unit: "dní",
  conditions: [
    "Zboží musí být nepoužité a v původním obalu",
    "Vratka musí být oznámena do 14 dnů od doručení",
    "Zákazník hradí náklady na vrácení zboží",
    "Peníze budou vráceny do 14 dnů po obdržení vratky"
  ],
  warranty: {
    standard_period: 24,
    standard_period_unit: "měsíců",
    electronics_period: 24,
    clothing_period: 12,
    description: "Záruční opravy provádíme zdarma v autorizovaných servisech"
  },
  return_address: {
    name: "Demo E-shop s.r.o. - Vratky",
    street: "Wenceslas Square 1",
    city: "Prague", 
    postal_code: "110 00",
    country: "Czech Republic"
  }
};

// Customer service information
const CUSTOMER_SERVICE = {
  support_hours: {
    monday_friday: "8:00 - 18:00",
    saturday: "9:00 - 15:00",
    sunday: "Zavřeno"
  },
  contact_methods: [
    {
      type: "phone",
      value: "+420 123 456 789",
      availability: "Po-Pá 8:00-18:00, So 9:00-15:00"
    },
    {
      type: "email",
      value: "support@demo-eshop.cz",
      response_time: "Do 24 hodin"
    },
    {
      type: "chat",
      value: "Live chat na webu",
      availability: "Po-Pá 8:00-18:00"
    }
  ],
  languages: ["Czech", "Slovak", "English"]
};

// Privacy and terms information
const LEGAL_INFO = {
  privacy_policy_url: "/privacy-policy",
  terms_conditions_url: "/terms-conditions",
  gdpr_compliance: true,
  cookie_policy_url: "/cookie-policy",
  data_retention: "Osobní údaje uchováváme po dobu nezbytnou pro splnění účelu zpracování",
  data_protection_officer: "dpo@demo-eshop.cz"
};

// GET /api/info - Complete store information
infoRouter.get('/', (c) => {
  return c.json({
    success: true,
    data: {
      company: COMPANY_INFO,
      delivery: DELIVERY_INFO,
      payment: PAYMENT_INFO,
      returns: RETURN_INFO,
      customer_service: CUSTOMER_SERVICE,
      legal: LEGAL_INFO,
      last_updated: new Date().toISOString()
    },
    message: 'Informace o obchodě úspěšně načteny'
  } as ApiResponse<any>);
});

// GET /api/info/delivery - Delivery information only
infoRouter.get('/delivery', (c) => {
  return c.json({
    success: true,
    data: DELIVERY_INFO,
    message: 'Informace o doručení úspěšně načteny'
  } as ApiResponse<any>);
});

// GET /api/info/payment - Payment information only
infoRouter.get('/payment', (c) => {
  return c.json({
    success: true,
    data: PAYMENT_INFO,
    message: 'Informace o platbě úspěšně načteny'
  } as ApiResponse<any>);
});

// GET /api/info/returns - Return and warranty information only
infoRouter.get('/returns', (c) => {
  return c.json({
    success: true,
    data: RETURN_INFO,
    message: 'Informace o vrácení zboží úspěšně načteny'
  } as ApiResponse<any>);
});

// GET /api/info/contact - Contact and customer service information only
infoRouter.get('/contact', (c) => {
  return c.json({
    success: true,
    data: {
      company: COMPANY_INFO,
      customer_service: CUSTOMER_SERVICE
    },
    message: 'Kontaktní informace úspěšně načteny'
  } as ApiResponse<any>);
});

// GET /api/info/legal - Legal and privacy information only
infoRouter.get('/legal', (c) => {
  return c.json({
    success: true,
    data: LEGAL_INFO,
    message: 'Právní informace úspěšně načteny'
  } as ApiResponse<any>);
});

// GET /api/info/company - Company information only
infoRouter.get('/company', (c) => {
  return c.json({
    success: true,
    data: COMPANY_INFO,
    message: 'Informace o společnosti úspěšně načteny'
  } as ApiResponse<any>);
});