#!/usr/bin/env node
import chalk from "chalk";
import clear from "clear";
import { program } from "commander";
import figlet from "figlet";
import fs from "fs";
import path from "path";
import { mkDirPromise, writeFilePromise } from "./utils";

interface Options {
  p: string;
  x: string;
}

clear();
console.log(
  chalk.blue(figlet.textSync("New Component", { horizontalLayout: "full" }))
);

program
  .version("1.0.0", "-v, --vers", "output the current version")
  .description("A CLI to create a new react component.");
program.argument("<name>", "Component name");
program
  .option(
    "-x <extension> --extention <extension>",
    "file extention (jsx || tsx)",
    "tsx"
  )
  .option(
    "-p <path>, --path <path>",
    "change default path from src/components",
    "src/components"
  );

program.parse(process.argv);

const [name] = program.args;

const options = program.opts<Options>();

const componentDir = `${options.p}/${name}`;
const filePath = `${componentDir}/${name}.${options.x}`;
const indexPath = `${componentDir}/index.${options.x}`;

const indexTemplate = `\
export * from './${name}';
export { default } from './${name}';
`;

const componentTemplate = `\
${options.x === "tsx" ? "interface Props {};" : ""}

const ${name}${options.x === "tsx" ? ": React.FC<Props>" : ""} = ({}) => {
	return <div>${name}</div>;
};

export default ${name};
`;

const fullPathToParentDir = path.resolve(options.p);
if (!fs.existsSync(fullPathToParentDir)) {
  console.error(
    `Sorry, you need to create a parent "components" directory.\n(new-component is looking for a directory at ${options.p}).`
  );
  process.exit(0);
}

// Check to see if this component has already been created
const fullPathToComponentDir = path.resolve(componentDir);
if (fs.existsSync(fullPathToComponentDir)) {
  console.error(
    `Looks like this component already exists! There's already a component at ${componentDir}.\nPlease delete this directory and try again.`
  );
  process.exit(0);
}

mkDirPromise(componentDir)
  .then(() => writeFilePromise(indexPath, indexTemplate))
  .then(() => writeFilePromise(filePath, componentTemplate))
  .then(() => {
    console.log(chalk.green(`Component ${name} created!`));
  });
