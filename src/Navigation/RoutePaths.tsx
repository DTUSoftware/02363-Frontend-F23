/**
 * RoutePaths type with routeName string and routePath string
 * Used to hold routeNames and their routePaths as key value pairs
 */
export type RoutePaths = { [routeName: string]: { routePath: string } };

/**
 * RoutePaths declaration with routeNames and routePaths key value pairs for each page in the application
 */
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