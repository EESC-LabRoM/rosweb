export class Tab {
  
  public id: number;
  public name: string;
  
  constructor(name?: string) {
    if(name) {
      this.name = name;
    }
  }
  
}