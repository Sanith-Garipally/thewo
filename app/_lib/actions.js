'use server';
import { auth, signIn, signOut } from '@/app/_lib/auth';
import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
    .eq('id', session.user.guestId)

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
  
    const  error } = await supabase.from('bookings').delete().eq('id', bookingId);

    if (error) {
      throw new Error('Booking could not be deleted');
    }
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
