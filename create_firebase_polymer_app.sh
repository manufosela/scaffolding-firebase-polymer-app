#!/bin/bash

#COLORS TO TEXT MESSAGES
RED='\033[0;31m'
DARKGRAY='\033[1;30m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
# USE: printf "text whitout color ${RED}text with color${NC} text whitout color"

#CTRl+C Capture to exit
trap ctrl_c INT
function ctrl_c() {
    exit 1
}

#HELP INFO
function help_ {
    printf "\n${RED}USE:${NC}\n"
    printf "\t${DARKGRAY}create_firebase_polymer_app.sh\n"
    exit 1
}

#SHOW ERROR MESSAGES
function showError {
    printf >&2 "${YELLOW}\t$1 is required but it's not installed. Aborting.${NC}\n\n";
    if [[ $1 = "meteor" ]]
    then
        printf "${GREEN}You can install $1 with:\n\n\t${BLUE}curl https://install.meteor.com/ | sh${NC}\n"
    elif [[ $1 = "git" ]]
    then
        printf "${GREEN}You can install $1 with:\n\n\t${BLUE}npm install git -g${NC}\n"
    fi
    exit 1
}

#CHECK IF MANDATORY COMMANDS EXISTS
function checkExists {
    command -v $1 >/dev/null 2>&1 || { showError $1; }
}

if [[ "$1" = "--help" || "$1" = "-h" ]]
then
    help_
fi

# INITIAL QUESTIONS
function initialQuestions {
    printf "\n${GREEN}Nombre del proyecto?${NC} "
    read MYAPPNAME
    #printf "\n${GREEN}Número de vistas?${NC} "
    #read NUMVIEW
    printf "\n${GREEN}API Key del proyecto Firebase?${NC} "
    read APIKEY
    printf "\n${BLUE}Se necesita tener instalado node, bower, polymer-cli y firebase-tools.\n${NC}"
    printf "\n${GREEN}Comenzamos la instalación? [Y/n] "
    read RESPONSE
    if [[ $RESPONSE -ne 'Y' && $RESPONSE -ne 'y' && $RESPONSE -ne '' ]]
    then
        exit 1
    fi
    MYAPPNAMECC=$(echo $MYAPPNAME | sed 's/\-//g')
}

# CHECK NODE, BOWER, POLYMER-CLI, FIREBASE-CLI
function checkBasicPrograms {
    checkExists node
    checkExists bower
    checkExists git
    checkExists polymer
    checkExists firebase
}

# CREATE PROYECT PATH
function createProyectPath {
    [[ -d $MYAPPNAME ]] || mkdir $MYAPPNAME
}

# INSTALL FIREBASE INIT
function execFirebaseInit {
    cd $MYAPPNAME
    printf "\n${BLUE}Installing firebase hosting.\n\t${RED}1 - Select 'Hosting' option\n\t2 - Select your firebase project${NC}\n"
    [[ -d tmp ]] || mkdir tmp
    cd tmp
    firebase login && firebase init
    mv database.rules.json firebase.json functions .firebaserc .gitignore ..
    cd ..
    rm -rf tmp
}

# INSTALL POLYMER INIT
function execPolymerInit {
    cd $MYAPPNAME
    printf "\n${BLUE}Installing polymer app-drawer.\n\t${RED} - Selected 'Polymer-2-starter-kit' option${NC}\n\n"
    [[ -d tmp2 ]] || mkdir tmp2
    cd tmp2
    polymer init polymer-2-starter-kit
    cd ..
    mv tmp2 public
    cd ..
}

function modifyApp {
    cd $MYAPPNAME/public
    node ../../config-exe.js ../../config.app.json 
    cd ../..
}

initialQuestions
checkBasicPrograms
createProyectPath
execFirebaseInit
execPolymerInit
modifyApp