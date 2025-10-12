"use client"
import Image from "next/image";
import { useUser } from '@/app/provider'
export default function Home() {
  const { user, setUser } = useUser()
  return (
     <div>
      {user ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <Image src={user.picture} alt={user.name} width={100} height={100} />
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
