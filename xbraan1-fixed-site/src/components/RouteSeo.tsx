import { useLocation } from 'react-router-dom';
import SEO from './SEO';
import { getRouteMeta } from '../seo/meta';

/** One place that sets metadata for every route (unknown routes become a noindex "not found"). */
export default function RouteSeo() {
  const { pathname } = useLocation();
  const meta = getRouteMeta(pathname) ?? { title: 'Page not found', description: 'This page could not be found.', noindex: true };
  return <SEO meta={meta} path={pathname} />;
}
