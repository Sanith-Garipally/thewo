import DateSelector from '@/app/_components/DateSelector';
import ReservationForm from '@/app/_components/ReservationForm';
import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";


async function Reservations({ cabin }) {
    const [settings, bookedDates] = await Promise.all([getSettings(), getBookedDatesByCabinId(cabin.id)]);
  return (
    <div className='grid grid-cols-2 border border-primary-800 min-h-[500px]'>
      <DateSelector className='mb-4' settings={settings} bookedDates={bookedDates} cabin={cabin}/>
      <ReservationForm cabin={cabin}/>
    </div>
  );
}

export default Reservations;
