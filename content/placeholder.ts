/**
 * STARTER CONTENT — Arath & Ruby Garza · April 24, 2027
 * Shown until Sanity is connected (see docs/SETUP.md); after that, edit everything from /studio.
 * Anything in [brackets] is a fact we still need to fill in.
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
    // Ceremony start — drives the countdown
    date: '2027-04-24T18:00:00-05:00',
    dateLabel: 'April 24, 2027',
    location: 'Brownsville, TX',
    tagline: 'Together with our families, we invite you to celebrate the beginning of our forever.',
    heroImage: photo('engagement-dip-kiss', 'Arath dipping Ruby into a kiss between tall white columns'),
    shareImage: photo('engagement-save-the-date', 'Arath and Ruby on the steps holding a “Save the Date — 04.24.2027” sign'),
    photoCredit: CREDIT,
    intro: {
      eyebrow: 'Welcome',
      heading: 'We’re getting married — and we can’t wait to celebrate with you!',
      // Blank lines between paragraphs (\n\n) become separate paragraphs on the site
      body:
        'We created this website for our friends and family to find everything they need to know about our special day, from venue details and dress code to the wedding schedule.' +
        '\n\nYou’ll also find a glimpse into our love story, with photos and memories from the beginning of our journey to where we are today.' +
        '\n\nTake a look around, RSVP as soon as possible, and feel free to reach out if you have any questions!',
      image: photo('engagement-cheek-kiss', 'Ruby wrapping her arms around Arath and kissing his cheek'),
    },
    rsvpDeadline: '2027-03-01T23:59:00-06:00',
    rsvpDeadlineLabel: 'March 1, 2027',
    hashtag: '#ArathAndRuby',
    contactEmail: 'thegarzas04.24.2027@gmail.com',
    nav: [
      { label: 'Our Story', href: '/story' },
      { label: 'Schedule', href: '/schedule' },
      { label: 'Wedding Party', href: '/party' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Share Photos', href: '/photos' },
      { label: 'Registry', href: '/registry' },
      { label: 'FAQ', href: '/faq' },
    ],
    footerNote: 'Made with love, for the people we love.',
  },

  // All three are at Santa Fe Event Center, Saturday April 24
  events: [
    {
      id: 'ceremony',
      name: 'Ceremony',
      start: '2027-04-24T18:00:00-05:00',
      end: '2027-04-24T19:00:00-05:00',
      dayLabel: 'Saturday, April 24',
      timeLabel: '6:00 PM',
      venue: 'Santa Fe Event Center',
      address: '266 Mexico Blvd, Brownsville, TX',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Santa+Fe+Event+Center+266+Mexico+Blvd+Brownsville+TX+78520',
      attire: 'Formal',
      description: 'Please arrive early so you can find your seat before we begin. This is an unplugged ceremony — no cellphones, please!',
      image: img('venue-ceremony', 'Placeholder — Santa Fe Event Center'),
    },
    {
      id: 'dinner',
      name: 'Dinner',
      start: '2027-04-24T19:00:00-05:00',
      end: '2027-04-24T20:00:00-05:00',
      dayLabel: 'Saturday, April 24',
      timeLabel: '7:00 PM',
      venue: 'Santa Fe Event Center',
      address: '266 Mexico Blvd, Brownsville, TX',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Santa+Fe+Event+Center+266+Mexico+Blvd+Brownsville+TX+78520',
      attire: 'Formal',
      description: 'Come and join us — dinner is on us.',
    },
    {
      id: 'party',
      name: 'Party Time',
      start: '2027-04-24T20:00:00-05:00',
      end: '2027-04-25T00:00:00-05:00',
      dayLabel: 'Saturday, April 24',
      timeLabel: '8:00 PM',
      venue: 'Santa Fe Event Center',
      address: '266 Mexico Blvd, Brownsville, TX',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Santa+Fe+Event+Center+266+Mexico+Blvd+Brownsville+TX+78520',
      attire: 'Formal',
      description: 'Music, dancing, and a dance floor that we fully expect you to use.',
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

  people: [
    // Our parents — photos coming
    { id: 'p1', group: 'parents', name: 'Mayra Garza', role: 'Mother of the Groom', image: img('party-01', 'Placeholder — Mayra Garza') },
    { id: 'p2', group: 'parents', name: 'Jose Garza', role: 'Father of the Groom', image: img('party-02', 'Placeholder — Jose Garza') },
    { id: 'p3', group: 'parents', name: 'Linda Morales', role: 'Mother of the Bride', image: img('party-03', 'Placeholder — Linda Morales') },
    { id: 'p4', group: 'parents', name: 'Felipe Morales', role: 'Father of the Bride', image: img('party-04', 'Placeholder — Felipe Morales') },
    // Padrinos — temporary names and roles
    { id: 'p5', group: 'padrinos', name: '[Name & Name]', role: '[Padrinos de Anillos]', image: img('party-05', 'Placeholder — padrinos') },
    { id: 'p6', group: 'padrinos', name: '[Name & Name]', role: '[Padrinos de Lazo]', image: img('party-06', 'Placeholder — padrinos') },
    { id: 'p7', group: 'padrinos', name: '[Name & Name]', role: '[Padrinos de Arras]', image: img('party-07', 'Placeholder — padrinos') },
    { id: 'p8', group: 'padrinos', name: '[Name & Name]', role: '[Padrinos de Velación]', image: img('party-08', 'Placeholder — padrinos') },
  ],

  faqs: [
    { id: 'f1', question: 'When should I RSVP by?', answer: 'Please RSVP by March 1, 2027 so we can give final numbers to our caterer.' },
    { id: 'f2', question: 'What should I wear?', answer: 'Formal: suits or tuxes, long or cocktail dresses.' },
    { id: 'f3', question: 'Can I bring a date?', answer: 'Your invitation lists everyone we’ve saved a seat for. When you RSVP, you’ll see exactly who’s included.' },
    { id: 'f4', question: 'Are kids welcome?', answer: 'Kids are more than welcome! We just kindly ask that parents keep their children supervised throughout the evening.' },
    { id: 'f5', question: 'Is there parking?', answer: 'Yes, there’s parking at Santa Fe Event Center.' },
    { id: 'f6', question: 'Will the ceremony be unplugged?', answer: 'Yes, please keep phones away during the ceremony; our photographer has it covered and we’ll share everything after.' },
    { id: 'f7', question: 'I have a dietary restriction.', answer: 'Tell us on the RSVP form and we’ll make sure you’re taken care of.' },
    { id: 'f8', question: 'Who do I contact with questions?', answer: 'Text either of us, or email thegarzas04.24.2027@gmail.com and we’ll get back to you as soon as we can.' },
  ],

  registry: {
    heading: 'Registry',
    body: 'Your presence is truly the best gift. If you’d like to celebrate with something more, we’ve put together a few ideas.',
    image: photo('engagement-ring-embrace', 'Ruby’s hand with her engagement ring resting on the back of Arath’s neck as they embrace'),
    links: [
      { id: 'r1', name: 'Honeymoon Fund', url: 'https://example.com', note: 'Help us get to [destination]' },
      { id: 'r2', name: 'Amazon Registry', url: 'https://example.com', note: 'For our first home' },
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
  { id: 'g1', household: 'The Lopez Family', members: ['Ana Lopez', 'Luis Lopez'], events: ['ceremony', 'dinner', 'party'] },
  { id: 'g2', household: 'Jordan Lee & Guest', members: ['Jordan Lee', 'Guest'], events: ['ceremony', 'dinner', 'party'] },
  { id: 'g3', household: 'Test Guest', members: ['Test Guest'], events: ['ceremony', 'dinner', 'party'] },
]
