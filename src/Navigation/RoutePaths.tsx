export type RoutePaths = { [routeName: string]: { routePath: string } };

export const routes: RoutePaths = {
  home: {
    routePath: '/',
  },
  cart: {
    routePath: '/cart',
  },
  delivery: {
    routePath: '/delivery'
  },
  payment: {
    routePath: '/payment'
  },
  submit: {
    routePath: '/submit'
  },
  finish: {
    routePath: '/finish'
  },
  login: {
    routePath: '/login'
  }
};