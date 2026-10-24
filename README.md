# STROY UZ

Маркетплейс строительных материалов. Стек: React 19, Vite 8, JavaScript/JSX, Tailwind CSS 4, Oxlint.

Сервер: Node.js + Fastify + PostgreSQL. [Запуск API, база, SMTP и эндпоинты](docs/api.md).

## Локальный запуск

Требуется Node.js 20.19+ или 22.12+ (для текущего Vite); используется npm и `package-lock.json`.

```sh
npm ci
npm run dev
```

Адрес сервера Vite выводится в терминале.

- `npm run lint` — проверка Oxlint.
- `npm run build` — production-сборка в `dist/`.
- `npm run preview` — локальный просмотр готовой сборки.

Страница товара: `/product/drill` (также `/product/cement`, `/product/bricks`, `/product/paint`). Нажмите на изображение или название товара в каталоге, чтобы открыть карточку. Корзина и избранное сохраняются в браузере.

Страницы находятся в `src/pages/`, компоненты — в `src/components/`. [Архитектура главной страницы](docs/homepage.md).

Работайте в отдельной ветке и открывайте Pull Request. Не добавляйте зависимости и изменения общих конфигураций без согласования с командой.

Интерфейс поддерживает RU / UZ / EN. [Правила добавления переводов и проверки](docs/localization.md).

[Общие кнопки, карточки товаров и адаптивность](docs/components.md).

## Исходный шаблон React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Каталог и категории STROY UZ

- `/catalog` — каталог товаров: категории, поиск, сортировка, диапазон цен, бренд, корзина, избранное.
- `/categories` — все шесть категорий; карточка ведёт в каталог с выбранным фильтром.
- `/catalog?category=tools` — пример ссылки на конкретную категорию.
- `/catalog?q=цемент` — пример поиска из шапки.
- Кнопки «Каталог товаров», «Открыть каталог» и «В каталог» ведут в `/catalog`, «Все категории» — в `/categories`.
- Дополнительные пять позиций каталога и цены демонстрационные: реальные товары следует заменить данными поставщика.

Запуск после распаковки: `npm install`, затем `npm run dev`.
