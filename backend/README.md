# Finance App Backend

A simple Flask backend for the Finance Application.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```

3. **Access the API:**
   - Main endpoint: http://localhost:5000/
   - API endpoint: http://localhost:5000/api/hello
   - Health check: http://localhost:5000/api/health

## API Endpoints

- `GET /` - Hello World message
- `GET /api/hello` - API information
- `GET /api/health` - Health check

## Example Response

```json
{
  "message": "Hello World!",
  "status": "success"
}
```
