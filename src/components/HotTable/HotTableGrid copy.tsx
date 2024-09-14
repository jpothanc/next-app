"use client";
import { useCallback, useState, useRef } from "react";
import "handsontable/dist/handsontable.full.css";
import { HotColumn, HotTable, HotTableClass } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import styles from "./HotTableGrid.module.css"; // Add this import
import { DeletedRow, ModifiedRow, OrderInput } from "@/lib/types";
import { PrismaClient } from "@prisma/client";
import { deleteOrders, saveOrders, updateOrders } from "@/actions/actions";

const prisma = new PrismaClient();

registerAllModules();
interface HotTableGridProps {
  initialColHeaders: any[];
  initialData: any[][];
}

const HotTableGrid1 = ({
  initialColHeaders,
  initialData,
}: HotTableGridProps) => {
  const [data, setData] = useState(initialData);
  const [colHeaders] = useState(initialColHeaders);
  const [modifiedRows, setModifiedRows] = useState<ModifiedRow[]>([]);
  const [deletedRows, setDeletedRows] = useState<DeletedRow[]>([]);
  const hotTableRef = useRef<HotTableClass>(null);

  const handleAfterCreateRow = useCallback((index: number, amount: number) => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;
    // Delay the data retrieval to ensure it's available
    setTimeout(() => {
      const newModifiedRows = Array.from({ length: amount }, (_, i) => {
        const rowData = hot.getDataAtRow(index + i) || [];
        return {
          index: index + i,
          data: rowData,
          isNew: true,
        };
      });

      setModifiedRows((prev) => [...prev, ...newModifiedRows]);
      console.log("New rows:", newModifiedRows);
    }, 0);
  }, []);

  const handleAfterRemoveRow = useCallback((index: number, amount: number) => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;
    console.log("handleAfterRemoveRow");
    setTimeout(() => {
      const removedRows = Array.from({ length: amount }, (_, i) => {
        const rowData = hot.getSourceDataAtRow(index + i);
        // Check if rowData is an array and has at least one element
        return {
          id:
            Array.isArray(rowData) && rowData.length > 0
              ? rowData[0]
              : undefined,
        };
      });

      setDeletedRows((prev) => [...prev, ...removedRows]);
      console.log("Removed rows:", removedRows);
    }, 0);
  }, []);

  const handleSave = useCallback(
    async (formData: FormData) => {
      const currentDateTime = new Date();
      const newOrders: OrderInput[] = [];
      const updatedOrders: OrderInput[] = [];

      modifiedRows.map((row) => {
        const [
          orderid,
          userId,
          userDesk,
          client,
          symbol,
          quantity,
          price,
          entity,
          account,
        ] = row.data;
        const order: OrderInput = {
          userId: String(userId),
          userDesk: String(userDesk),
          client: String(client),
          symbol: String(symbol),
          quantity: Number(quantity),
          price: Number(price),
          entity: String(entity),
          account: String(account),
          dateTime: currentDateTime,
        };
        debugger;
        if (row.isNew) {
          newOrders.push(order);
          console.log(`new order ${order.orderId}`);
        } else {
          order.orderId = String(orderid);
          updatedOrders.push(order);
          console.log(`updated order ${order.orderId}`);
        }

        //data: JSON.stringify(row.data),
      });

      try {
        if (newOrders.length > 0) {
          formData.append("orders", JSON.stringify(newOrders));
          const saveResult = await saveOrders(formData);
          if (saveResult.success) {
            console.log(`Created ${saveResult.count} rows`);
          } else {
            console.error("Error saving new rows:", saveResult.error);
          }
        }
        if (updatedOrders.length > 0) {
          formData.append("orders", JSON.stringify(updatedOrders));
          const updateResult = await updateOrders(formData);
          if (updateResult.success) {
            console.log(`Updated ${updateResult.count} rows`);
          } else {
            console.error("Error updating rows:", updateResult.error);
          }
        }

        setModifiedRows([]);
      } catch (error) {
        console.error("Error saving/updating rows:", error);
      }
    },
    [modifiedRows]
  );

  const handleAfterChange = useCallback(
    (changes: any[] | null, source: string) => {
      if (!changes) return;
      const hot = hotTableRef.current?.hotInstance;
      if (!hot) return;
      

      if (changes && source !== "loadData") {
        debugger;
        console.log("Current modifiedRows:", modifiedRows);

        const newModifiedRows = new Map();

        changes.forEach(([row, prop, oldValue, newValue]) => {
          if (!newModifiedRows.has(row)) {
            debugger;
            const rowData = hot.getDataAtRow(row) || [];
            const existingRow = modifiedRows.find((r) => r.index === row);

            const isNew = existingRow ? existingRow.isNew : !rowData[0];

            console.log(`Row ${row}: isNew=${isNew}, data=`, rowData);

            newModifiedRows.set(row, {
              index: row,
              data: rowData,
              isNew: isNew,
            });
          }
        });

        setModifiedRows((prev) => {
          const updatedRows = [...prev];
          debugger;
          newModifiedRows.forEach((newRow) => {
            const existingIndex = updatedRows.findIndex(
              (r) => r.index === newRow.index
            );
            if (existingIndex !== -1) {
              updatedRows[existingIndex] = newRow;
              console.log(
                `Updated existing row ${newRow.index}, isNew=${newRow.isNew}`
              );
            } else {
              updatedRows.push(newRow);
              console.log(
                `Added new row ${newRow.index}, isNew=${newRow.isNew}`
              );
            }
          });
          console.log("Updated modifiedRows:", updatedRows);
          return updatedRows;
        });
      }
    },
    [modifiedRows]
  ); // Add modifiedRows to the dependency array

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
          // colWidths={[170, 222, 130, 120, 120, 130, 156]}
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
          afterRemoveRow={handleAfterRemoveRow}
          afterChange={handleAfterChange} // Add this line
          licenseKey="non-commercial-and-evaluation"
        ></HotTable>
        <form action={handleSave}>
          <button
            type="submit"
            className="sel bg-blue-500 text-white p-2 rounded-md mt-5"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default HotTableGrid1;
