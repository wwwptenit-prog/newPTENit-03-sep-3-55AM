/**
 * Universal Deep-Linking & URL Manager for Single Page Application
 * Ensures that:
 * 1. Active page/tab is reflected in the URL (?tab=...)
 * 2. Active gig/service is reflected in the URL (?gig=id or #gig-id)
 * 3. Active course is reflected in the URL (?course=id)
 * 4. Active certificate is reflected in the URL (?cert=code)
 * 5. Works seamlessly both locally and after uploading to cPanel / Apache / Nginx
 */

export interface AppUrlState {
  tab?: string;
  category?: string;
  gigId?: string;
  courseId?: string;
  certId?: string;
}

export const getUrlParams = (): AppUrlState => {
  if (typeof window === 'undefined') return {};
  try {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    // Check search params first
    const tab = searchParams.get('tab') || undefined;
    const category = searchParams.get('category') || undefined;
    const gigId = searchParams.get('gig') || searchParams.get('service') || undefined;
    const courseId = searchParams.get('course') || undefined;
    const certId = searchParams.get('cert') || searchParams.get('verify') || undefined;

    // Also support hash fallback (e.g. #/gig/gig-1 or #gig=gig-1)
    let hashGigId: string | undefined = undefined;
    let hashCourseId: string | undefined = undefined;
    let hashTab: string | undefined = undefined;

    if (window.location.hash) {
      const hashStr = window.location.hash.replace(/^#\/?/, '');
      if (hashStr.startsWith('gig=') || hashStr.startsWith('gig/')) {
        hashGigId = hashStr.replace(/^gig[=\/]/, '');
      } else if (hashStr.startsWith('course=') || hashStr.startsWith('course/')) {
        hashCourseId = hashStr.replace(/^course[=\/]/, '');
      } else if (hashStr.startsWith('tab=') || hashStr.startsWith('tab/')) {
        hashTab = hashStr.replace(/^tab[=\/]/, '');
      }
    }

    return {
      tab: tab || hashTab,
      category,
      gigId: gigId || hashGigId,
      courseId: courseId || hashCourseId,
      certId,
    };
  } catch (e) {
    return {};
  }
};

/**
 * Updates the browser address bar without a full page reload.
 * Sets the exact canonical shareable URL.
 */
export const updateUrlState = (state: AppUrlState, replace = false) => {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);

    // Tab
    if (state.tab && state.tab !== 'home') {
      url.searchParams.set('tab', state.tab);
    } else {
      url.searchParams.delete('tab');
    }

    // Category
    if (state.category && state.category !== 'All') {
      url.searchParams.set('category', state.category);
    } else {
      url.searchParams.delete('category');
    }

    // Gig
    if (state.gigId) {
      url.searchParams.set('gig', state.gigId);
    } else {
      url.searchParams.delete('gig');
      url.searchParams.delete('service');
    }

    // Course
    if (state.courseId) {
      url.searchParams.set('course', state.courseId);
    } else {
      url.searchParams.delete('course');
    }

    // Cert
    if (state.certId) {
      url.searchParams.set('cert', state.certId);
    } else {
      url.searchParams.delete('cert');
      url.searchParams.delete('verify');
    }

    const newUrl = url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + (url.hash || '');

    if (replace) {
      window.history.replaceState({ ...state }, '', newUrl);
    } else {
      // Only push if URL actually changed
      const currentRelative = window.location.pathname + window.location.search + window.location.hash;
      if (currentRelative !== newUrl) {
        window.history.pushState({ ...state }, '', newUrl);
      }
    }
  } catch (e) {
    // History api fallback
  }
};

/**
 * Generates an absolute shareable link for any gig, course, or page
 */
export const getShareableLink = (options: { gigId?: string; courseId?: string; tab?: string; category?: string }): string => {
  if (typeof window === 'undefined') return '';
  try {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();

    if (options.gigId) {
      params.set('gig', options.gigId);
    } else if (options.courseId) {
      params.set('course', options.courseId);
    } else if (options.tab && options.tab !== 'home') {
      params.set('tab', options.tab);
      if (options.category && options.category !== 'All') {
        params.set('category', options.category);
      }
    }

    const query = params.toString();
    return query ? `${baseUrl}?${query}` : baseUrl;
  } catch (e) {
    return window.location.href;
  }
};
