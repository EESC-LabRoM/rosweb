# How to contribute

## Requirements

1. Install NodeJS
```sh
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```
2. Install gulp-cli globally
```sh
sudo npm install -g gulp-cli
```

## Setup environment

1. Clone the repo

2. Instal NodeJS dependencies
  ```sh
  npm install
  ```
  
3. Build
  ```sh
  gulp build
  ```
  
4. Run
  ```sh
  gulp start
  ```
  
5. Tip: While developing, to keep your local server updated, use the watch task in another terminal:
  ```sh
  gulp watch
  ```
