import { Request } from "express";
import { Permissions } from "../../entities/auth/Permissions";
import StandardRepo from "../StandardRepo";

class PermissionsRepository extends StandardRepo<Permissions> {
  constructor() {
    super(Permissions);
  }

  // Get Index
  async getIndex(request: Request): Promise<{
    data: Permissions[];
    meta?: Meta;
  }> {
    let data: {
      data: Permissions[];
      meta?: Meta;
    } = {
      data: [],
    };

    // Check if the request has the 'table' query parameter
    const hasTableParam = request.query.table !== undefined;

    if (hasTableParam) {
      const nameToPath = {
        id: "id",
        name: "name",
        slug: "slug",
      };
      const searchable = this.delArrByKey(nameToPath, ["id"]);

      data = await this.queries(request, nameToPath, searchable, true);
    } else {
      data = await this.getList(request);
    }

    return data;
  }

  // Remove keys from an object
  private delArrByKey(
    obj: { [key: string]: string },
    keysToRemove: string[]
  ): { [key: string]: string } {
    const newObj = { ...obj };
    for (const key of keysToRemove) {
      delete newObj[key];
    }
    return newObj;
  }
}

export default new PermissionsRepository();
