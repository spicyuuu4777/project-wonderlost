echo Registering slash command..
node register.js global
echo Slash command registered.
echo Installing modules..
npm install
echo Modules ready.
echo Starting index.js file..
node --no-warnings index.js
