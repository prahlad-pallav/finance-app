# Currency Converter Component

A comprehensive currency converter that tracks INR (Indian Rupee) exchange rates and displays historical trends using the [Free Currency API](https://app.freecurrencyapi.com/) and Recharts for data visualization.

## Features

- **Live Exchange Rates**: Real-time currency conversion with current exchange rates
- **Historical Data**: Interactive charts showing exchange rate trends over time *(Currently commented out for future reference)*
- **Multiple Time Ranges**: View data for 1 week, 1 month, 3 months, 6 months, or 1 year *(Currently commented out)*
- **Popular Currencies**: Quick access to major world currencies with flag icons
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **BEM CSS Architecture**: Clean, maintainable CSS following BEM conventions

## Current Status

**Historical Trends**: The historical data functionality has been commented out using `/* */` comments for future reference. This includes:
- Historical chart component
- Time range selector
- Historical data fetching functions
- Related state variables
- Recharts integration
- Chart-specific CSS styles

To re-enable historical trends:
1. Uncomment the historical chart section in `Currency.js`
2. Uncomment the related state variables and functions
3. Uncomment the Recharts import
4. Uncomment the chart-related CSS in `Currency.css`
5. Install Recharts: `npm install recharts`

## Setup Instructions

### 1. Get Free Currency API Key

1. Visit [Free Currency API](https://app.freecurrencyapi.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. The free tier includes:
   - 1000 requests per month
   - Real-time exchange rates
   - Historical data
   - 170+ currencies

### 2. Configure API Key

Open `finance-app/src/page/Currency/Currency.js` and replace the API key:

```javascript
// Replace this line:
const API_KEY = 'YOUR_API_KEY_HERE';

// With your actual API key:
const API_KEY = 'your_actual_api_key_here';
```

### 3. Install Dependencies

The component uses Recharts for data visualization. Install it if not already installed:

```bash
npm install recharts
```

## Usage

### Navigation

1. **From Homepage**: Click on the "Currency Converter" feature card
2. **From Navbar**: Click "Currency" in the main navigation
3. **Direct URL**: Navigate to the currency page programmatically

### Features

#### Live Currency Converter
- Select source and target currencies from dropdown menus
- Enter amount to convert
- View real-time conversion results
- Swap currencies with the ⇄ button
- See current exchange rates for both directions

#### Historical Trends Chart
- Choose time range: 1W, 1M, 3M, 6M, 1Y
- Interactive area chart showing exchange rate trends
- Hover for detailed information
- Responsive design adapts to screen size

#### Popular Currency Pairs
- Quick access to major currencies
- Click any currency to set it as target
- Visual flag icons for easy identification

## API Endpoints Used

### Current Exchange Rate
```
GET https://api.freecurrencyapi.com/v1/latest
```

### Historical Data (Single Date)
```
GET https://api.freecurrencyapi.com/v1/historical?date=2024-01-01
```

**Note:** The free tier `/historical` endpoint only accepts a single date parameter. For date ranges, upgrade to [currencyapi.com](https://currencyapi.com/docs/range) and use the `/range` endpoint.

### Free Tier Limitations
- **Historical Data**: Limited to single date requests
- **Date Range**: Not available in free tier
- **Workaround**: Component fetches last 7 days by making individual date requests
- **Upgrade**: Use [currencyapi.com](https://currencyapi.com/docs/range) for extended historical data

## Component Structure

```
Currency/
├── Currency.js          # Main component logic
├── Currency.css         # Styling with BEM convention
└── README.md           # This file
```

## CSS Classes (BEM Convention)

### Block: Currency
- `.Currency` - Main container
- `.Currency__Container` - Content wrapper
- `.Currency__Header` - Header section
- `.Currency__Content` - Main content area

### Elements
- `.Currency__Title` - Page title
- `.Currency__Subtitle` - Page subtitle
- `.Currency__BackButton` - Navigation back button
- `.Currency__ConverterSection` - Currency converter area
- `.Currency__ChartSection` - Historical chart area
- `.Currency__PopularSection` - Popular currencies area

### Modifiers
- `.Currency__TimeButton--active` - Active time range button
- `.Currency__ResultAmount--returns` - Returns amount styling

## Error Handling

The component includes comprehensive error handling:

- **API Key Missing**: Shows helpful message with link to get API key
- **Network Errors**: Displays user-friendly error messages
- **No Data**: Graceful handling when historical data is unavailable
- **Loading States**: Visual feedback during API calls

## Responsive Design

The component is fully responsive with breakpoints:

- **Desktop**: Full layout with side-by-side converter
- **Tablet**: Adjusted spacing and layout
- **Mobile**: Stacked layout with optimized touch targets

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Optimizations

- **useCallback**: Memoized API calls to prevent unnecessary re-renders
- **useEffect**: Proper dependency management
- **Lazy Loading**: Chart components load only when needed
- **Debounced Input**: Smooth user experience during typing

## Customization

### Styling
Modify `Currency.css` to customize:
- Color scheme
- Typography
- Spacing and layout
- Chart appearance

### Functionality
Extend `Currency.js` to add:
- More currencies
- Additional time ranges
- Export functionality
- Currency alerts

## Troubleshooting

### Common Issues

1. **"Please add your Free Currency API key"**
   - Solution: Add your API key to the Currency.js file

2. **"No historical data available"**
   - Solution: Check your API quota and ensure the date range is valid

3. **Chart not displaying**
   - Solution: Ensure Recharts is properly installed

4. **Network errors**
   - Solution: Check internet connection and API endpoint availability

### API Limits

- Free tier: 1000 requests/month
- Rate limiting: 5 requests/second
- Historical data: Up to 1 year back

## Contributing

To contribute to this component:

1. Follow BEM CSS naming conventions
2. Maintain responsive design principles
3. Add proper error handling
4. Include loading states
5. Test across different devices and browsers

## License

This component is part of the Finance App project and follows the same licensing terms. 