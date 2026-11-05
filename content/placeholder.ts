/**
 * STARTER CONTENT — Arath & Ruby Garza · April 24, 2027
 * Shown until Sanity is connected (see docs/SETUP.md); after that, edit everything from /studio.
 * Anything in [brackets] is a fact we still need to fill in. Event times are samples.
 * Real photos live in public/photos (add more with scripts/add-photo.mjs);
 * the soft-blur images in public/placeholders are temporary stand-ins.
 */
import placeholders from './placeholder-images.json'
import photos from './photos.json'
import type { Img, SiteContent } from '@/lib/types'

type Slot = keyof typeof placeholders
type PhotoName = keyof typeof photos

/** Temporary stand-in image (flagged as placeholder) */
const img = (slot: Slot, alt: string): Img => ({ ...placeholders[slot], alt, placeholder: true })

/** One of our real photos */
const photo = (name: PhotoName, alt: string): Img => ({ ...(photos[name] as Img), alt, placeholder: false })

const CREDIT = 'Engagement photos by Roy Esparza Photography'

export const placeholderContent: SiteContent = {
  settings: {
    partnerOne: 'Arath',
    partnerTwo: 'Ruby',
    lastName: 'Garza',
    // Ceremony time is a sample — the date comes from our save-the-date
    date: '2027-04-24T16:30:00-05:00',
    dateLabel: 'April 24, 2027',
    location: '[City, State]',
    tagline: 'Together with our families, we invite you to celebrate with us.',
    heroImage: photo('engagement-dip-kiss', 'Arath dipping Ruby into a kiss between tall white columns'),
    shareImage: photo('engagement-save-the-date', 'Arath and Ruby on the steps holding a “Save the Date — 04.24.2027” sign'),
    photoCredit: CREDIT,
    intro: {
      eyebrow: 'Welcome',
      heading: 'We’re getting married — and we want you there.',
      body: 'We built this site so you have everything in one place: when to arrive, where to stay, what to wear, and a few stories about how we got here. Look around, RSVP when you’re ready, and text us if anything is unclear.',
      image: photo('engagement-cheek-kiss', 'Ruby wrapping her arms around Arath and kissing his cheek'),
    },
    rsvpDeadline: '2027-03-01T23:59:00-06:00',
    rsvpDeadlineLabel: '[March 1, 2027]',
    hashtag: '#ArathAndRuby',
    contactEmail: 'hello@example.com',
    nav: [
      { label: 'Our Story', href: '/story' },
      { label: 'Schedule', href: '/schedule' },
      { label: 'Travel', href: '/travel' },
      { label: 'Wedding Party', href: '/party' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Registry', href: '/registry' },
      { label: 'FAQ', href: '/faq' },
    ],
    footerNote: 'Made with love, for the people we love.',
  },

  events: [
    {
      id: 'welcome',
      name: 'Welcome Drinks',
      start: '2027-04-23T19:00:00-05:00',
      end: '2027-04-23T22:00:00-05:00',
      dayLabel: 'Friday, April 23',
      timeLabel: '7:00 PM',
      venue: '[Welcome venue]',
      address: '[Street address, City]',
      mapUrl: 'https://maps.google.com',
      attire: 'Casual',
      description: 'Come say hi, grab a drink, and meet the people you’ll be dancing with tomorrow. No speeches, we promise.',
      image: img('venue-reception', 'Placeholder — welcome drinks venue'),
    },
    {
      id: 'ceremony',
      name: 'Ceremony',
      start: '2027-04-24T16:30:00-05:00',
      end: '2027-04-24T17:15:00-05:00',
      dayLabel: 'Saturday, April 24',
      timeLabel: '4:30 PM',
      venue: '[Ceremony venue]',
      address: '[Street address, City]',
      mapUrl: 'https://maps.google.com',
      attire: '[Dress code]',
      description: 'Please arrive 30 minutes early so you can find your seat before we begin.',
      image: img('venue-ceremony', 'Placeholder — ceremony venue'),
    },
    {
      id: 'reception',
      name: 'Dinner & Dancing',
      start: '2027-04-24T18:00:00-05:00',
      end: '2027-04-24T23:30:00-05:00',
      dayLabel: 'Saturday, April 24',
      timeLabel: '6:00 PM',
      venue: '[Reception venue]',
      address: '[Street address, City]',
      mapUrl: 'https://maps.google.com',
      attire: '[Dress code]',
      description: 'Cocktail hour, dinner, and a dance floor that we fully expect you to use.',
      image: img('venue-reception', 'Placeholder — reception venue'),
    },
    {
      id: 'brunch',
      name: 'Farewell Brunch',
      start: '2027-04-25T10:00:00-05:00',
      end: '2027-04-25T12:00:00-05:00',
      dayLabel: 'Sunday, April 25',
      timeLabel: '10:00 AM',
      venue: '[Brunch venue]',
      address: '[Street address, City]',
      mapUrl: 'https://maps.google.com',
      attire: 'Come as you are',
      description: 'Coffee, chilaquiles, and one last hug before everyone heads home.',
    },
  ],

  story: [
    { id: 's1', dateLabel: '[Year]', title: 'The first hello', body: '[How we met — a few sentences. Where were we? Who noticed who first?]', image: photo('engagement-portrait', 'Arath and Ruby standing together by a white railing, Ruby’s hand on his chest') },
    { id: 's2', dateLabel: '[Year]', title: 'Falling for each other', body: '[The first date, the inside jokes, the moment we knew.]', image: photo('proposal-dusk-portrait', 'Arath and Ruby smiling on the beach at dusk, holding pink roses') },
    { id: 's3', dateLabel: '[Year]', title: 'Making it official', body: '[The moment it became “us”.]', image: photo('proposal-carry', 'Arath carrying Ruby in his arms on the beach at night') },
    { id: 's4', dateLabel: '[Month, Year]', title: 'The question', body: '[The proposal story — the beach, the lights, the roses. Who planned it, and what was said?]', image: photo('proposal-ring', 'Ruby showing her engagement ring beside Arath, glowing marquee letters behind them') },
    { id: 's5', dateLabel: '[Month, Year]', title: 'Yes, forever', body: '[What happened next — who we told first, how we celebrated.]', image: photo('proposal-lift', 'Arath lifting Ruby for a kiss under a white arch and marquee lights') },
    { id: 's6', dateLabel: 'April 24, 2027', title: 'Save the date', body: 'And this is where you come in. We can’t wait to celebrate with you.', image: photo('engagement-save-the-date', 'Arath and Ruby on the steps holding a “Save the Date — 04.24.2027” sign') },
  ],

  travel: {
    heading: 'Getting here',
    body: 'Here’s everything you need to plan the trip. If you’re flying, book early — spring weekends fill up fast.',
    image: img('travel-city', 'Placeholder — the city'),
    airports: [
      { code: '[AAA]', name: '[Closest airport]', drive: '[25 min] to the venue' },
      { code: '[BBB]', name: '[Larger airport]', drive: '[1 hr 20 min] to the venue' },
    ],
    tips: [
      { title: 'Getting around', body: '[Rideshare, rental car, or shuttle details. Parking at the venue?]' },
      { title: 'Weather', body: '[Typical late-April weather — warm days, breezy evenings? Bring a layer.]' },
      { title: 'While you’re here', body: '[Our favorite restaurants, the beach, the best tacos in town.]' },
    ],
  },

  hotels: [
    { id: 'h1', name: '[Hotel One]', distance: '[5 min] from venue', price: '[$189]/night', bookingUrl: 'https://example.com', code: '[ARATHRUBY]', deadline: 'Book by [March 24, 2027]', note: '[Shuttle to the venue]', image: img('hotel-01', 'Placeholder — hotel one') },
    { id: 'h2', name: '[Hotel Two]', distance: '[12 min] from venue', price: '[$149]/night', bookingUrl: 'https://example.com', code: '[GARZA27]', deadline: 'Book by [March 24, 2027]', image: img('hotel-02', 'Placeholder — hotel two') },
    { id: 'h3', name: '[Boutique Inn]', distance: '[Walking distance]', price: '[$240]/night', bookingUrl: 'https://example.com', note: 'Small — book early', image: img('hotel-03', 'Placeholder — boutique inn') },
  ],

  people: [
    { id: 'p1', name: '[Name]', role: 'Maid of Honor', note: '[One line about them]', image: img('party-01', 'Placeholder — maid of honor') },
    { id: 'p2', name: '[Name]', role: 'Best Man', note: '[One line about them]', image: img('party-02', 'Placeholder — best man') },
    { id: 'p3', name: '[Name]', role: 'Bridesmaid', note: '[One line about them]', image: img('party-03', 'Placeholder — bridesmaid') },
    { id: 'p4', name: '[Name]', role: 'Groomsman', note: '[One line about them]', image: img('party-04', 'Placeholder — groomsman') },
    { id: 'p5', name: '[Name]', role: 'Bridesmaid', note: '[One line about them]', image: img('party-05', 'Placeholder — bridesmaid') },
    { id: 'p6', name: '[Name]', role: 'Groomsman', note: '[One line about them]', image: img('party-06', 'Placeholder — groomsman') },
    { id: 'p7', name: '[Name]', role: 'Flower Girl', note: '[One line about them]', image: img('party-07', 'Placeholder — flower girl') },
    { id: 'p8', name: '[Name]', role: 'Ring Bearer', note: '[One line about them]', image: img('party-08', 'Placeholder — ring bearer') },
  ],

  faqs: [
    { id: 'f1', question: 'When should I RSVP by?', answer: 'Please RSVP by [March 1, 2027] so we can give final numbers to our caterer. You can change your answer any time before then.' },
    { id: 'f2', question: 'What should I wear?', answer: '[Dress code — e.g. formal: suits or tuxes, long or cocktail dresses.]' },
    { id: 'f3', question: 'Can I bring a date?', answer: 'Your invitation lists everyone we’ve saved a seat for. When you RSVP, you’ll see exactly who’s included.' },
    { id: 'f4', question: 'Are kids welcome?', answer: '[Decide: kids welcome / adults-only reception / immediate family only.]' },
    { id: 'f5', question: 'Is there parking?', answer: '[Parking details — free on-site lot, valet, or take the shuttle from the hotel block.]' },
    { id: 'f6', question: 'Will the ceremony be unplugged?', answer: '[Yes/No — e.g. please keep phones away during the ceremony; our photographer has it covered and we’ll share everything after.]' },
    { id: 'f7', question: 'I have a dietary restriction.', answer: 'Tell us on the RSVP form and we’ll make sure you’re taken care of.' },
    { id: 'f8', question: 'Who do I contact with questions?', answer: 'Text either of us, or email hello@example.com.' },
  ],

  registry: {
    heading: 'Registry',
    body: 'Your presence is truly the best gift. If you’d like to celebrate with something more, we’ve put together a few ideas.',
    image: photo('engagement-ring-embrace', 'Ruby’s hand with her engagement ring resting on the back of Arath’s neck as they embrace'),
    links: [
      { id: 'r1', name: 'Honeymoon Fund', url: 'https://example.com', note: 'Help us get to [destination]' },
      { id: 'r2', name: '[Store registry]', url: 'https://example.com', note: 'For our first home' },
      { id: 'r3', name: '[Second registry]', url: 'https://example.com' },
    ],
  },

  gallery: (
    [
      ['engagement-dip-kiss', 'Arath dipping Ruby into a kiss between tall white columns'],
      ['proposal-kiss-roses', 'A kiss on the beach at night, Ruby holding a bouquet of pink roses'],
      ['engagement-cheek-kiss', 'Ruby kissing Arath on the cheek'],
      ['proposal-lift', 'Arath lifting Ruby under a white arch and marquee lights'],
      ['engagement-save-the-date', 'Holding a “Save the Date — 04.24.2027” sign on the steps'],
      ['proposal-ring', 'Ruby showing her engagement ring on the beach'],
      ['engagement-ring-embrace', 'Ruby’s ring hand resting on Arath’s neck as they embrace'],
      ['proposal-dusk-portrait', 'Smiling together on the beach at dusk'],
      ['engagement-portrait', 'Standing together by a white railing'],
      ['proposal-carry', 'Arath carrying Ruby on the beach at night'],
    ] as [PhotoName, string][]
  ).map(([name, alt]) => ({ id: name, ...photo(name, alt) })),

  pages: [
    {
      slug: 'things-to-do',
      title: 'Things to Do',
      eyebrow: 'While you’re in town',
      sections: [
        { _type: 'richText', _key: 'a', heading: 'Make a weekend of it', body: 'This is an example of a page you can create, edit, and delete yourselves in the Studio — no code needed. Add as many sections as you like and reorder them by dragging.' },
        { _type: 'imageText', _key: 'b', heading: '[Our favorite restaurant]', body: '[Why we love it and what to order.]', image: img('story-04', 'Placeholder — restaurant') },
        { _type: 'imageText', _key: 'c', heading: '[A place to explore]', body: '[A park, a beach, a market — and when to go.]', image: img('story-02', 'Placeholder — a place to explore'), reverse: true },
        { _type: 'cta', _key: 'd', heading: 'Seen enough? Let us know you’re coming.', buttonLabel: 'RSVP', href: '/rsvp' },
      ],
    },
  ],
}

/** Demo guest list used only when Sanity isn't connected. Server-only. */
export const placeholderGuests = [
  { id: 'g1', household: 'The Lopez Family', members: ['Ana Lopez', 'Luis Lopez'], events: ['welcome', 'ceremony', 'reception', 'brunch'] },
  { id: 'g2', household: 'Jordan Lee & Guest', members: ['Jordan Lee', 'Guest'], events: ['ceremony', 'reception'] },
  { id: 'g3', household: 'Test Guest', members: ['Test Guest'], events: ['welcome', 'ceremony', 'reception', 'brunch'] },
]
