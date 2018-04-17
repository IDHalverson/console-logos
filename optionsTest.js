const consoleLogos = require("./index.js");

const myLoggerModule = new consoleLogos({
  defaultTextColor: "\x1b[94m",
  defaultTagColor: null,
  matchTagAndTextByDefault: false,
  argumentsColor: null,
  moduleColor: "\x1b[32m",
  dateColor: "\x1b[2m",
  methodInterceptor: null,
  useModuleSeparator: true,
  moduleSeparator: "...",
  lastRunModuleInConsole: null,
  silenceTest: false,
  dateFormat: "MM-DD-YYYY HH:MI:SS:MS",
  throwIfInstanceOfError: false,
  upperCaseMethodByDefault: true,
  methods: {
    amazing: {},
    shout: {},
    pizza: {}
  }
});

const AppLogger = myLoggerModule.createLoggerForModule("App");
const ProgramLogger = myLoggerModule.createLoggerForModule("Program");
const PizzaLogger = myLoggerModule.createLoggerForModule("Pizza");

AppLogger.amazing("All aboard!");

ProgramLogger.shout("Abandon ship!");

PizzaLogger.pizza("I am hungry", ":(");

AppLogger.info("This still works...");
