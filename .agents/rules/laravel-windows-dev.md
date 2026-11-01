# Laravel Windows Dev Server
- When running `php artisan serve` with single-page frontend apps sending concurrent API requests, set `PHP_CLI_SERVER_WORKERS=4` in `.env` and run `php artisan serve --no-reload` to enable multi-threaded request processing on Windows.
