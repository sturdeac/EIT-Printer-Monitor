# EIT-Printer-Monitor
A small simple webpage/server to Monitor 

# How to install and run
1. install the latest node.js version [here](https://nodejs.org/en/)
2. install git [here](https://git-scm.com/download/win)
3. open git bash and run
  * cd ~/Documents
  * mkdir git
  * cd git
  * git clone https://github.com/Mercieral/EIT-Printer-Monitor.git
  * cd EIT-Printer-Monitor
  * npm install -g forever
  * npm install
  * forever start server.js (or "node server" but the terminal will need to stay open)
4. Copy the printer_monitor_startup.sh file from this directory and paste into your personal startup folder
  * This should be located at C:/users/<username>/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup
  * this will (hopefully) start the local printer monitor server automatically when you login from now on.

  
# How to run (if already installed and startup script is failing)
### open git bash and run the following commands
1. cd ~/Documents/git/EIT-Printer-Monitor
2. git pull (optional to get newest changes)
3. npm install (optional to get newest changes)
4. forever start server.js
