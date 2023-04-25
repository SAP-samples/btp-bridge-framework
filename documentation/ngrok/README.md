# Get ngrok

- Sign up https://ngrok.com/
- Go to Dashboard https://dashboard.ngrok.com/get-started/setup
  - Download ngrok
  - Connect your account

```
ngrok authtoken <YOUR_TOKEN>
```

# Set ngrok.yml

```
cd ~/.ngrok2
vi ngrok.yml
```

```
tunnels:
  backend:
    proto: http
    addr: 8080
  frontend:
    proto: http
    addr: 3007
  config:
    proto: http
    addr: 5500
```

# Run local servers

1. Backend (port 8080)

```
cd backend
npm start
```

2. Frontend (port 3007)

```
cd frontend
npm start
```

3. Config (port 5500)

- Install Live Server on VS code https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
- Go Live

# Run ngrok

```
ngrok start --all
```

- ngrok example

```
ngrok by @inconshreveable                                                                                                         (Ctrl+C to quit)

Session Status                online
Account                       john.doe@example.com (Plan: Free)
Version                       2.3.40
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://459b-222-111-244-47.ngrok.io -> http://localhost:3007
Forwarding                    https://459b-222-111-244-47.ngrok.io -> http://localhost:3007
Forwarding                    http://6fcc-222-111-244-47.ngrok.io -> http://localhost:8080
Forwarding                    https://6fcc-222-111-244-47.ngrok.io -> http://localhost:8080
Forwarding                    http://e251-222-111-244-47.ngrok.io -> http://localhost:5500
Forwarding                    https://e251-222-111-244-47.ngrok.io -> http://localhost:5500
```

# Edit URLs & Restart servers (Don't restart ngrok)

- Backend URL
  - Azure portal > Bot services > Configurations > Messaging endpoint
  - config/public/frontend/\*.json > getAPI
- Frontend URL
  - backend/bots/s4hana/botActivityHandler.js > url, fallbackUrl
- Config URL
  - backend/.env > configServerUrl
  - frontend/src/components/App.jsx > Getting page configurations from static webserver
  - frontend/src/components/pages/PageLanding.jsx > getSolutionDataRemote()
