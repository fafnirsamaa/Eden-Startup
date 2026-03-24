/** Mock user — swap for API / auth store. */
export const PROFILE_IMG =
  'https://www.figma.com/api/mcp/asset/fded8679-9a6b-46b9-afdf-d77a506d6dae'

export const MOCK_USER = {
  displayName: 'Charles Dupont',
  firstName: 'Charles',
  email: 'charles.dupont@email.com',
  phone: '+33 6 12 34 56 78',
  city: 'Paris',
  memberSince: 'Nov. 2025',
  bio: 'Passionné de jardinage urbain et de tomates cerise.',
  edenDevices: 2,
  activePlants: 12,
  harvestStreakDays: 7,
}

/**
 * Mock notifications — types: harvest | water | tip | promo | system
 * @type {Array<{ id: string, type: string, title: string, body: string, time: string, section: 'today' | 'week' | 'earlier', read: boolean }>}
 */
export const MOCK_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'water',
    title: 'Réserve basse — Eden L',
    body: 'Le réservoir du bac 3 est sous 20 %. Pensez à remplir.',
    time: '09:42',
    section: 'today',
    read: false,
  },
  {
    id: 'n2',
    type: 'harvest',
    title: 'Récolte approche',
    body: 'Vos tomates cerise du bac 1 seront prêtes dans environ 2 semaines.',
    time: '08:15',
    section: 'today',
    read: false,
  },
  {
    id: 'n3',
    type: 'tip',
    title: 'Conseil du jour',
    body: 'Arrosez tôt le matin pour limiter l’évaporation.',
    time: 'Hier',
    section: 'week',
    read: true,
  },
  {
    id: 'n4',
    type: 'promo',
    title: 'Boutique — 20 %',
    body: 'Réduction sur les graines bio cette semaine.',
    time: 'Lun.',
    section: 'week',
    read: true,
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Mise à jour Eden',
    body: 'L’application a été mise à jour avec de nouvelles alertes.',
    time: '15 mars',
    section: 'earlier',
    read: true,
  },
]
