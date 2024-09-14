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

const HotTableGrid2 = ({
  initialColHeaders,
  initialData,
}: HotTableGridProps) => {
  const [data, setData] = useState(initialData);
  const [colHeaders] = useState(initialColHeaders);

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

    // const rowsToBeRemoved = physicalRows.map((row) => hot.getDataAtRow(row));
    // debugger;

    // const rowData = hot.getSourceDataAtRow(index);
    // const rowData1 = hot.getSourceDataAtRow(index + 1);

    // const tempAddedRows = new Map(addedRows);
    // const tempModifiedRows = new Map(modifiedRows);

    // setDeletedRows((prev) => {
    //   const newDeletedRows = new Map(prev);
    //   if (tempAddedRows.has(index)) {
    //     tempAddedRows.delete(index);
    //   } else if (tempModifiedRows.has(index)) {
    //     tempModifiedRows.delete(index);
    //   } else {
    //     const rowData = rowsToBeRemoved[0];
    //     if (rowData != null) {
    //       newDeletedRows.set(index, String(rowData[0]));
    //     }
    //   }
    //   return newDeletedRows;
    // });

    // setAddedRows(tempAddedRows);
    // setModifiedRows(tempModifiedRows);
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
    const newDeletedRows = new Map(deletedRows);
    const processedRows = new Map();

    changes.forEach(([row, prop, oldValue, newValue]) => {
      if (processedRows.has(row)) return;
      processedRows.set(row, true);
      //Handle deleted rows when delete from keyboard(cut, delete)
      if (oldValue != null && newValue == null) {
        console.log("Row is being deleted:", row);
        if (newAddedRows.has(row)) {
          newAddedRows.delete(row);
        } else if (newModifiedRows.has(row)) {
          newModifiedRows.delete(row);
        } else if (!newDeletedRows.has(row)) {
          newDeletedRows.set(row, String(oldValue));
        }
      } else {
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
      }
    });

    setModifiedRows(newModifiedRows);
    setAddedRows(newAddedRows);
    setDeletedRows(newDeletedRows);
  };

  const handleSave = async () => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;
    console.log("New rows:", addedRows);
    console.log("Modified rows:", modifiedRows);
    console.log("Deleted rows:", deletedRows);
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
          // afterRemoveRow={handleAfterRemoveRow}
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

export default HotTableGrid2;
