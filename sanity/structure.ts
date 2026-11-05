import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Our Wedding')
    .items([
      S.listItem().title('Site Settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('event').title('Schedule'),
      S.documentTypeListItem('storyMoment').title('Our Story'),
      S.documentTypeListItem('person').title('Wedding Party'),
      S.documentTypeListItem('galleryImage').title('Gallery'),
      S.documentTypeListItem('registryLink').title('Registry'),
      S.documentTypeListItem('faq').title('FAQ'),
      S.documentTypeListItem('guestPhoto').title('Guest photos'),
      S.documentTypeListItem('page').title('Custom pages'),
      S.divider(),
      S.listItem()
        .title('Private')
        .child(
          S.list()
            .title('Private')
            .items([
              S.documentTypeListItem('guest').title('Guest list'),
              S.documentTypeListItem('rsvp').title('RSVPs'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Still placeholder')
        .child(
          S.documentList()
            .title('Documents with placeholder photos')
            .filter(
              'image.placeholder == true || heroImage.placeholder == true || shareImage.placeholder == true || introImage.placeholder == true || registryImage.placeholder == true || count(sections[image.placeholder == true]) > 0',
            ),
        ),
    ])
