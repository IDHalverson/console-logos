const defaults = {
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
    log: {},
    info: { nativeMethod: "info" },
    warn: { nativeMethod: "warn", tagColor: "\x1b[33m" },
    error: { nativeMethod: "error", tagColor: "\x1b[31m" },
    success: { tagColor: "\x1b[32m" }
  }
};

module.exports = class ConsoleLogos {
  constructor(options = defaults) {
    const args = {
      ...defaults,
      ...options,
      methods: { ...defaults.methods, ...options.methods }
    };
    for (let arg in args)
      this[arg] = args[arg] == undefined ? defaults[arg] : args[arg];
    console.log("[ConsoleLogos] Configured methods:");

    this.logger = class Logger {
      constructor(moduleName, consoleLogosModule) {
        this.module = moduleName;
        this.CL = consoleLogosModule;
        for (let method in this.CL.methods) {
          const boundConsole = this.console.bind(this);
          this[method] = function() {
            boundConsole(method, Object.values(arguments));
          };
        }
      }

      console(method, args) {
        const CL = this.CL;
        let methodToUse = CL.methodInterceptor
          ? CL.methodInterceptor(method, args)
          : method;
        let nativeMethodToUse = CL.methods[methodToUse].nativeMethod || "log";
        args = CL.prettifyObjects(args);
        if (CL.useModuleSeparator) {
          if (this.module !== CL.lastRunModuleInConsole) {
            console.log(CL.moduleSeparator);
            CL.lastRunModuleInConsole = this.module;
          }
        }
        console[nativeMethodToUse](
          CL.handleTemplate(this.module, methodToUse, args)
        );
        if (CL.throwIfInstanceOfError) {
          for (let arg of args) {
            if (arg instanceof Error) {
              throw arg;
            }
          }
        }
      }
    };

    if (!this.silenceTest) {
      const testLogger = new this.logger("Test Logger", this);
      for (let method in this.methods) {
        testLogger[method]("example of method:", method);
      }
    }
  }

  prettifyObjects(args) {
    return args.map(
      arg =>
        typeof arg == "object"
          ? arg instanceof Error ? arg : JSON.stringify(arg, null, 4)
          : arg
    );
  }

  zeroPad(num, mS = false) {
    return mS
      ? (num < 100 ? (num < 10 ? `00` : `0`) : ``) + num
      : (num < 10 ? `0` : ``) + num;
  }

  getNow(date = new Date()) {
    const parts = {
      MM: this.zeroPad(date.getMonth() + 1),
      DD: this.zeroPad(date.getDate()),
      YYYY: date.getFullYear(),
      HH: this.zeroPad(date.getHours()),
      MI: this.zeroPad(date.getMinutes()),
      SS: this.zeroPad(date.getSeconds()),
      MS: this.zeroPad(date.getMilliseconds(), true)
    };
    let stringDate = this.dateFormat;
    Object.keys(parts).forEach(
      part => (stringDate = stringDate.replace(part, parts[part]))
    );
    return stringDate;
  }

  handleTemplate(thisModule, method, args) {
    const reset = "\x1b[0m";
    const {
      color,
      tagColor,
      moduleColor,
      tagColoring,
      timestamp,
      textColor,
      logText,
      infoText,
      methodText
    } = this.resolveTemplateVars(method, args);
    return (
      reset +
      moduleColor +
      `[${thisModule}]` +
      reset +
      " " +
      this.dateColor +
      timestamp +
      " " +
      reset +
      tagColoring +
      methodText +
      reset +
      " " +
      textColor +
      logText +
      reset +
      " " +
      infoText
    );
  }

  resolveTemplateVars(method, args) {
    const { color, tagColor, matchTagAndText, upperCaseMethod } = this.methods[
      method
    ];
    const tagColorResolved = tagColor || "";
    const colorResolved = color || this.defaultTextColor;
    return {
      moduleColor: this.moduleColor,
      tagColoring: tagColorResolved,
      timestamp: this.getNow(),
      textColor: colorResolved,
      logText: args[0],
      infoText: [...args.slice(1)].join(" "),
      methodText: `[${
        upperCaseMethod !== undefined
          ? this.upperCaseMethod ? method.toUpperCase() : method
          : this.upperCaseMethodByDefault ? method.toUpperCase() : method
      }]\x1b[2m:`
    };
  }

  createLoggerForModule(mod) {
    return new this.logger(mod, this);
  }
};
