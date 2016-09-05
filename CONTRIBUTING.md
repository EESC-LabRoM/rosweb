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

2. Clone submodules
  ```sh
  git submodule init
  git submodule update
  ```

3. Instal NodeJS dependencies
  ```sh
  npm install
  ```
  
4. Install Gulp globally
  ```sh
  sudo npm install -g gulp-cli
  ```
  
5. Download TypeScript definition files
  ```sh
  gulp install
  ```
  
6. Build
  ```sh
  gulp build
  ```
  
7. Run
  ```sh
  gulp start
  ```
  
8. Tip: While developing, to keep your local server updated, use the watch task:
  ```sh
  gulp watch
  ```
