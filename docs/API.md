# API Integration

This document describes the API integration with Google's Gemini AI for prayer generation.

## Overview

The application uses Google's Gemini API to generate prayers based on user input. The API is called from the client-side with proper error handling and loading states.

## Authentication

1. **API Key**: The application requires a Google Gemini API key for authentication.
2. **Environment Variables**: The API key is stored in the `.env.local` file as `VITE_GEMINI_API_KEY`.

## API Client

The API client is implemented in `src/lib/api.ts` and provides methods to interact with the Gemini API.

### Methods

#### `generatePrayer(prompt: string): Promise<string>`

Generates a prayer based on the provided prompt.

**Parameters:**
- `prompt` (string): The prayer request or topic

**Returns:**
- `Promise<string>`: The generated prayer text

**Example:**
```typescript
import { generatePrayer } from '@/lib/api';

const prayer = await generatePrayer('peace in the world');
console.log(prayer);
```

## Error Handling

The API client includes error handling for:
- Network errors
- Invalid API key
- Rate limiting
- Invalid responses

## Rate Limiting

- The application implements client-side rate limiting to prevent excessive API calls.
- Users are shown appropriate messages when rate limits are approached.

## Testing

API integration tests are located in `src/__tests__/api.test.ts` and can be run using:

```bash
npm test
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |

## Example Request/Response

**Request:**
```typescript
const prayer = await generatePrayer('peace in the world');
```

**Response:**
```json
{
  "text": "Heavenly Father, we pray for peace to prevail across the world..."
}
```

## Troubleshooting

1. **API Key Issues**
   - Ensure the API key is correctly set in `.env.local`
   - Verify the key has the necessary permissions

2. **Network Errors**
   - Check internet connection
   - Verify CORS settings if running in development

3. **Rate Limiting**
   - Check the response headers for rate limit information
   - Implement exponential backoff if needed

## Security Considerations

- Never commit API keys to version control
- Use environment variables for sensitive information
- Implement proper error handling to avoid leaking sensitive information
- Consider implementing server-side API calls in production
