import { KintoneRestAPIClient } from "@kintone/rest-api-client";

export class KintoneApiCustmize {
  private client: KintoneRestAPIClient;

  constructor() {
    this.client = new KintoneRestAPIClient();
  }

  // 取得 (自動で全件取得 or limit付き取得を判断)
  public async getRecords<T extends Record<string, any>>({
    app,
    query,
    fields,
  }: {
    app: number | string;
    query?: string;
    fields?: string[];
  }) {
    // limitが含まれる場合は通常のgetRecords (高速化のため)
    if (query && query.includes("limit")) {
      const { records } = await this.client.record.getRecords({
        app: app,
        query: query,
        fields: fields as any,
        totalCount: false,
      });
      return records as unknown as T[];
    }
    // それ以外は全件取得 (カーソルAPI等を自動使用)
    const records = await this.client.record.getAllRecords({
      app: app,
      condition: query,
      fields: fields as any,
    });
    return records as unknown as T[];
  }

  // 1件追加
  public async addRecord({
    app,
    record,
  }: {
    app: number | string;
    record: any;
  }) {
    return await this.client.record.addRecord({ app: app, record: record });
  }

  // 【追加】 一括追加 (addAllRecords)
  public async addAllRecords({
    app,
    records,
  }: {
    app: number | string;
    records: any[];
  }) {
    return await this.client.record.addAllRecords({
      app: app,
      records: records,
    });
  }

  // 【追加】 一括更新 (updateAllRecords)
  public async updateAllRecords({
    app,
    records,
  }: {
    app: number | string;
    records: any[];
  }) {
    return await this.client.record.updateAllRecords({
      app: app,
      records: records,
    });
  }
}
