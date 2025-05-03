'use server';
import { auth, signIn, signOut } from '@/app/_lib/auth';
import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getBookings } from './data-service';

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) {
    throw new Error('You must be logged in!');
  }
  const newBookingData = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
    extrasPrice: Number(formData.get('extrasPrice') || 0),
    totalPrice: Number(bookingData.cabinPrice) + Number(formData.get('extrasPrice') || 0),
    isPaid: Boolean(formData.get('isPaid')),
    hasBreakfast: Boolean(formData.get('hasBreakfast')),
    status: 'unconfirmed'
  }

  const { error } = await supabase
    .from('bookings')
    .insert([newBookingData])


  if (error) {
    console.error(error);
    throw new Error('Booking could not be created');
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect('/cabins/Thankyou');
}

export async function updateProfile(formData) {
  const session = await auth();
  if (!session) {
    throw new Error('You must be logged in!');
  }
  const nationalID = formData.get('nationalID');
  const [nationality, countryFlag] = formData.get('nationality').split('%');

  if (!/^[0-9]{6,16}$/.test(nationalID)) {
    throw new Error('Please Provide NationalityID!');
  }

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId);

  if (error) {
    throw new Error('Guest could not be updated');
  }

  //   revalidatePath("/account/profile");
  redirect('/account/profile');
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) {
    throw new Error('You must be logged in!');
  }
    // await new Promise((res) => setTimeout(res, 4000));

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((o) => o.id);

  if (!guestBookingsIds.includes(bookingId)) {
    throw new Error('You are not allowed to delete this booking!');
  }

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  revalidatePath('/account/reservations');
}

export async function editReservation(formData) {
  const session = await auth();
  if (!session) {
    throw new Error('You must be logged in!');
  } 

  const bookingId = formData.get('bookingId');
  const guestId = formData.get('guestId');

  if (session.user.guestId != guestId) {
    throw new Error('You are not allowed to edit this booking!');
  }

  const numGuests = formData.get('numGuests');
  const observations = formData.get('observations');

  const updatedFields = { numGuests: Number(numGuests), observations };

  const { error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }

  revalidatePath('/account/reservations');
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  redirect('/account/reservations');

}

export async function signInAction() {
  await signIn('google', {
    redirectTo: '/account',
  });
}

export async function signOutAction() {
  await signOut({
    redirectTo: '/',
  });
}
