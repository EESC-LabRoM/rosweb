
# ROSWeb

ROSWeb is a web based supervisory system for Robot Operating System (ROS)

It is a web application that manages robots data visualization widgets on a single web page.

Documentation can be fount at [this website][doc].

See the [working demo][demo].

## How to use

As ROSWeb is a tool for [ROS (Robot Operation System)][ros], it depends on a machine running the roscore process.
It is a web application and it depends on websockets provided by [rosbridge server][rosbridge].
Until now, it is being developed and tested using Google Chrome browser.

1. Install RosbridgeSuite package and WebVideoServer

    ```sh
    $ sudo apt-get install ros-indigo-rosbridge-suite
    $ sudo apt-get install ros-indigo-web-video-server
    ```

2. Install dependencies
    ```sh
    $ rosdep update
    $ rosdep install rosbridge_server
    $ rosdep install web_video_server
    ```

3. Launch rosbridge websocket server and web video server
    ```sh
    $ roslaunch rosbridge_server rosbridge_websocket.launch
    $ rosrun web_video_server web_video_server
    ```

4. Open the [working demo page][demo] (or download it to your computer) and connect to your ROS server (usually ws://localhost:9090)

## License

ROSWeb is under MIT license. See the [LICENSE](LICENSE) file for details.

## Authors

See [AUTHORS](AUTHORS.md) file.

A previous version of this work was described in [this paper][paper]

## How to contribute

For contribution and development tools details, see [CONTRIBUTING](CONTRIBUTING.md).

[//]: #

[ros]: <http://www.ros.org>
[doc]: <http://www.labrom.eesc.usp.br/rosweb/typedoc>
[demo]: <http://labrom.eesc.usp.br/rosweb/>
[rosbridge]: <http://www.github.com/RobotWebTools/rosbridge_suite>
[paper]: <https://www.researchgate.net/publication/308519873_DEVELOPMENT_OF_A_MOBILE_ROBOTS_SUPERVISORY_SYSTEM> 
