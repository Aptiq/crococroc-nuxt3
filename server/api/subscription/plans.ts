export const plans = {
  free: {
    name: 'Freemium',
    price: 0,
    features: ['5 analyses/mois', 'Export PDF basique'],
    limits: {
      analysesPerMonth: 5,
      usersCount: 1
    }
  },
  business: {
    name: 'Business',
    price: 29,
    features: ['Analyses illimitées', 'Export avancé', 'Support prioritaire'],
    limits: {
      analysesPerMonth: -1,
      usersCount: 5
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    features: ['Tout inclus', 'API access', 'Support dédié'],
    limits: {
      analysesPerMonth: -1,
      usersCount: -1
    }
  }
} 