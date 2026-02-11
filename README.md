# Nautus 🪸

Your one & only ultimate software development tool

> **🦀 Now available in Rust!** Nautus has been migrated to Rust for better performance while maintaining full compatibility with JavaScript scripts. See [RUST_MIGRATION.md](RUST_MIGRATION.md) for details.

## Installation

### Rust Version (Recommended)
```bash
# Build from source
git clone https://github.com/cabraviva/nautus.git
cd nautus
cargo install --path .
```

See [BUILDING.md](BUILDING.md) for detailed installation instructions.

### JavaScript Version (Legacy)
```bash
npm i nautus -g
```

# Use cases

**Nautus can help you:**

- Create boilerplate code
- Compile your code
- Run your code
- Test your code
- Build your code
- Release your code
- Generate Changelogs
- Format your code
- Refactor your code
- Manage .ignore files
- Test APIs
- Create docs
- Generate a license file
- Lint your code
- Automatically detect used technologies & integrate them with nautus
- Create code backups
- Watch & recompile only parts of your code
- Manage Git Hooks

# Contribution

We want to see nautus grow, so if you have a feature request just create a issue on GitHub and if you want to add a feature yourself, fix a typo or just want to optimize something, please feel free to open a pull request with a detailed explanation.

# Goals

**Some things we'd like nautus to achieve:**

- Becoming the the only software tool you'll ever need
- Integrating yeoman generators in the kelp ecosystem
- Getting a GUI
- Being used in at least 5 projects (If you use nautus, please create a issue stating for what you use nautus so we can list you as an early supporter)

# Why shouldn't I just use a task runner?

The answer is simple: A task runner does what it should, it runs tasks. But nautus can do much more (as seen [above](#use-cases)). Nautus also provides you with a useful cli and has made becoming the only software development tool you'll ever need it's goal. Nautus will help you manage and automate your code and has it's own boilerplate generator. Also, who says you can't use both? For example if you wanted to use gulp, just add

```js
await cmd('gulp').catch(error)
```

to your `@Prep.js` script, and gulp will run it's tasks each time before your code will be run

# Download

To download nautus, make sure you have npm installed and run `npm i nautus -g`

# Getting started

1. Download nautus (see [above](#download))
2. Use `nautus me` to provide nautus with some info about you
3. Switch to your project directory (it does't have to be empty)
4. Create a new nautus project using `nautus create`
5. Either [use a kelp boilerplate generator](#using-kelp-to-generate-boilerplate) or [start a project from scratch](#configuring-nautus-for-your-needs)
6. Run your project using `nautus run`
7. Learn about the [commands](#commands) & how to use them
8. If not already done in step 4, [learn how to use & write scripts](#using-scripts) & [how to configure nautus for your needs](#configuring-nautus-for-your-needs)
9. Learn how to use [tanks](#tanks)
10. Learn how to use [agents](#agents)
11. Learn how to [create your own boilerplate generators](#creating-a-boilerplate-generator-for-kelp)

# Using kelp to generate boilerplate

If you want to generate boilerplate code, use kelp. To list all available generators run `nautus kelp`. Now let's say you want to build a npm package. In that case you would need to pick the right generator, in this case *npm*. Then you run `nautus kelp npm` to start the generator. It will ask you a few question and automatically create boilerplate, install necessary dependencies & configure [scripts](#using-scripts) for you. If no other info provided, look into the files, write some code and use `nautus run` to execute everything. If you want to create your own kelp generator look [here](#creating-a-boilerplate-generator-for-kelp). If you can't find a suiting generator, it's because nautus doesn't have a big community. In that case you might want to use a tool like [Yeoman](https://yeoman.io/) instead. After that you need to [configure nautus manually](#configuring-nautus-for-your-needs)

# Configuring nautus for your needs

If you want to use nautus in an existing project, there's a few thing you need to configure. To do that, here are a few steps:

## 1. Check if there's a kelp generator available

Let's say you are creating a npm module, but already have code. In that case you need to use the `nautus use` command. First, list all kelp generators using `nautus kelp`. After that we see there's a kelp generator called `npm` available. Now you can use the use command as the following: `nautus use npm`.
**NOTE: Not every kelp generator supports the use command**
If you aren't able to find a suiting generator, just skip this step

## 2. Exploring the nautus directory

At first, all these files in the `./nautus` directory can be overwhelming, so let's break it down:
The basic file structure is like this:

```
nautus/
├── .internal/
│   ├── .nautusme
│   ├── project.json
│   ├── hook-rules.json
│   └── tanks.json
├── agents/
│   ├── @DefaultAgent.js
│   └── agents.yaml
├── backups/
│   └── Backup [Date].zip
├── refactor/
│   └── my.res
├── scripts/
│   ├── @Build.js
│   ├── @Cleanup.js
│   ├── @Prep.js
│   ├── @Run.js
│   └── @Test.js
├── format.yaml
└── lint.yaml
```

First things first: You shouldn't touch files in the `.internal` directory. These are automatically generated and you could loose your project if you do something wrong there.

Let's take a look at the backups directory next: Here are your backups created by the `nautus backup` command. If you want more info about that, look at the [command list](#commands).

Next is the refactor directory. This should be empty in a fresh project, but you can add your own `.res` (Regular Expression Script) files here. They are being used if you want to refactor your code or just want to change double quotes to single quotes on every run. If you find that interesting, you might want to learn about [tanks](#tanks) and [Regular Expression Script](#regular-expression-script-res).

Now there are two directories left, which are the most important too: The `scripts` and `agents` directory. It would be to complex to explain them here, so take a look at [point 3](#3-using-nautus-scripts), [the script guide](#using-scripts) and [agents](#agents)

There are two yaml files left, one called `format.yaml` and one called `lint.yaml`
If you look at the content of these files, it starts to be clear how to use them. But before you can really look into that, you need to learn about [tanks](#tanks). Once you did that, take a look at [point 5](#5-lintyaml--formatyaml).

## 3. Using nautus scripts

As you may have noticed, nautus has a variety of project related commands like `run`, `release`, `test`, `build`. All of these commands are just executing scripts, which are found in the `./nautus/scripts` directory. To create own suiting scripts, take a look at [this](#using-scripts)

## 4. Using agents to recompile your code partly

If you have learned enough about scripts, and are building a complex app, maybe a highly interactive website, you might want to keep your server running but recompile your frontend on changes, without having to rerun the entire project. In that case, take a look at [this guide](#agents)

## 5. lint.yaml & format.yaml

The `lint.yaml` and `format.yaml` files inside of the `./nautus` directory are being used to configure the lint & format command. Once you understood the basic syntax, they should be pretty easy to configure. Let's take a look at `lint.yaml` first. At first the code may look like this:

```yaml
# Here you can specify linting commands for specific tanks
# If you haven't created any yet, use the main tank
# Every command will get run for every file
# To get the file name use ${filename}
# If your linter does not support filenames, use @COPY [YOUR_COMMAND]
# This will run the command in a isolated directory only containing this file
# If you only want to execute a command once, use @ONCE [YOUR_COMMAND]
tanks:
  main:
    command: '@ONCE echo "No linting command specified! Please edit nautus/lint.yaml"'
    fixCommand: '@ONCE echo "No fix command specified! Please edit nautus/lint.yaml"'
```

As you see, there are comments explaining what this file does, but I'm gonna explain this anyways. Inside of the tanks object, you can provide a [tank](#tanks) to run this command on, this is useful, because you probably want to use different linters for your javascript and for your html code. If you have no tanks created yet, use the main tank. It is created by default and contains all files in your project. For the tank you can define two properties: `command` and `fixCommand`. The command inside `command` is getting run when you use `nautus lint`, while the `fixCommand` is executed when using `nautus lint --fix`. Because most linters will lint all files by default, every command gets run for every file. You can access the current filename using `${filename}`. An example command for standard.js would be: `npx standard "${filename}"`, and the `fixCommand` could be `npx standard "${filename}" --fix`. However, if your linter doesn't support file names, you could prefix your command with `@ONCE ` this will tell nautus to only run the command once. However if this still isn't a solution, you could use the `@COPY ` prefix. This will run the linter in a separate directory, and copy the files back into your cwd. However this isn't recommended as it is inefficient. An example however would be `@COPY standard --fix`.

For the `format.yaml` file it's basically the same, except that the associated command is `nautus tank main format`. You could use that for a tool like prettier. If you take a look inside the file, you can see there's only one property available: `command`. That's because formatters should automatically edit your code. An example command using prettier would be: `npx prettier --write ${fileName}`.

# Using scripts

Scripts are very important when using nautus. They define what commands will be run when your code is executed and allow you to perform file system operations before various commands. Nautus scripts are written in javascript and are run on a nodejs environment. Their name must begin with an `@` and must end with `.js`. All scripts have to be in the `./nautus/scripts` directory. By default you will see six scripts there. These are script associated with a specific nautus command (e.g. `@Run.js` gets executed on use of `nautus run`). You are able to create your own script though. For that, just create a file called `@MyScriptName.js`. After that you need to write or copy some boilerplate code. If you are not sure, what check out [this](https://gist.github.com/greencoder001/439771b2d384bacc19020d13f72386a5). After that you can run it by using `nautus exec MyScriptName`.
If you don't have experience with using fs in node.js, you should probably learn that first, but now let's get to the syntax and how to create scripts. If you take a look inside of a script, they all give you a simple example. Let's create a `@Run.js` script that will execute the file `index.js` with node:

```js
module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules) => {
    exit(await spawn('node', ['index.js']))

    /* PLEASE DON'T CHANGE METHOD NAMES, AS IT MIGHT BE REQUIRED BY RUNTIMES */
    /* PLEASE DON'T DELETE OR MODIFY THIS COMMENT, IT WILL BE USED TO INJECT SCRIPTS BY KELP */
}
```

As you see, we are exporting an asynchronous function, which takes a bunch of arguments, on which we'll focus later. The function first uses the spawn function to spawn a command (whose output is automatically getting displayed in the console). It uses node to execute the `index.js` file. After that the program exits with the returned exit code. As you might have noticed, there are two comment below your code. That's because some [kelp generators](#using-kelp-to-generate-boilerplate) need to inject scripts into your scripts. For that reason you should always include these two comments and aren't allowed to modify them.

## Special scripts

There are two special scripts: `@Prep.js` and `@Cleanup.js`. Those are getting run before and after execution of the `@Run.js` script. It's best practice to use them for pre-execution compilation and cleaning up meta data and unnecessary files produced by your code

## Integrated methods & properties

To make it easier for you to write scripts, there's a documentation comment which explains the functionality of those:

```js
/*
This file is used to define what happens when you use 'nautus run'
You can write this script like every normal node.js app, but are also
able to use special functions defined below:
async cmd(command: string): Promise<[exitCode, stdout]> - Execute a command in the default shell and waits until completion. Returns [exitCode, stdout]
os(): string - Returns 'windows', 'linux, 'mac' or 'unknown'
info(what: any): void - Displays an info in the console
warn(what: any): void - Displays a warning in the console
error(what: any): void - Displays an error in the console & exits with code 1
exit(code: number = 0): void - Exits with a code (default: 0)
async script(name: string): Promise<void> - Runs another script and returns after it has run. Define it by creating a @ScriptName.js file in this folder and run it by using await script('ScriptName'); You can share data between scripts using global
async spawn(command: string, args: Array<string>, silent?: bool): Promise<exitCode> - Executes a command and displays the output in the shell
async nodeBin(command: string, args: Array<string>, silent?: bool): Promise<exitCode> - Searches through your locally installed node modules and executes a binary. This can be useful when running pkg, tsc, vite, etc...

modules: A useful collection of some modules, because it's bad practice to use require
Over time we might add more (just check using info(modules)), but right now it's:
- modules.fs
- modules.fse
- modules.path
- modules.chalk
- modules.axios
*/

module.exports = async (cmd, os, info, warn, error, exit, script, spawn, modules, nodeBin) => {

}
```

## Help & Support with scripts

As long as nautus is a small project with only few users (when you are reading this it is) I'll gladly provide you with support about anything (including scripts of course). If you contact me, I'll also write a script specialized for your needs. Just contact me on Discord (Green_Lab#1270) or send me a [E-Mail](mailto:greencoder001@outlook.com)

# Agents

If you are working on large projects, it it very possible that you want to recompile parts of your code while running your application, but don't want to recompile everything. To achieve this, nautus has a feature called agents. An agent is a [nautus script](#using-scripts) that runs in the background while your app is running. It watches for changes on a specific [tank](#tanks) and executes the script on change. Agents are saved in the `./nautus/agents` directory. There you'll see two files:

1. The `agents.yaml` file
2. The `@DefaultAgent.js` file

The `agents.yaml` file contains all agents and their tanks. An agent will only be run if it's specified here.
The `@DefaultAgent.js` file is a basic [script](#using-scripts) which will be run as an agent because it is saved in the agents directory. If you want to play around with agents, just edit this file, as it will be run for every change on the `main` tank. An important thing to keep in mind is that the agent won't be run at start, only after a change. If you want it run at start add the same script in your `@Prep.js` script.

## Creating an agent

You could create the files manually, but the easiest way is to run `nautus agent create MyAgentName`. This will create some boilerplate and automatically add the agent definition in the `agents.yaml` file. By default it will be run on changes on the main tank.

## Running an agent

All agents will be automatically run if you use `nautus run`, but if you only want to run a specific agent while you aren't using nautus run, you can use `nautus agent run MyAgentName`. This will keep the agent running until you press `CTRL + C`.

## Background agents

If you are using a framework which already has a watch command integrated, you migth want to use that because it is more efficient. To do that you can use background agents. They only get run once on the start of your program, but will be kept running until your main program exits. To create a background agent, create file named `@AgentName.sh` (on windows you should use `@AgentName.cmd` or `@AgentName.bat`). In most cases you want to create a `.sh` and a `.bat` agent. You **don't** have to define them in your `agents.yaml`, as they aren't specific to a tank. A practical use for background agents would be if you are using vite. In that case you could just create the file `@ViteWatch.sh` in your `./nautus/agents` directory with the following content:

```sh
vite build --watch
```

and you are ready to go.
By default background agents won't output to the stdout, however you can enable this by adding the following command in your agent:

```sh
echo $NAUTUS_ENABLE_STDOUT
```

**NOTE: Background agents can't be run through the `nautus agent run <agentName>` command, however they will be run on `nautus run`**

# Commands

You can list all commands by using `nautus help`. Here's a list of all commands and a more detailed explanation anyways.


| Command name | Arguments                                                                          | Explanation                                                                                                                                                                | Example Usage                                                                                 |
| -------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| agent        | `<create                                                                           | run><agentName>`                                                                                                                                                           | Creates or runs an agent with the specified name. Take a look at[this](#agents) for more help |
| api          |                                                                                    | Opens a CLI based API Client which can run basic request to test your api and is able to save cookies. It supports FormData and file uploading. Just use the`HELP` command | nautus api                                                                                    |
| backup       |                                                                                    | Creates a backup of your code (excluding files and folders specified in the`.gitignore`) and saves is as a zip file in `./nautus/backups/`                                 | `nautus backup`                                                                               |
| changelog    | `<user> <repo> <GITHUB_TOKEN> <outputFileName> <releaseTag> [sinceCommit][--help]` | Generates changelogs based on a GitHub repo. Take a look at[this](#generating-changelogs) for more help                                                                    | `nautus changelog <user> <repo> <GITHUB_TOKEN> <outputFileName> <releaseTag> [sinceCommit]`   |
| create       |                                                                                    | Creates a nautus project                                                                                                                                                   | `nautus create`                                                                               |
| delete       |                                                                                    | Deletes a nautus project                                                                                                                                                   | `nautus delete`                                                                               |
| docs         |                                                                                    | Generates docs in markdown format based on jsdoc commands in your code. It walks you through a few questions first                                                         | `nautus docs`                                                                                 |
| exec         | `<script>`                                                                         | Executes a[script](#using-scripts) using the specified script name                                                                                                         | `nautus exec Run`                                                                             |
| help         |                                                                                    | Shows a help menu including all commands                                                                                                                                   | `nautus help`                                                                                 |
| hook         | `<init|manager>`                                                                   | Initializes / Configures git hooks to work with nautus. See[here](#git-hooks) for more help                                                                                | `nautus hook init`                                                                            |
| ignore       | `<path> <provider1> [provider2] [...]`                                             | Adds a path to (multiple) ignore files                                                                                                                                     | `nautus ignore *.log npm git`                                                                 |
| kelp         | `<generatorName>`                                                                  | Generates boilerplate code using a kelp generator. Use`nautus kelp` to list all generators                                                                                 | `nautus kelp npm`                                                                             |
| license      |                                                                                    | Walks you through a few questions to generate a LICENSE file for you                                                                                                       | `nautus license`                                                                              |
| lint         | `[--help] [--fix]`                                                                 | Lints (& fixes) your code. Specify linters in the`./nautus/lint.yaml` file                                                                                                 | `nautus lint --fix`                                                                           |
| me           | `[--local]`                                                                        | Provides nautus with information about you, so it can generate boilerplate accurate for you. Use the --local flag to only save in current project                          | `nautus me`                                                                                   |
| release      | `<major                                                                            | minor                                                                                                                                                                      | patch> [--help]`                                                                              |
| run          | `[--help]`                                                                         | Runs your code as defined in the`@Run.js` script. It will run the `@Prep.js` script first and the `@Cleanup.js` script afterwards                                          | `nautus run`                                                                                  |
| tank         | `<tank> <cmd> [options]`                                                           | Makes it possible to separate, refactor, and recompile only special parts of your code. Take a look at[tanks](#tanks) and [agents](#agents) if you need more information   | `nautus tank --help`                                                                          |
| test         | `[--help]`                                                                         | Test your code as defined in the`@Test.js` script                                                                                                                          | `nautus test`                                                                                 |
| use          | `<framework>`                                                                      | Like kelp, but only generates necessary code to make it compatible with nautus. Doesn't work with all generators                                                           | `nautus use npm`                                                                              |

# Tanks

**If you want to lint, format or refactor parts of your code, you can use the nautus tank command:**
To list all commands run `nautus tank`.
If you want to list all tanks you can use the `nautus tank ls` command. All other commands are listed here and have the following syntax: `nautus tank <tankname> <command> [options]`

## create

> Creates a tank with the specified tankname
> Usage: nautus tank mytank create

## delete

> Deletes a tank with the specified tankname
> Usage: nautus tank mytank delete

## paths

> Walks you through an UI to include and exclude specific paths in the tank
> You can use the default path template syntax (e.g. src/\*\*/\*.js)
> Usage: nautus tank mytank paths

## include

> Includes specific filepath
> Usage: nautus tank mytank include src/*.js

## exclude

> Excludes a beforehand included filepath
> Usage: nautus tank mytank exclude src/*.min.js

## refactor

> Refactors the code in the tank using a Regular Expression Script file (read more about that [here](#regular-expression-script-res))
> Usage: nautus tank mytank refactor myregexscript

## format

> Formats your code using a formatter like prettier. Define it in `./nautus/format.yaml`
> Usage: nautus tank mytank format

## lint

> Lints or fixes your code. Define it in `./nautus/lint.yaml`
> Usage: nautus tank mytank lint --fix

## cmd

> Runs a command for every file, kind of like [format](#format)
> Usage: nautus tank mytank cmd "@ONCE echo this is a command!!"

# Creating a boilerplate generator for kelp

If you want to generate boilerplate code, you need to use kelp. If you wanted to create a npm-module you could use `nautus kelp npm`. This would search for a npm package called `nautus-npm`. If this package exists, nautus will download it and use it for boilerplate generation. To create your own generator create a new project using `nautus create` and `nautus kelp kelp`. Now jump into your editor to write some code and see examples. If you need inspiration or more examples, look [here](https://www.npmjs.com/search?q=nautus). After your done, run `nautus release major` to release your first version to npm. After that you can use `nautus release <major|minor|patch>` to publish it again. After that you can use it by using `nautus kelp my-generator`.

# Generating changelogs

If you want automatically generated changelogs based on your GitHub repo, nautus can do that for you. This command is made for automating, so it should be pretty easy to integrate it into a GitHub workflow. The usage of the command is `nautus changelog <user> <repo> <GITHUB_TOKEN> <outputFileName> <releaseTag> [sinceCommit]`. To make this work you need a Personal Access Token from GitHub. You can create one [here](https://github.com/settings/tokens/new?scopes=repo). Make sure the repo scope is granted. Keep in mind: This token will grant access to your GitHub repos, so make sure you trust the services you give it to. As nautus is open source, you might want to take a look at [greencoder001/nautus/main/bin/commands/changelog.js](https://raw.githubusercontent.com/greencoder001/nautus/main/bin/commands/changelog.js) to see how your token is used. After you created a token you can pass it to the command, where `<outPutFileName>` is the markdown file name of the changelog and `<releaseTag>` is the version this changelog is for. `<user>` & `<repo>` should be pretty self-explanatory. `[sinceCommit]` isn't required and is only recommended if you just want to include data since a specific commit. Then you would provide a commit hash here. By default nautus will use data since the latest release. Here's an example command:

```sh
nautus changelog greencoder001 nautus MYGITHUBTOKEN123 changelog.md v1.0.0
```

This will generate a changelog file called `changelog.md` with the version `v1.0.0` for the repo `greencoder001/nautus`.

# Regular Expression Script (RES)

If you are working with tanks, you might need to refactor your code. To do that we use RES, which is a custom language to write replacements using regular expressions. If you want matching syntax highlighting choose `CoffeScript` in your editor. To create a new RES, create a file called `coolnamehere.res` in the `./nautus/refactor` directory. Here you can write your script like this:

```coffee
/regular expression belongs here/g -> 'value to replace with'
/2nd reg(.*?)ex/gi -> 'You entered "' + $1 + '" between reg and ex!'
```

After that you can use it by running `nautus tank main refactor coolnamehere`. If you want a more real example, here's how to refactor commonjs require code to esm:

**require-to-esm.res**:

```coffee
/(const|var|let) (.*?)([ ]*)=([ ]*)require\(["'](.*?)["']\)/g -> 'import ' + $1 + ' from ' + $5 + $6 + $5
```

This will replace `const fs = require('fs')` with `import fs from 'fs'`

The syntax is basically this:

```
RegExp -> String
```

The string is allowed to be concatenated with content of groups by using `String + $groupNumber`

# Git Hooks
Nautus already gives you a ton of commands to make your life easier, but a game changing feature is going to be that nautus can run tests, lint your code & more before and after commits / pushes. And the best part: You have to configure almost nothing for that.
To use nautus and git hooks, first make sure you have a git repository and a nautus project initialized:
```sh
git init
nautus create
```

After that you just have to tell nautus to inject itself into your git hooks:
```sh
nautus hook init
```

And now you can come back to this step every time you like and just use the hook manager to enable & disable hooks:
```sh
nautus hook manager
```
Just press space on every hook you want to activate and confirm using enter.

## Full list of supported hooks
- Lint code before commit
- Lint (fix) code before commit
- Format code before commit
- Test code before commit
- Build code before commit
- Build code before push
- Test code before push
- Generate docs before commit
- Fetch & Push git repo after commit (Not recommended in most cases)
- Auto add files before commit (Not recommended in most cases)
