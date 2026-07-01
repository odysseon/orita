export const listingDetailRoutes = [
  {
    path: 'l/:slug',
    loadComponent: () => import('./listing-detail').then((m) => m.ListingDetail),
  },
];
