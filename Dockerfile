# webpixel — static site served by nginx
FROM nginx:1.27-alpine

# Static assets
COPY . /usr/share/nginx/html

# Custom nginx config (SPA-friendly, gzip, cache headers)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Drop files that shouldn't be served
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/.dockerignore 2>/dev/null || true

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
