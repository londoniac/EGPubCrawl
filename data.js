/*
 * The Pint & Index — data file
 * ---------------------------------------------
 * All prices are PLACEHOLDER data, pending the real crawl.
 * Edit the numbers below, commit, push. GitHub Pages does the rest.
 *
 * Fields:
 *   id           — short slug, also used by the crawl order
 *   name         — pub name as it appears on the sign
 *   type         — tenure / category ("Wetherspoons", "Young's", etc.)
 *   address      — full postal address
 *   phone        — dialable number (mobile-friendly tel: links)
 *   lat, lng     — map coordinates
 *   description  — one-line cheeky dossier summary
 *   prices       — pint prices (GBP). Use null if the pub does not serve it.
 *   scores       — Dad Index sub-scores, each 0–10
 */

const MIN_WAGE_HOURLY = 12.21; // £/hr, UK National Living Wage, April 2025

const LAST_UPDATED = "April 2026";

const PUBS = [
  {
    id: "ounce-ivy",
    name: "The Ounce & Ivy Bush",
    type: "Wetherspoons",
    address: "The Atrium, Little King St, East Grinstead, RH19 3DJ",
    phone: "01342 335130",
    lat: 51.1264628,
    lng: -0.0084862,
    description: "Carpeted, cheap, cheerful. The pint you can actually afford.",
    prices: {
      carling: 3.19,
      guinness: 4.45,
      madri: 3.99,
      stella: 3.99,
      ipa: 4.15,
      houseLager: 3.19
    },
    scores: {
      price: 10,
      guinness: 5,
      garden: 4,
      footie: 7,
      dog: 7
    }
  },
  {
    id: "ship-inn",
    name: "The Ship Inn",
    type: "Young's",
    address: "Ship Street, East Grinstead, RH19 4EG",
    phone: "01342 830822",
    lat: 51.123927,
    lng: -0.009169,
    description: "A proper Young's house. Look smart; there is often a quiz.",
    prices: {
      carling: 5.40,
      guinness: 6.20,
      madri: 5.80,
      stella: 5.60,
      ipa: 5.50,
      houseLager: 5.40
    },
    scores: {
      price: 5,
      guinness: 8,
      garden: 9,
      footie: 7,
      dog: 9
    }
  },
  {
    id: "crown",
    name: "The Crown",
    type: "Traditional",
    address: "35 High Street, East Grinstead, RH19 3AF",
    phone: "01342 327947",
    lat: 51.1240583,
    lng: -0.0067111,
    description: "Beams, brass, and a landlord who knows your pint before you do.",
    prices: {
      carling: 5.20,
      guinness: 5.90,
      madri: 5.60,
      stella: 5.50,
      ipa: 5.30,
      houseLager: 5.20
    },
    scores: {
      price: 6,
      guinness: 7,
      garden: 5,
      footie: 8,
      dog: 8
    }
  },
  {
    id: "dorset-arms",
    name: "The Dorset Arms",
    type: "Greene King",
    address: "58 High Street, East Grinstead, RH19 3DE",
    phone: "01342 316363",
    lat: 51.1236757,
    lng: -0.0055988,
    description: "Greene King reliability. IPA on, footie on, job's a good 'un.",
    prices: {
      carling: 5.30,
      guinness: 6.00,
      madri: 5.70,
      stella: 5.60,
      ipa: 5.40,
      houseLager: 5.30
    },
    scores: {
      price: 6,
      guinness: 7,
      garden: 6,
      footie: 8,
      dog: 8
    }
  },
  {
    id: "engine-room",
    name: "The Engine Room",
    type: "Micropub",
    address: "1st Floor, The Old Mill, 45 London Rd, East Grinstead, RH19 1AW",
    phone: "01342 327145",
    lat: 51.1255368,
    lng: -0.0082213,
    description: "No Madri, no Carling, no apologies. They will convert you anyway.",
    prices: {
      carling: null,
      guinness: 5.80,
      madri: null,
      stella: null,
      ipa: 5.20,
      houseLager: null
    },
    scores: {
      price: 7,
      guinness: 9,
      garden: 2,
      footie: 1,
      dog: 6
    }
  },
  {
    id: "open-arms",
    name: "The Open Arms",
    type: "Community",
    address: "51 Railway Approach, East Grinstead, RH19 1BT",
    phone: "07448 957504",
    lat: 51.1264298,
    lng: -0.0129604,
    description: "Community-run, dog-friendly, and unofficial HQ of match day.",
    prices: {
      carling: 4.50,
      guinness: 5.30,
      madri: 5.00,
      stella: 4.80,
      ipa: 4.90,
      houseLager: 4.50
    },
    scores: {
      price: 8,
      guinness: 6,
      garden: 4,
      footie: 9,
      dog: 9
    }
  },
  {
    id: "bridge-bar",
    name: "The Bridge Bar",
    type: "Late Night",
    address: "129 London Rd, East Grinstead, RH19 1EQ",
    phone: "01342 300022",
    lat: 51.1270652,
    lng: -0.0114921,
    description: "Open when the others are not. Do not arrive here first.",
    prices: {
      carling: 5.70,
      guinness: 6.40,
      madri: 6.00,
      stella: 5.90,
      ipa: 5.80,
      houseLager: 5.70
    },
    scores: {
      price: 4,
      guinness: 6,
      garden: 3,
      footie: 8,
      dog: 3
    }
  },
  {
    id: "dunnings-mill",
    name: "The Old Dunnings Mill",
    type: "Gastropub",
    address: "Dunning's Road, East Grinstead, RH19 4AT",
    phone: "01342 821080",
    lat: 51.114239,
    lng: -0.012119,
    description: "The one with the garden. Takes a reservation. Takes a toll.",
    prices: {
      carling: 6.20,
      guinness: 6.80,
      madri: 6.50,
      stella: 6.40,
      ipa: 6.30,
      houseLager: 6.20
    },
    scores: {
      price: 2,
      guinness: 7,
      garden: 10,
      footie: 5,
      dog: 10
    }
  }
];

/* Default Dad Index weights — editable live via sliders. */
const DEFAULT_WEIGHTS = {
  price: 40,
  guinness: 20,
  garden: 15,
  footie: 15,
  dog: 10
};

/* The Optimised Crawl — stops, times, walking notes, in order. */
const CRAWL = [
  { order: 1, id: "open-arms",     time: "12:00", note: "Start by the station." },
  { order: 2, id: "bridge-bar",    time: "13:00", note: "3 min walk." },
  { order: 3, id: "engine-room",   time: "13:45", note: "4 min walk. Craft beer palate reset." },
  { order: 4, id: "ounce-ivy",     time: "14:45", note: "2 min walk. LUNCH STOP — full hour, tactical refuel. Burger, chips, cheap pint.", lunch: true },
  { order: 5, id: "crown",         time: "16:00", note: "2 min walk." },
  { order: 6, id: "dorset-arms",   time: "16:45", note: "30 seconds — you can see it from the door." },
  { order: 7, id: "ship-inn",      time: "17:30", note: "3 min walk." },
  { order: 8, id: "dunnings-mill", time: "18:30", note: "Dinner to finish. Order a taxi — 25 min walk otherwise.", finish: true }
];

/* Personality quiz.
 * For each answer, the `points` object awards score to named pubs.
 * The pub with the highest total wins. Ties fall to the first declared. */
const QUIZ = [
  {
    question: "Sunday afternoon plan?",
    answers: [
      { label: "Roast, paper, pint, nap.", points: { "ship-inn": 3, "dunnings-mill": 3, "crown": 2 } },
      { label: "Beer garden until the sun goes down.", points: { "dunnings-mill": 4, "ship-inn": 2 } },
      { label: "Pub quiz and a proper Guinness.", points: { "engine-room": 3, "ship-inn": 3, "dorset-arms": 1 } },
      { label: "Four pints for the price of three.", points: { "ounce-ivy": 4, "open-arms": 2 } }
    ]
  },
  {
    question: "Preferred TV sport?",
    answers: [
      { label: "Premier League, obviously.", points: { "open-arms": 3, "dorset-arms": 2, "crown": 2 } },
      { label: "Six Nations with a proper pie.", points: { "crown": 3, "ship-inn": 2, "dorset-arms": 2 } },
      { label: "Darts. Nothing else comes close.", points: { "ounce-ivy": 3, "bridge-bar": 2, "open-arms": 1 } },
      { label: "None. The TV should be off.", points: { "engine-room": 5, "dunnings-mill": 2 } }
    ]
  },
  {
    question: "Dog or no dog?",
    answers: [
      { label: "Dog. Always dog.", points: { "ship-inn": 3, "dunnings-mill": 3, "open-arms": 2, "crown": 2 } },
      { label: "No dog, but tolerant.", points: { "dorset-arms": 2, "crown": 2, "ounce-ivy": 2 } },
      { label: "Strongly no dog.", points: { "bridge-bar": 3, "engine-room": 2 } }
    ]
  },
  {
    question: "How do you take your Guinness?",
    answers: [
      { label: "Two-part pour, temple-cold, six-minute wait.", points: { "engine-room": 4, "ship-inn": 3 } },
      { label: "However it comes, as long as it is on.", points: { "dorset-arms": 3, "crown": 3, "open-arms": 2 } },
      { label: "I drink Madri.", points: { "ounce-ivy": 4, "bridge-bar": 2, "dunnings-mill": 2 } },
      { label: "A cold lager, thanks.", points: { "ounce-ivy": 3, "open-arms": 2, "bridge-bar": 2 } }
    ]
  },
  {
    question: "Pint budget?",
    answers: [
      { label: "Under £4. Non-negotiable.", points: { "ounce-ivy": 5 } },
      { label: "£4–£5. Fair's fair.", points: { "open-arms": 4, "crown": 2, "dorset-arms": 2 } },
      { label: "£5–£6. You pay for atmosphere.", points: { "ship-inn": 3, "crown": 3, "dorset-arms": 3, "engine-room": 2 } },
      { label: "Whatever the pub charges. It's a hobby.", points: { "dunnings-mill": 5, "bridge-bar": 2 } }
    ]
  }
];

/* Verdict lines for quiz results — keyed by pub id. */
const VERDICTS = {
  "ounce-ivy":     "You are a Wetherspoons dad — pragmatic, unsentimental, and you know the app order by heart.",
  "ship-inn":      "You are a Ship Inn dad — steady, reliable, and you always know which game is on.",
  "crown":         "You are a Crown dad — traditional, stubborn, and loyal to a specific corner table.",
  "dorset-arms":   "You are a Dorset Arms dad — dependable, Greene King in your veins, home by half ten.",
  "engine-room":   "You are an Engine Room dad — you have opinions about hop varieties and are not afraid to share them.",
  "open-arms":     "You are an Open Arms dad — community-minded, match-day faithful, dog in tow.",
  "bridge-bar":    "You are a Bridge Bar dad — the night is young, even if you are not.",
  "dunnings-mill": "You are an Old Dunnings Mill dad — you will pay for the garden, and you will enjoy it."
};
