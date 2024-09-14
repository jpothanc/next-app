"use client";
import { useCallback, useState, useRef } from "react";
import "handsontable/dist/handsontable.full.css";
import { HotColumn, HotTable, HotTableClass } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import styles from "./HotTableGrid.module.css"; // Add this import
import { DeletedRow, ModifiedRow, OrderInput } from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import { deleteOrders, saveOrders, updateOrders } from "@/actions/actions";

registerAllModules();

interface HotTableGridProps {
  initialColHeaders: any[];
  initialData: any[][];
}

const HotTableGrid = ({
  initialColHeaders,
  initialData,
}: HotTableGridProps) => {
  //initial data to be displayed in the table
  const [data, setData] = useState(initialData);
  const [colHeaders] = useState(initialColHeaders);

  //added rows are the rows that are added to the table
  const [addedRows, setAddedRows] = useState<Map<number, string>>(new Map());
  const [modifiedRows, setModifiedRows] = useState<Map<number, string>>(
    new Map()
  );
  const [deletedRows, setDeletedRows] = useState<Map<number, string>>(
    new Map()
  );
  const hotTableRef = useRef<HotTableClass>(null);

  const handleAfterCreateRow = (index: number, amount: number) => {
    console.log("Created row:", index, amount);
    setAddedRows((prev) => new Map(prev).set(index, ""));
  };

  const handleAfterRemoveRow = (
    index: number,
    amount: number,
    physicalRows: number[]
  ) => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;
    console.log("Removed rows:", index, amount);

    const rowData = hot.getSourceDataAtRow(index);
    const id = Array.isArray(rowData) ? rowData[0] : rowData.id;
    setDeletedRows((prev) => new Map(prev).set(index, String(id)));

    // Shift indexes in modifiedRows and addedRows
    setModifiedRows((prev) => {
      const updated = new Map();
      prev.forEach((value, key) => {
        if (key > index) {
          updated.set(key - 1, value);
        } else if (key < index) {
          updated.set(key, value);
        }
      });
      return updated;
    });

    setAddedRows((prev) => {
      const updated = new Map();
      prev.forEach((value, key) => {
        if (key > index) {
          updated.set(key - 1, value);
        } else if (key < index) {
          updated.set(key, value);
        }
      });
      return updated;
    });
  };

  const handleAfterChange = (changes: any[] | null, source: string) => {
    if (!changes) return;
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;
    console.log(`source: ${source}`);
    if (source != "edit") return;

    console.log("Current modifiedRows:", addedRows);

    const newModifiedRows = new Map(modifiedRows);
    const newAddedRows = new Map(addedRows);
    const processedRows = new Map();

    changes.forEach(([row, prop, oldValue, newValue]) => {
      if (processedRows.has(row)) return;
      processedRows.set(row, true);
      //if the row is not in the new row collection and not in the modified row collection,
      //then add it to the modified row collection
      if (source == "edit") {
        console.log("source is edit");
        if (!newAddedRows.has(row) && !newModifiedRows.has(row)) {
          const rowData = hot.getDataAtRow(row);
          if (rowData[0] != null) {
            newModifiedRows.set(row, String(rowData[0]));
            console.log("Added row to modifiedRows:", row);
          }
        }
      }
    });

    setModifiedRows(newModifiedRows);
    setAddedRows(newAddedRows);
  };

  const handleSave = async () => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;
    console.log("New rows:", addedRows);
    addedRows.forEach((value, key) => {
      const rowData = hot.getDataAtRow(key);
      console.log("New row:", key, value);
      console.log(rowData);
    });
    console.log("Modified rows:", modifiedRows);
    modifiedRows.forEach((value, key) => {
      const rowData = hot.getDataAtRow(key);
      console.log("Modified row:", key, value);
      console.log(rowData);
    });
    console.log("Deleted rows:", deletedRows);
    deletedRows.forEach((value, key) => {
      console.log("Deleted row:", key, value);
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <HotTable
          ref={hotTableRef}
          className={`htDarkTheme ${styles.darkTheme}`} // Add the custom CSS class
          height={450}
          width={1000}
          autoColumnSize={true}
          stretchH="all"
          columns={[
            { data: 0, readOnly: true }, // First column data is read-only
            ...Array(colHeaders.length - 1).fill({}), // Other columns remain editable
          ]}
          colHeaders={colHeaders}
          data={data}
          dropdownMenu={true}
          hiddenColumns={{
            indicators: true,
          }}
          contextMenu={true}
          multiColumnSorting={true}
          filters={true}
          rowHeaders={true}
          headerClassName="htLeft"
          manualRowMove={true}
          autoWrapRow={true}
          copyPaste={{
            pasteMode: "shift_down",
          }}
          afterCreateRow={handleAfterCreateRow}
          beforeRemoveRow={handleAfterRemoveRow}
          afterChange={handleAfterChange} // Add this line
          licenseKey="non-commercial-and-evaluation"
        ></HotTable>
        {
          <form action={handleSave}>
            <button
              type="submit"
              className="sel bg-blue-500 text-white p-2 rounded-md mt-5"
            >
              Save Changes
            </button>
          </form>
        }
      </div>
    </>
  );
};

export default HotTableGrid;
