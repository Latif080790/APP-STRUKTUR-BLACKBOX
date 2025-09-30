@echo off
echo ====================================
echo Setup Backend untuk Structural Analysis System
echo ====================================

echo.
echo [1/5] Installing dependencies...
call npm install

echo.
echo [2/5] Creating log directory...
if not exist "logs" mkdir logs

echo.
echo [3/5] Creating environment file...
if not exist ".env" (
    echo NODE_ENV=development > .env
    echo PORT=3001 >> .env
    echo DB_HOST=localhost >> .env
    echo DB_PORT=5432 >> .env
    echo DB_NAME=structural_analysis >> .env
    echo DB_USER=postgres >> .env
    echo DB_PASSWORD=password >> .env
    echo JWT_SECRET=your-super-secret-jwt-key-change-in-production >> .env
    echo JWT_EXPIRE=30d >> .env
    echo FRONTEND_URL=http://localhost:8082 >> .env
    echo REDIS_URL=redis://localhost:6379 >> .env
    echo.
    echo Environment file created! Please update .env with your actual database credentials.
)

echo.
echo [4/5] Building TypeScript...
call npm run build

echo.
echo [5/5] Setup complete!
echo.
echo Next steps:
echo 1. Update .env file with your database credentials
echo 2. Create PostgreSQL database 'structural_analysis'
echo 3. Run database migrations: npm run migrate
echo 4. Start development server: npm run dev
echo.
echo Backend will run on: http://localhost:3001
echo API Documentation: http://localhost:3001/api/docs
echo.
pause