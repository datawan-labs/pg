import { useDBStore } from "@/stores";

export const DatabaseSchema = () => {
  const active = useDBStore((state) => state.active!);

  const schema = useDBStore((state) => state.databases[active.name].schema);

  return (
    <div className="h-full overflow-auto p-2">
      {schema?.map((s) => (
        <div key={s.schema}>
          <div>{s.schema}</div>
          <div>
            {s.tables.map((i) => (
              <div key={i.table}>
                <div>{i.table}</div>
                <div>{i.type}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
