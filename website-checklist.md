# Website launch checklist

## Basics
- [x] Favicon (`src/app/favicon.ico`)
- [x] Theme color meta tag
- [x] robots.txt
- [x] sitemap.xml
- [x] .well-known/security.txt

## Performance
- [x] Loading skeletons or spinners
- [x] Image optimization (`next/image`)
- [x] Font loading strategy (`next/font`)
- [ ] Lazy loading for images/iframes
- [ ] Minified CSS/JS
- [x] Gzip/Brotli compression
- [ ] CDN for static assets
- [x] Cache headers (`Cache-Control`, `ETag`)
- [ ] Preload critical resources
- [ ] DNS prefetch/preconnect
- [ ] Critical CSS inlined

## SEO
- [x] Unique title tags per page
- [x] Meta description
- [x] Canonical URLs
- [x] Open Graph tags
- [x] Twitter Card tags
- [ ] Structured data (JSON-LD)
- [x] Semantic HTML (`header`, `nav`, `main`, `footer`)
- [ ] Alt text for images

## Accessibility
- [x] ARIA labels and roles (only where needed)
- [ ] Keyboard navigation support
- [x] Visible focus indicators
- [ ] Color contrast (WCAG AA+)
- [ ] Screen reader testing
- [x] Skip links
- [ ] Associated form labels
- [ ] ARIA-live for dynamic errors

## Security
- [x] HTTPS enforced
- [x] HSTS header
- [x] Content Security Policy
- [x] X-Frame-Options / `frame-ancestors`
- [x] X-Content-Type-Options
- [x] Referrer-Policy
- [x] Permissions-Policy
- [ ] Input validation/sanitization

## UI/UX
- [x] Responsive design
- [x] Loading states
- [ ] Touch targets >= 44x44 px
- [x] Custom 404/500 pages
- [ ] Print styles
- [ ] Dark mode support
- [x] Consistent navigation
- [ ] Breadcrumbs
- [ ] Back-to-top button

## Legal & Privacy
- [ ] Privacy policy
- [ ] Contact information
- [x] Copyright notice

## Development & Deployment
- [ ] Environment variables documented
- [ ] CI/CD pipeline
- [x] Automated tests
- [x] Linting
- [x] Build pipeline
- [x] Source maps (development)
- [ ] Uptime monitoring
- [ ] Rollback plan
