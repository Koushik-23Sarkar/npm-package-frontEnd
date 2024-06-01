#!/usr/bin/env node

import chalk from 'chalk';
import readline from "readline";
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
const execPromise = util.promisify(exec);

const help =
`

${chalk.yellow.bold("This NPM package helps you to create frontEnd Project.")}


if you run: ${chalk.blue.bold("npx np-new -fe <project-name>")+"\n"+"\n"+
chalk.yellow("then it will ask some question.")+"\n"+
chalk.yellow("afterthat it will create a basic frontEnd setup...")+"\n"+"\n"+
chalk.red("NOTE: In This Version, React+Tailwind setup will not work...")+"\n"+"\n"+
chalk.yellow("So, if you give-----")}
Do you need React? (y/n) y
Do you need tailwind? (y/n) y
${chalk.red("then, it will not work.")}${chalk.yellow(" But in upcoming versions we will add it...")}


`;

const re1 =
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <h1>HRLLO WORLD</h1>
</body>
</html>
                `;
const re3=
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body class="bg-slate-600">
        <h1 class="text-4xl text-white">Helo World!</h1>
</body>
</html>
                `;

const re2 =
`@tailwind base;
@tailwind components;
@tailwind utilities;
`;

const re4=
`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}

`;

const rt1 = 
`/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

const rt2 =
`import './App.css';

export default function App() {
    return (
      <h1 className="text-3xl font-bold">
        Hello world!
      </h1>
    )
  }
`;


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query){
    return new Promise((resolve)=>{
        rl.question(query,resolve)
    })  
}

function removingReactFile(){
    let fileName = process.cwd()+"\\public\\vite.svg";
    fs.unlinkSync(fileName);
    let fileName1 = process.cwd()+"\\src\\assets\\react.svg";
    fs.unlinkSync(fileName1);

    const pathName = process.cwd()+"\\src";
    const re = `
import React from 'react';
import './App.css';
            
export default function App(){
    return(
        <>
            <div>Hello World</div>
        </>
    )
}
        `;
    fs.writeFileSync(pathName+'\\App.jsx',re);
}
async function reactSetUpDownload(frontEndProjectName){
        await execPromise(`npm create vite@latest ${frontEndProjectName} -- --template react`,  () => {   //npm create vite@latest my-vue-app -- --template react
            console.log("npm install start......");
            console.log(chalk.blue("Some time it take some time.So, plz wait..."));
            const targetDir =  process.cwd()+"\\"+frontEndProjectName;
            process.chdir(targetDir);
            
            removingReactFile();
            exec('npm install', () => {
    
                //console.log(`Output: ${stdout}`);
                console.log(chalk.yellow("Setup complete.........."));

                console.log(`cd ${frontEndProjectName}`);
                console.log("npm run dev");
            });
        })
}

function tailwindSetUpDownload(frontEndProjectName){
    console.log("Only tailwind Setup....");
    console.log(chalk.blue("Some time it take some time.So, plz wait..."));
    exec(`mkdir ${frontEndProjectName}`,()=>{
        const filePathTail = process.cwd()+"\\"+frontEndProjectName;
        exec("npx tailwindcss init",{cwd:filePathTail},()=>{
            process.chdir(filePathTail);
            exec("mkdir dist src",async ()=>{
                let diry = process.cwd()+"\\dist";
                execPromise("touch index.html",{cwd: diry},()=>{
                    diry = process.cwd()+"\\src";
                     exec("touch input.css",{cwd: diry},()=>{
                        fs.writeFileSync(process.cwd()+'\\dist\\index.html',re3);
                        fs.writeFileSync(process.cwd()+'\\src\\input.css',re2);
                        fs.writeFileSync(process.cwd()+'\\tailwind.config.js',re4);
                        const inputFileForTailwind = process.cwd()+"\\src\\input.css";
                        const outputFileForTailwind = process.cwd()+"\\dist\\style.css";
                        exec(`npx tailwindcss -i ${inputFileForTailwind} -o ${outputFileForTailwind}`,()=>{
                            console.log("your tailwind css setup is complete!")
                            console.log(chalk.yellow(`cd ${frontEndProjectName}\n`));
                            console.log(chalk.yellow("code . or Open your project in VS code"));
                            console.log(chalk.yellow("Open terminal and then :\n"));
                            console.log(`npx tailwindcss -i ./src/input.css -o ./dist/style.css --watch`);
                        })
                     });
                });
            })
        })
    })
    
}

function ReacttailwindSetUpDownload(frontEndProjectName){
    exec(`npm create vite@latest ${frontEndProjectName} -- --template react`,()=>{
        const pathRTname = process.cwd()+"\\"+frontEndProjectName;
        console.log("NPM install start...");
        console.log(chalk.blue("Some time it take some time.So, plz wait..."));
        exec("npm install -D tailwindcss postcss autoprefixer",{cwd: pathRTname},()=>{
            console.log("NPM install End...")
            exec("npx tailwindcss init -p",{cwd: pathRTname},()=>{
                fs.writeFileSync(pathRTname+`\\tailwind.config.js`,rt1);
                fs.writeFileSync(pathRTname+`\\src\\index.css`,re2);
                fs.writeFileSync(pathRTname+`\\src\\App.jsx`,rt2);
                fs.unlinkSync(pathRTname+"\\public\\vite.svg");
                fs.unlinkSync(pathRTname+"\\src\\assets\\react.svg");

                console.log(chalk.yellow("Setup complete.........."));

                console.log(`cd ${frontEndProjectName}`);
                console.log("npm run dev");
            })
        })
    })
}

function createIndexHtmlStyleCssFiles(frontEndProjectName){
    console.log("HTML CSS setup....");
    exec(`mkdir ${frontEndProjectName}`,()=>{
        const filePath = process.cwd()+"\\"+frontEndProjectName;
        exec("touch index.html", { cwd: filePath },()=>{
            exec("touch style.css",{ cwd: filePath },()=>{
                process.chdir(filePath);
                fs.writeFileSync(process.cwd()+'\\index.html',re1);

                console.log(chalk.yellow(`cd ${frontEndProjectName}\n`));
                console.log(chalk.yellow("code . or Open your project in VS code"));
            })
        })
    });
    
}



function frontEnd(frontEndProjectName){
    console.log(frontEndProjectName);
    async function ReactTailwind(){
        const reactYesNo = await askQuestion("Do you need React? (y/n) ");
        const tailwindYesNo = await askQuestion("Do you need tailwind? (y/n) ");
        rl.close();

        let reactDownload = ((reactYesNo.toLowerCase() == "y") ? true : false) ;
        let tailwindDownload = ((tailwindYesNo.toLowerCase() == "y") ? true : false) ;
        
        if(reactDownload==true && tailwindDownload==false){
            reactSetUpDownload(frontEndProjectName);
        }
        else if(reactDownload==false && tailwindDownload==true){
                tailwindSetUpDownload(frontEndProjectName);
        }else if(reactDownload==true && tailwindDownload==true){
                ReacttailwindSetUpDownload(frontEndProjectName)
            
        }else{
                console.log("index.html and style.css creating....");
                createIndexHtmlStyleCssFiles(frontEndProjectName);
        }

    };
    ReactTailwind();
}

export function Testfun(){
    var frontEndProjectName;

    const input = process.argv;

    if(input.length == 2){      //npx np-new
        console.log(chalk.yellow("if you need frontEnd setup: ")+chalk.blue.bold("npx np-new -fe <your-frontEnd-Project-name>"));
        console.log(chalk.yellow("if you need help: ")+chalk.blue.bold("npx np-new -h"));    
        process.exit(0);
    }
    if(input[2].toLowerCase()=="-h"){   //npx np-new -h
        console.log(help);
        process.exit(0);
    }
    if(input[2].toLowerCase() == '-fe'){  //npx np-new -fe
            frontEndProjectName = input[3];
            console.log(frontEndProjectName);
            console.log("frontEnd");
            frontEnd(frontEndProjectName);
    }else{                                          //npx test ahs;oivshdvociufdsh
        console.log("Plz Enter right command");
    }
}

Testfun();