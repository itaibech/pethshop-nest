export class Utils {

  public static isSimpleProperty(property: string) {
    return property === "type" || property === "name" || property === "age" || property === "color";
  }

  public static isNumber(value: any): boolean {
    if (typeof value === "string") {
      return !isNaN(Number(value));
    }
    return false;
  }
  public static  GetNumberOrString(value) {
    return this.isNumber(value) ? Number(value) : value;
  }
}
