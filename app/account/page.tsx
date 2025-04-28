import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Guest Area",
};

const Account:React.FC = () => {
  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
    Welcome Sanith!
  </h2>
  )
}

export default Account