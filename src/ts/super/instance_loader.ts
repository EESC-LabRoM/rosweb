class InstanceLoader {
  public getInstance<T>(context: Object, name: string, ...args: any[]): T {
    var instance = Object.create(context[name].prototype);
    instance.constructor.apply(instance, args);
    return <T>instance;
  }
}

export var instance_loader: InstanceLoader = new InstanceLoader();
