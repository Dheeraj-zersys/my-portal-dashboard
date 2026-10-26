# TG Portal

Laravel 13 + Inertia (React 19) + MySQL.

```bash
composer install && npm install
cp .env.example .env && php artisan key:generate
php artisan migrate --seed      # needs a MySQL database named my_portal
composer run dev
```

Locally, Herd serves the app at http://my-portal-dashboard.test.

- [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md): where frontend integration stands and how to approach it
- [INTEGRATION.md](INTEGRATION.md): routes, props, payloads and open questions
