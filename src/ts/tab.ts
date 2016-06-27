export class Tab {
  
  id: number;
  name: string;
  
  constructor(name?: string) {
    if(name) {
      this.name = name;
    }
  }
  
}