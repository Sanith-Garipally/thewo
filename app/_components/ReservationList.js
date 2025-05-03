'use client';

import ReservationCard from '@/app/_components/ReservationCard';
import { deleteReservation } from '@/app/_lib/actions';
import { useOptimistic } from 'react';

function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDeleteFunc] = useOptimistic(
    bookings,
    (currBookings, bookingId) => {
      return currBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  //   Passing this as Prop to Delete Reservation Component using Prop Drilling
  const handleDelete = async (bookingId) => {
    //   Optimistic Delete
    optimisticDeleteFunc(bookingId);
    //   Actual Deletion
    await deleteReservation(bookingId);
  };

  return (
    <ul className='space-y-6'>
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
