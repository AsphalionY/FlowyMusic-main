declare module 'pg-promise' {
  namespace pgPromise {
    interface IDatabase<Ext = {}> {
      any<T = any>(query: string, values?: any): Promise<T[]>;
      one<T = any>(query: string, values?: any): Promise<T>;
      none(query: string, values?: any): Promise<null>;
      // Ajoutez d'autres méthodes selon vos besoins
    }
  }

  function pgPromise(options?: any): (connection: any) => pgPromise.IDatabase;
  
  export = pgPromise;
}
