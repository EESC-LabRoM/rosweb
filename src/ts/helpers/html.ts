///<reference path="../typings/tsd.d.ts" />

export namespace Helper {
  export class FormHelper {
    public typeDefToHtmlForm (elem: any, name: string, formName: string, type: string, typeDefs: any, level: number = 0) {
      let typeDef: any = this.getTypeDef(type, typeDefs);
      let iname: string, itype: string;
      let hType: any = $("<span style='color:#777;'>&nbsp;(" + type + ")</span>").prop('outerHTML');
      if (typeDef == null) {
        let input = this.generateInputField(formName, type);
        $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + hType + input + "</p>"));
      } else if (typeDef.fieldnames.length == 0) {
        $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + hType + "</p>"));
      } else {
        $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + hType + "</p>"));
        let i: any;
        for (i in typeDef.fieldnames) {
          iname = typeDef.fieldnames[i];
          itype = typeDef.fieldtypes[i];
          let prefix = formName != "" ? formName + "." : "";
          this.typeDefToHtmlForm(elem, iname, prefix + iname, itype, typeDefs, level + 1);
        }
      }
    }

    private getTypeDef (type: string, typeDefs: any[], request: number = 1) {
      let typeDef: any;
      let i: any;
      let filtered: any[] = typeDefs.filter((value: any, index: number, array: any[]) => { return type == value.type; });
      if (filtered.length > 0) return filtered[0];
      return null;
    }
    private generateInputField(name: string, type: string) {
      let aInt: string[] = ["int8", "uint8", "int16", "uint16", "int32", "uint32", "int64", "uint64"];
      let aFloat: string[] = ["float32", "float64"];
      let aString: string[] = ["string"];
      let aTime: string[] = ["time", "duration"];
      let aBool: string[] = ["bool"];

      if (aInt.indexOf(type) != -1) {
        return $("<input type='number' name='" + name + "' value='' />").prop('outerHTML');
      }
      else if (aFloat.indexOf(type) != -1) {
        return $("<input type='number' name='" + name + "' value='' />").prop('outerHTML');
      }
      else if (aString.indexOf(type) != -1) {
        return $("<input type='text' name='" + name + "' value='' />").prop('outerHTML');
      }
      else if (aTime.indexOf(type) != -1) {
        return $("<input type='number' name='" + name + "' value='' />").prop('outerHTML');
      }
      else if (aBool.indexOf(type) != -1) {
        return $("<input type='checkbox' name='" + name + "' value='' />").prop('outerHTML');
      } else {
        throw new Error("Unknown primitive type: " + type);
      }
    };
  }
}