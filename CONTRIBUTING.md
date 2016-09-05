# How to contribute

## Requirements

1. Install NodeJS
```sh
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Suggestions

1. Install Google Chrome Web Browser (better to debug websockets comm)
```sh
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update               
sudo apt-get install google-chrome-stable
```

## Setup environment

1. Clone the repo

2. Instal NodeJS dependencies
  ```sh
  npm install
  ```
  
3. Install Gulp globally
  ```sh
  sudo npm install -g gulp-cli
  ```
  
4. Download TypeScript definition files
  ```sh
  gulp install
  ```
  
5. Build
  ```sh
  gulp build
  ```
  
6. Run
  ```sh
  gulp start
  ```
  
7. Tip: While developing, to keep your local server updated, use the watch task:
  ```sh
  gulp watch
  ```
