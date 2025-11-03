# Disney Characters Dashboard

Vercel url: https://disney-dashboard-ten.vercel.app/

## Installation

1. **Clone or navigate to the project directory:**
```bash
cd disney-dashboard
```

2. **Install dependencies:**
```bash
yarn install
```

## Running the Application

### Development Mode
```bash
yarn dev
```

The application will open at `http://localhost:3000`

### Build for Production
```bash
yarn build
```

### Preview Production Build
```bash
yarn preview
```

## Running Tests

```bash
yarn test
```

Run tests with coverage:
```bash
yarn test:coverage
```

## API Integration

The application uses the Disney REST API:
- **Base URL:** `https://api.disneyapi.dev/character`
- **Documentation:** https://disneyapi.dev/docs/

The API service automatically fetches all characters on app load to enable full-text search and filtering capabilities across all available data.
