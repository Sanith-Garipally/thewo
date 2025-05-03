import { getBooking, getCabin } from '@/app/_lib/data-service';
import { editReservation } from '@/app/_lib/actions';
import SubmitButton from '@/app/_components/SubmitButton';

export const metadata = {
  title: 'Edit Reservation',
};

export default async function Page({ params }) {
  const param = await params;
  const booking = await getBooking(param.bookingId);
  const cabin = await getCabin(booking.cabinId);
  // CHANGE
  const reservationId = param.bookingId;
  const maxCapacity = cabin.maxCapacity;

  return (
    <div>
      <h2 className='font-semibold text-2xl text-accent-400 mb-7'>
        Edit Reservation #{reservationId}
      </h2>
      <form
        action={editReservation}
        className='bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col'
      >
        <input name='bookingId' value={booking.id} hidden readOnly />
        <input name='guestId' value={booking.guestId} hidden readOnly />
        <div className='space-y-2'>
          <label htmlFor='numGuests'>How many guests?</label>
          <select
            name='numGuests'
            id='numGuests'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            required
            defaultValue={booking.numGuests}
          >
            <option value='' key=''>
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            name='observations'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            defaultValue={booking.observations}
          />
        </div>

        <div className='flex justify-end items-center gap-6'>
          <SubmitButton pendingLabel='Updating...'>
            Update Reservation
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
