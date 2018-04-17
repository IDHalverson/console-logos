const consoleLogos = require("./index.js");

const myLoggerModule = new consoleLogos();

const AppLogger = myLoggerModule.createLoggerForModule("App");
const ProgramLogger = myLoggerModule.createLoggerForModule("Program");
const PizzaLogger = myLoggerModule.createLoggerForModule("Pizza");

AppLogger.log("All aboard!");

ProgramLogger.error("Abandon ship!");

PizzaLogger.info("I am hungry", ":(");
