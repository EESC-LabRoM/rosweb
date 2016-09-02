
# ROSWeb

ROSWeb is a web based supervisory system for Robot Operating System (ROS).

It is a web application that manages robots data visualization widgets on a single web page.

Documentation can be fount at [this website][doc].

See the [working demo][demo].

## How to use

As ROSWeb is a tool for [ROS (Robot Operation System)][ros], it depends on a machine running the roscore process.
It is a web application and it depends on websockets provided by [rosbridge server][rosbridge].

1. Install rosbridge package

    ```sh
    $ sudo apt-get install ros-\<your_distro\>-rosbridge-suite
    ```

2. Launch rosbridge websocket server
    ```sh
    roslaunch rosbridge_server rosbridge_websocket.launch
    ```

3. Open the [working demo page][demo] (or download it to your computer) and connect to your ROS server (usually on ws://localhost:9090)

## License

ROSWeb is under MIT license. See the [LICENSE](LICENSE) file for details.

## Authors

See [AUTHORS](AUTHORS.md) file.

## How to contribute

For contribution and development tools details, see the [CONTRIBUTION](CONTRIBUTION.md).

[//]: #

[ros]: <http://www.ros.org>
[doc]: <http://www.labrom.eesc.usp.br/rosweb/typedoc>
[demo]: <http://www.labrom.eesc.usp.br/rosweb/demo>
[rosbridge]: <http://www.github.com/RobotWebTools/rosbridge_suite>
