const shell = require('shelljs');
const fs = require('fs');
const translationsFile = fs.readFileSync('./assets/locales/en.json');
const translations = JSON.parse(translationsFile);
const translationsFilePath = 'src/translations.ts';

function toUpperCase(string) {
  return string.replace(/\./g, '_').toUpperCase();
}

function generateEnumLine(key) {
  shell
    .ShellString(`${toUpperCase(key)} = "${key}",\n`)
    .toEnd(translationsFilePath);
}

function generateTranslationsEnum() {
  shell
    .ShellString('/* AUTO GENERATED FILE. DO NOT MODIFY !!! */\n\n')
    .to(translationsFilePath);

  const keys = Object.keys(translations);
  shell.ShellString('export enum Translation {\n').toEnd(translationsFilePath);
  for (let i = 0; i < keys.length; i++) {
    generateEnumLine(keys[i]);
  }
  shell.ShellString('}\n\n').toEnd(translationsFilePath);
  shell
    .ShellString('/* AUTO GENERATED FILE. DO NOT MODIFY !!! */')
    .toEnd(translationsFilePath);
}

generateTranslationsEnum();

shell.exec(' tslint --fix src/translations.ts');
