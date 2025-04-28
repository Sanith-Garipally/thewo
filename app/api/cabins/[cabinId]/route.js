import { getCabin, getBookedDatesByCabinId } from "@/app/_lib/data-service";

export async function GET(request, {params}) {
    try {
       const param = await params; 
       const { cabinId } = param;
       const [cabin, bookedDates] = await Promise.all([getCabin(cabinId), getBookedDatesByCabinId(cabinId)]);
       return Response.json({cabin, bookedDates});
    } catch (error) {
       return Response.json({message: "Cabin not found!"});
    }
}