// Dynamically set the og:url meta tag
document.addEventListener('DOMContentLoaded', () => {
    const ogUrlMetaTag = document.querySelector('meta[property="og:url"]');
    if (ogUrlMetaTag) {
      console.log('Setting og:url to:', window.location.href);
      ogUrlMetaTag.setAttribute('content', window.location.href);
    } else {
      console.error('og:url meta tag not found');
    }
});