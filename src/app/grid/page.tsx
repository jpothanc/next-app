import HotTableGrid from "@/components/HotTable/HotTableGrid";
import NavBar from "@/components/NavBar";
import prisma from "@/lib/db";

const MyTable = async () => {
  let colHeaders: string[] = [];
  let orders: any[] = [];
  let data: any[] = [];

  try {
    orders = await prisma.order.findMany();
    colHeaders = orders.length > 0 ? Object.keys(orders[0]) : [];
    data = orders.map(Object.values);
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <NavBar />
      <div className="flex justify-center items-center h-screen border">
        <HotTableGrid initialColHeaders={colHeaders} initialData={data} />
      </div>
    </>
  );
};

export default MyTable;
