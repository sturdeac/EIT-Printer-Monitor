echo "Starting the local printer monitor server"
cd ~/Documents/git/EIT-Printer-Monitor
git pull
npm install
forever start server.js
echo "The printer monitor is active on http://localhost:8080"
